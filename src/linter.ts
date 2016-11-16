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

import * as fs from "fs";
import * as ts from "typescript";

import {
    DEFAULT_CONFIG,
    IConfigurationFile,
    findConfiguration,
    findConfigurationPath,
    getRelativePath,
    getRulesDirectories,
    loadConfigurationFromPath,
} from "./configuration";
import { EnableDisableRulesWalker } from "./enableDisableRules";
import { findFormatter } from "./formatterLoader";
import { ILinterOptions, LintResult } from "./index";
import { IFormatter } from "./language/formatter/formatter";
import { Fix, IRule, RuleFailure } from "./language/rule/rule";
import { TypedRule } from "./language/rule/typedRule";
import * as utils from "./language/utils";
import { loadRules } from "./ruleLoader";
import { arrayify, dedent } from "./utils";

/**
 * Linter that can lint multiple files in consecutive runs.
 */
class Linter {
    public static VERSION = "4.0.0-dev";

    public static findConfiguration = findConfiguration;
    public static findConfigurationPath = findConfigurationPath;
    public static getRulesDirectories = getRulesDirectories;
    public static loadConfigurationFromPath = loadConfigurationFromPath;

    private failures: RuleFailure[] = [];
    private warnings: RuleFailure[] = [];
    private fixes: RuleFailure[] = [];

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

        const { config } = ts.readConfigFile(configFile, ts.sys.readFile);
        const parseConfigHost = {
            fileExists: fs.existsSync,
            readDirectory: ts.sys.readDirectory,
            useCaseSensitiveFileNames: true,
        };
        const parsed = ts.parseJsonConfigFileContent(config, parseConfigHost, projectDirectory);
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

    constructor(private options: ILinterOptions, private program?: ts.Program) {
        if (typeof options !== "object") {
            throw new Error("Unknown Linter options type: " + typeof options);
        }
        if ((<any> options).configuration != null) {
            throw new Error("ILinterOptions does not contain the property `configuration` as of version 4. " +
                "Did you mean to pass the `IConfigurationFile` object to lint() ? ");
        }
    }

    public lint(fileName: string, source?: string, configuration: IConfigurationFile = DEFAULT_CONFIG): void {
        const enabledRules = this.getEnabledRules(fileName, source, configuration);
        let sourceFile = this.getSourceFile(fileName, source);
        let hasLinterRun = false;

        if (this.options.fix) {
            this.fixes = [];
            for (let rule of enabledRules) {
                let fileFailures = this.applyRule(rule, sourceFile);
                const fixes = fileFailures.map(f => f.getFix()).filter(f => !!f);
                source = fs.readFileSync(fileName, { encoding: "utf-8" });
                if (fixes.length > 0) {
                    this.fixes = this.fixes.concat(fileFailures);
                    source = Fix.applyAll(source, fixes);
                    fs.writeFileSync(fileName, source, { encoding: "utf-8" });

                    // reload AST if file is modified
                    sourceFile = this.getSourceFile(fileName, source);
                }
                if (rule.isWarning()) {
                    this.warnings = this.warnings.concat(fileFailures);
                } else {
                    this.failures = this.failures.concat(fileFailures);
                }
            }
            hasLinterRun = true;
        }

        // make a 1st pass or make a 2nd pass if there were any fixes because the positions may be off
        if (!hasLinterRun || this.fixes.length > 0) {
            this.failures = [];
            this.warnings = [];
            for (let rule of enabledRules) {
                const fileFailures = this.applyRule(rule, sourceFile);
                if (rule.isWarning()) {
                    this.warnings = this.warnings.concat(fileFailures);
                } else {
                    this.failures = this.failures.concat(fileFailures);
                }
            }
        }
    }

    public getResult(): LintResult {
        let formatter: IFormatter;
        const formattersDirectory = getRelativePath(this.options.formattersDirectory);

        const formatterName = this.options.formatter || "prose";
        const Formatter = findFormatter(formatterName, formattersDirectory);
        if (Formatter) {
            formatter = new Formatter();
        } else {
            throw new Error(`formatter '${formatterName}' not found`);
        }

        const output = formatter.format(this.failures, this.warnings, this.fixes);

        return {
            warningCount: this.warnings.length,
            warnings: this.warnings,
            failureCount: this.failures.length,
            failures: this.failures,
            fixes: this.fixes,
            format: formatterName,
            output,
        };
    }

    private applyRule(rule: IRule, sourceFile: ts.SourceFile) {
        let ruleFailures: RuleFailure[] = [];
        if (this.program && rule instanceof TypedRule) {
            ruleFailures = rule.applyWithProgram(sourceFile, this.program);
        } else {
            ruleFailures = rule.apply(sourceFile);
        }
        let fileFailures: RuleFailure[] = [];
        for (let ruleFailure of ruleFailures) {
            if (!this.containsRule(this.failures, ruleFailure)) {
                fileFailures.push(ruleFailure);
            }
        }
        return fileFailures;
    }

    private getEnabledRules(fileName: string, source?: string, configuration: IConfigurationFile = DEFAULT_CONFIG): IRule[] {
        const sourceFile = this.getSourceFile(fileName, source);

        // walk the code first to find all the intervals where rules are disabled
        const rulesWalker = new EnableDisableRulesWalker(sourceFile, {
            disabledIntervals: [],
            ruleName: "",
        });
        rulesWalker.walk(sourceFile);
        const enableDisableRuleMap = rulesWalker.enableDisableRuleMap;

        const rulesDirectories = arrayify(this.options.rulesDirectory)
            .concat(arrayify(configuration.rulesDirectory));
        const isJs = /\.jsx?$/i.test(fileName);
        const configurationRules = isJs ? configuration.jsRules : configuration.rules;
        let configuredRules = loadRules(configurationRules, enableDisableRuleMap, rulesDirectories, isJs);

        return configuredRules.filter((r) => r.isEnabled());
    }

    private getSourceFile(fileName: string, source?: string) {
        let sourceFile: ts.SourceFile;
        if (this.program) {
            sourceFile = this.program.getSourceFile(fileName);
            // check if the program has been type checked
            if (sourceFile && !("resolvedModules" in sourceFile)) {
                throw new Error("Program must be type checked before linting");
            }
        } else {
            sourceFile = utils.getSourceFile(fileName, source);
        }

        if (sourceFile === undefined) {
            const INVALID_SOURCE_ERROR = dedent`
                Invalid source file: ${fileName}. Ensure that the files supplied to lint have a .ts, .tsx, .js or .jsx extension.
            `;
            throw new Error(INVALID_SOURCE_ERROR);
        }
        return sourceFile;
    }

    private containsRule(rules: RuleFailure[], rule: RuleFailure) {
        return rules.some((r) => r.equals(rule));
    }
}

// tslint:disable-next-line:no-namespace
namespace Linter { }

export = Linter;
