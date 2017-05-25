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

// tslint:disable strict-boolean-expressions prefer-template
// (wait on https://github.com/palantir/tslint/pull/2572)

import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import * as ts from "typescript";

import {
    CONFIG_FILENAME,
    DEFAULT_CONFIG,
    findConfiguration,
    IConfigurationFile,
} from "./configuration";
import { FatalError } from "./error";
import * as Linter from "./linter";
import { consoleTestResultsHandler, runTests } from "./test";

export interface IRunnerOptions {
    /**
     * Path to a configuration file.
     */
    config?: string;

    /**
     * Exclude globs from path expansion.
     */
    exclude?: string | string[];

    /**
     * File paths to lint.
     */
    files?: string[];

    /**
     * Whether to return status code 0 even if there are lint errors.
     */
    force?: boolean;

    /**
     * Whether to fixes linting errors for select rules. This may overwrite linted files.
     */
    fix?: boolean;

    /**
     * Output format.
     */
    format?: string;

    /**
     * Formatters directory path.
     */
    formattersDirectory?: string;

    /**
     * Whether to generate a tslint.json config file in the current working directory.
     */
    init?: boolean;

    /**
     * Output file path.
     */
    out?: string;

    /**
     * Whether to output absolute paths
     */
    outputAbsolutePaths?: boolean;

    /**
     * tsconfig.json file.
     */
    project?: string;

    /**
     * Rules directory paths.
     */
    rulesDirectory?: string | string[];

    /**
     * That TSLint produces the correct output for the specified directory.
     */
    test?: string;

    /**
     * Whether to enable type checking when linting a project.
     */
    typeCheck?: boolean;

    /**
     * Whether to show the current TSLint version.
     */
    version?: boolean;
}

export class Runner {
    private static trimSingleQuotes(str: string) {
        return str.replace(/^'|'$/g, "");
    }

    constructor(private options: IRunnerOptions, private outputStream: NodeJS.WritableStream) { }

    public run(onComplete: (status: number) => void) {
        if (this.options.version) {
            this.outputStream.write(Linter.VERSION + "\n");
            return onComplete(0);
        }

        if (this.options.init) {
            if (fs.existsSync(CONFIG_FILENAME)) {
                console.error(`Cannot generate ${CONFIG_FILENAME}: file already exists`);
                return onComplete(1);
            }

            const tslintJSON = JSON.stringify(DEFAULT_CONFIG, undefined, "    ");
            fs.writeFileSync(CONFIG_FILENAME, tslintJSON);
            return onComplete(0);
        }

        if (this.options.test) {
            const results = runTests((this.options.files || []).map(Runner.trimSingleQuotes), this.options.rulesDirectory);
            const didAllTestsPass = consoleTestResultsHandler(results);
            return onComplete(didAllTestsPass ? 0 : 1);
        }

        // when provided, it should point to an existing location
        if (this.options.config && !fs.existsSync(this.options.config)) {
            console.error("Invalid option for configuration: " + this.options.config);
            return onComplete(1);
        }

        // if both files and tsconfig are present, use files
        let files = this.options.files === undefined ? [] : this.options.files;
        let program: ts.Program | undefined;

        if (this.options.project != null) {
            const project = findTsconfig(this.options.project);
            if (project === undefined) {
                console.error("Invalid option for project: " + this.options.project);
                return onComplete(1);
            }
            program = Linter.createProgram(project);
            if (files.length === 0) {
                files = Linter.getFileNames(program);
            }
            if (this.options.typeCheck) {
                // if type checking, run the type checker
                const diagnostics = ts.getPreEmitDiagnostics(program);
                if (diagnostics.length > 0) {
                    const messages = diagnostics.map((diag) => {
                        // emit any error messages
                        let message = ts.DiagnosticCategory[diag.category];
                        if (diag.file) {
                            const { line, character } = diag.file.getLineAndCharacterOfPosition(diag.start!);
                            let file: string;
                            const currentDirectory = program!.getCurrentDirectory();
                            file = this.options.outputAbsolutePaths
                                ? path.resolve(currentDirectory, diag.file.fileName)
                                : path.relative(currentDirectory, diag.file.fileName);
                            message += ` at ${file}:${line + 1}:${character + 1}:`;
                        }
                        message += " " + ts.flattenDiagnosticMessageText(diag.messageText, "\n");
                        return message;
                    });
                    console.error(messages.join("\n"));
                    return onComplete(this.options.force ? 0 : 1);
                }
            } else {
                // if not type checking, we don't need to pass in a program object
                program = undefined;
            }
        }

        let ignorePatterns: string[] = [];
        if (this.options.exclude) {
            const excludeArguments: string[] = Array.isArray(this.options.exclude) ? this.options.exclude : [this.options.exclude];

            ignorePatterns = excludeArguments.map(Runner.trimSingleQuotes);
        }

        files = files
            // remove single quotes which break matching on Windows when glob is passed in single quotes
            .map(Runner.trimSingleQuotes)
            .map((file: string) => glob.sync(file, { ignore: ignorePatterns, nodir: true }))
            .reduce((a: string[], b: string[]) => a.concat(b), [])
            .map((file: string) => {
                if (this.options.outputAbsolutePaths) {
                    return path.resolve(file);
                }
                return path.relative(process.cwd(), file);
            });

        try {
            this.processFiles(onComplete, files, program);
        } catch (error) {
            if ((error as FatalError).name === FatalError.NAME) {
                console.error((error as FatalError).message);
                return onComplete(1);
            }
            // rethrow unhandled error
            throw error;
        }
    }

