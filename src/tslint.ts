/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as ts from "typescript";

import {
    DEFAULT_CONFIG,
    findConfiguration,
    findConfigurationPath,
    getRelativePath,
    getRulesDirectories,
    loadConfigurationFromPath,
} from "./configuration";
import { EnableDisableRulesWalker } from "./enableDisableRules";
import { findFormatter } from "./formatterLoader";
import { IFormatter } from "./language/formatter/formatter";
import { RuleFailure } from "./language/rule/rule";
import { TypedRule } from "./language/rule/typedRule";
import { getSourceFile } from "./language/utils";
import { ILinterOptions, ILinterOptionsRaw, LintResult } from "./lint";
import { loadRules } from "./ruleLoader";
import { arrayify } from "./utils";

class Linter {
    public static VERSION = "3.13.0";

    public static findConfiguration = findConfiguration;
    public static findConfigurationPath = findConfigurationPath;
    public static getRulesDirectories = getRulesDirectories;
    public static loadConfigurationFromPath = loadConfigurationFromPath;

    private options: ILinterOptions;

    /**
     * Creates a TypeScript program object from a tsconfig.json file path and optional project directory.
     */
    public static createProgram(configFile: string, projectDirectory?: string): ts.Program {
        if (projectDirectory === undefined) {
            const lastSeparator = configFile.lastIndexOf("/");
            if (lastSeparator < 0) {
                projectDirectory = ".";
            } else {
                projectDirectory = configFile.substring(0, lastSeparator + 1);
            }
        }

        const {config} = ts.readConfigFile(configFile, ts.sys.readFile);
        const parsed = ts.parseJsonConfigFileContent(config, {readDirectory: ts.sys.readDirectory}, projectDirectory);
        const host = ts.createCompilerHost(parsed.options, true);
        const program = ts.createProgram(parsed.fileNames, parsed.options, host);

        return program;
    }

    /**
     * Returns a list of source file names from a TypeScript program. This includes all referenced
     * files and excludes declaration (".d.ts") files.
     */
    public static getFileNames(program: ts.Program): string[] {
        return program.getSourceFiles().map(s => s.fileName).filter(l => l.substr(-5) !== ".d.ts");
    }

    constructor(private fileName: string, private source: string, options: ILinterOptionsRaw, private program?: ts.Program) {
        this.options = this.computeFullOptions(options);
    }

    public lint(): LintResult {
        const failures: RuleFailure[] = [];
        let sourceFile: ts.SourceFile;
        if (this.program) {
            sourceFile = this.program.getSourceFile(this.fileName);
            // check if the program has been type checked
            if (!("resolvedModules" in sourceFile)) {
                throw new Error("Program must be type checked before linting");
            }
        } else {
            sourceFile = getSourceFile(this.fileName, this.source);
        }

        // walk the code first to find all the intervals where rules are disabled
        const rulesWalker = new EnableDisableRulesWalker(sourceFile, {
            disabledIntervals: [],
            ruleName: "",
        });
        rulesWalker.walk(sourceFile);
        const enableDisableRuleMap = rulesWalker.enableDisableRuleMap;

        const rulesDirectories = this.options.rulesDirectory;
        const configuration = this.options.configuration.rules;
        const configuredRules = loadRules(configuration, enableDisableRuleMap, rulesDirectories);
        const enabledRules = configuredRules.filter((r) => r.isEnabled());
        for (let rule of enabledRules) {
            let ruleFailures: RuleFailure[] = [];
            if (this.program && rule instanceof TypedRule) {
                ruleFailures = rule.applyWithProgram(sourceFile, this.program);
            } else {
                ruleFailures = rule.apply(sourceFile);
            }
            for (let ruleFailure of ruleFailures) {
                if (!this.containsRule(failures, ruleFailure)) {
                    failures.push(ruleFailure);
                }
            }
        }

        let formatter: IFormatter;
        const formattersDirectory = getRelativePath(this.options.formattersDirectory);

        const Formatter = findFormatter(this.options.formatter, formattersDirectory);
        if (Formatter) {
            formatter = new Formatter();
        } else {
            throw new Error(`formatter '${this.options.formatter}' not found`);
        }

        const output = formatter.format(failures);
        return {
            failureCount: failures.length,
            failures: failures,
            format: this.options.formatter,
            output: output,
        };
    }

    private containsRule(rules: RuleFailure[], rule: RuleFailure) {
        return rules.some((r) => r.equals(rule));
    }

    private computeFullOptions(options: ILinterOptionsRaw = {}): ILinterOptions {
        if (typeof options !== "object") {
            throw new Error("Unknown Linter options type: " + typeof options);
        }

        let { configuration, formatter, formattersDirectory, rulesDirectory } = options;

        return {
            configuration: configuration || DEFAULT_CONFIG,
            formatter: formatter || "prose",
            formattersDirectory: formattersDirectory,
            rulesDirectory: arrayify(rulesDirectory).concat(arrayify(configuration.rulesDirectory)),
        };
    }
}

// tslint:disable-next-line:no-namespace
namespace Linter {}

export = Linter;
