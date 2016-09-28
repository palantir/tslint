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

import { existsSync } from "fs";
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
import { createLanguageService, wrapProgram } from "./language/languageServiceHost";
import { IFormatter } from "./language/formatter/formatter";
import { RuleFailure } from "./language/rule/rule";
import { TypedRule } from "./language/rule/typedRule";
import { getSourceFile } from "./language/utils";
import { IMultiLinterOptions, LintResult } from "./lint";
import { loadRules } from "./ruleLoader";
import { arrayify } from "./utils";

/**
 * Linter that can lint multiple files in consecutive runs.
 */
class MultiLinter {
    public static VERSION = "4.0.0-dev";

    public static findConfiguration = findConfiguration;
    public static findConfigurationPath = findConfigurationPath;
    public static getRulesDirectories = getRulesDirectories;
    public static loadConfigurationFromPath = loadConfigurationFromPath;

    private failures: RuleFailure[] = [];
    private languageService: ts.LanguageService;

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
            fileExists: existsSync,
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

    constructor(private options: IMultiLinterOptions, private program?: ts.Program) {
        if (program) {
            this.languageService = wrapProgram(program);
        }
    }

    public lint(fileName: string, source?: string, configuration: any = DEFAULT_CONFIG): void {
        let sourceFile: ts.SourceFile;
        if (this.program) {
            sourceFile = this.program.getSourceFile(fileName);
            // check if the program has been type checked
            if (sourceFile && !("resolvedModules" in sourceFile)) {
                throw new Error("Program must be type checked before linting");
            }
        } else {
            sourceFile = getSourceFile(fileName, source);
            this.languageService = createLanguageService(fileName, source);
        }

        if (sourceFile === undefined) {
            throw new Error(`Invalid source file: ${fileName}. Ensure that the files supplied to lint have a .ts or .tsx extension.`);
        }

        // walk the code first to find all the intervals where rules are disabled
        const rulesWalker = new EnableDisableRulesWalker(sourceFile, {
            disabledIntervals: [],
            ruleName: "",
        });
        rulesWalker.walk(sourceFile);
        const enableDisableRuleMap = rulesWalker.enableDisableRuleMap;

        const rulesDirectories = arrayify(this.options.rulesDirectory)
            .concat(arrayify(configuration.rulesDirectory));
        const configurationRules = configuration.rules;
        const configuredRules = loadRules(configurationRules, enableDisableRuleMap, rulesDirectories);
        const enabledRules = configuredRules.filter((r) => r.isEnabled());
        for (let rule of enabledRules) {
            let ruleFailures: RuleFailure[] = [];
            if (this.program && rule instanceof TypedRule) {
                ruleFailures = rule.applyWithProgram(sourceFile, this.languageService);
            } else {
                ruleFailures = rule.apply(sourceFile, this.languageService);
            }
            for (let ruleFailure of ruleFailures) {
                if (!this.containsRule(this.failures, ruleFailure)) {
                    this.failures.push(ruleFailure);
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

      const output = formatter.format(this.failures);

      return {
          failureCount: this.failures.length,
          failures: this.failures,
          format: formatterName,
          output,
      };
    }

    private containsRule(rules: RuleFailure[], rule: RuleFailure) {
        return rules.some((r) => r.equals(rule));
    }
}

// tslint:disable-next-line:no-namespace
namespace MultiLinter {}

export = MultiLinter;
