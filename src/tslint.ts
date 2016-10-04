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
    getRulesDirectories,
    loadConfigurationFromPath,
} from "./configuration";
import { ILinterOptions, ILinterOptionsRaw, LintResult } from "./lint";
import * as MultiLinter from "./tslintMulti";
import { arrayify } from "./utils";

/**
 * Linter that can lint exactly one file.
 */
class Linter {
    public static VERSION = MultiLinter.VERSION;

    public static findConfiguration = findConfiguration;
    public static findConfigurationPath = findConfigurationPath;
    public static getRulesDirectories = getRulesDirectories;
    public static loadConfigurationFromPath = loadConfigurationFromPath;

    private options: ILinterOptions;

    /**
     * Creates a TypeScript program object from a tsconfig.json file path and optional project directory.
     */
    public static createProgram(configFile: string, projectDirectory?: string): ts.Program {
        return MultiLinter.createProgram(configFile, projectDirectory);
    }

    /**
     * Returns a list of source file names from a TypeScript program. This includes all referenced
     * files and excludes declaration (".d.ts") files.
     */
    public static getFileNames(program: ts.Program): string[] {
        return MultiLinter.getFileNames(program);
    }

    constructor(private fileName: string,
                private source: string,
                options: ILinterOptionsRaw,
                private program?: ts.Program) {
       this.options = this.computeFullOptions(options);
    }

    public lint(): LintResult {
        const multiLinter: MultiLinter = new MultiLinter(this.options, this.program);
        multiLinter.lint(this.fileName, this.source, this.options.configuration);
        return multiLinter.getResult();
    }

    private computeFullOptions(options: ILinterOptionsRaw = {}): ILinterOptions {
        if (typeof options !== "object") {
            throw new Error("Unknown Linter options type: " + typeof options);
        }

        let { configuration, formatter, formattersDirectory, rulesDirectory } = options;

        return {
            configuration: configuration || DEFAULT_CONFIG,
            formatter: formatter || "prose",
            formattersDirectory,
            rulesDirectory: arrayify(rulesDirectory).concat(arrayify(configuration.rulesDirectory)),
        };
      }
}

// tslint:disable-next-line:no-namespace
namespace Linter {}

export = Linter;