    private processFiles(onComplete: (status: number) => void, files: string[], program?: ts.Program) {
        const possibleConfigAbsolutePath = this.options.config != null ? path.resolve(this.options.config) : null;
        const linter = new Linter({
            fix: !!this.options.fix,
            formatter: this.options.format,
            formattersDirectory: this.options.formattersDirectory || "",
            rulesDirectory: this.options.rulesDirectory || "",
        }, program);

        let lastFolder: string | undefined;
        let configFile: IConfigurationFile | undefined;
        for (const file of files) {
            if (!fs.existsSync(file)) {
                console.error(`Unable to open file: ${file}`);
                return onComplete(1);
            }

            const buffer = new Buffer(256);
            const fd = fs.openSync(file, "r");
            try {
                fs.readSync(fd, buffer, 0, 256, 0);
                if (buffer.readInt8(0, true) === 0x47 && buffer.readInt8(188, true) === 0x47) {
                    // MPEG transport streams use the '.ts' file extension. They use 0x47 as the frame
                    // separator, repeating every 188 bytes. It is unlikely to find that pattern in
                    // TypeScript source, so tslint ignores files with the specific pattern.
                    console.warn(`${file}: ignoring MPEG transport stream`);
                    continue;
                }
            } finally {
                fs.closeSync(fd);
            }

            const contents = fs.readFileSync(file, "utf8");
            const folder = path.dirname(file);
            if (lastFolder !== folder) {
                configFile = findConfiguration(possibleConfigAbsolutePath, folder).results;
                lastFolder = folder;
            }
            linter.lint(file, contents, configFile);
        }

        const lintResult = linter.getResult();

        this.outputStream.write(lintResult.output, () => {
            if (this.options.force || lintResult.errorCount === 0) {
                onComplete(0);
            } else {
                onComplete(2);
            }
        });
    }
}

function findTsconfig(project: string): string | undefined {
    try {
        const stats = fs.statSync(project); // throws if file does not exist
        if (stats.isDirectory()) {
            project = path.join(project, "tsconfig.json");
            fs.accessSync(project); // throws if file does not exist
        }
    } catch (e) {
        return undefined;
    }
    return project;
}
