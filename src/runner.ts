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

// tslint:disable strict-boolean-expressions (TODO: Fix up options)

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

import {
    DEFAULT_CONFIG,
    findConfiguration,
    findConfigurationPath,
    isFileExcluded,
    JSON_CONFIG_FILENAME,
    stringifyConfiguration,
} from "./configuration";
import { FatalError } from "./error";
import { tryReadFile } from "./files/reading";
import { resolveFilesAndProgram } from "./files/resolution";
import { LintResult } from "./index";
import { Linter } from "./linter";
import { trimSingleQuotes } from "./utils";

export interface Options {
    /**
     * Path to a configuration file.
     */
    config?: string;

    /**
     * Exclude globs from path expansion.
     */
    exclude: string[];

    /**
     * File paths to lint.
     */
    files: string[];

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
     * Outputs the configuration to be used instead of linting.
     */
    printConfig?: boolean;

    /**
     * tsconfig.json file.
     */
    project?: string;

    /**
     * Whether to hide warnings
     */
    quiet?: boolean;

    /**
     * Rules directory paths.
     */
    rulesDirectory?: string | string[];

    /**
     * Run the tests in the given directories to ensure a (custom) TSLint rule's output matches the expected output.
     * When this property is `true` the `files` property is used to specify the directories from which the tests should be executed.
     */
    test?: boolean;

    /**
     * Whether to enable type checking when linting a project.
     */
    typeCheck?: boolean;
}

export const enum Status {
    Ok = 0,
    FatalError = 1,
    LintError = 2,
}

export interface Logger {
    log(message: string): void;
    error(message: string): void;
}

export async function run(options: Options, logger: Logger): Promise<Status> {
    try {
        return await runWorker(options, logger);
    } catch (error) {
        if (error instanceof FatalError) {
            logger.error(`${error.message}\n`);
            return Status.FatalError;
        }
        throw error;
    }
}

async function runWorker(options: Options, logger: Logger): Promise<Status> {
    if (options.init) {
        if (fs.existsSync(JSON_CONFIG_FILENAME)) {
            throw new FatalError(`Cannot generate ${JSON_CONFIG_FILENAME}: file already exists`);
        }

        fs.writeFileSync(JSON_CONFIG_FILENAME, JSON.stringify(DEFAULT_CONFIG, undefined, "    "));
        return Status.Ok;
    }

    if (options.printConfig) {
        return printConfiguration(options, logger);
    }

    if (options.test) {
        const test = await import("./test");
        const results = test.runTests(
            (options.files || []).map(trimSingleQuotes),
            options.rulesDirectory,
        );
        return test.consoleTestResultsHandler(results, logger) ? Status.Ok : Status.FatalError;
    }

    if (options.config && !fs.existsSync(options.config)) {
        throw new FatalError(`Invalid option for configuration: ${options.config}`);
    }

    const { output, errorCount } = await runLinter(options, logger);
    if (output && output.trim()) {
        logger.log(`${output}\n`);
    }
    return options.force || errorCount === 0 ? Status.Ok : Status.LintError;
}

async function printConfiguration(options: Options, logger: Logger): Promise<Status> {
    const { files } = options;
    if (files.length !== 1) {
        throw new FatalError(`--print-config must be run with exactly one file`);
    }

    const configurationPath =
        options.config === undefined ? findConfigurationPath(null, files[0]) : options.config;
    if (configurationPath === undefined) {
        throw new FatalError(
            `Could not find configuration path. Try passing a --config to your tslint.json.`,
        );
    }

    const configuration = findConfiguration(configurationPath, files[0]).results;
    if (configuration === undefined) {
        throw new FatalError(`Could not find configuration for '${files[1]}`);
    }

    logger.log(`${stringifyConfiguration(configuration)}\n`);
    return Status.Ok;
}

async function runLinter(options: Options, logger: Logger): Promise<LintResult> {
    const { files, program } = resolveFilesAndProgram(options, logger);
    // if type checking, run the type checker
    if (program && options.typeCheck) {
        const diagnostics = ts.getPreEmitDiagnostics(program);
        if (diagnostics.length !== 0) {
            const message = diagnostics
                .map(d => showDiagnostic(d, program, options.outputAbsolutePaths))
                .join("\n");
            if (options.force) {
                logger.error(`${message}\n`);
            } else {
                throw new FatalError(message);
            }
        }
    }
    return doLinting(options, files, program, logger);
}

async function doLinting(
    options: Options,
    files: string[],
    program: ts.Program | undefined,
    logger: Logger,
): Promise<LintResult> {
    let configFile =
        options.config !== undefined ? findConfiguration(options.config).results : undefined;

    let formatter = options.format;
    if (formatter === undefined) {
        formatter =
            configFile && configFile.linterOptions && configFile.linterOptions.format
                ? configFile.linterOptions.format
                : "stylish";
    }

    const linter = new Linter(
        {
            fix: !!options.fix,
            formatter,
            formattersDirectory: options.formattersDirectory,
            quiet: !!options.quiet,
            rulesDirectory: options.rulesDirectory,
        },
        program,
    );

    let lastFolder: string | undefined;

    for (const file of files) {
        if (options.config === undefined) {
            const folder = path.dirname(file);
            if (lastFolder !== folder) {
                configFile = findConfiguration(null, folder).results;
                lastFolder = folder;
            }
        }
        if (isFileExcluded(file, configFile)) {
            continue;
        }

        let contents: string | undefined;
        if (program !== undefined) {
            const sourceFile = program.getSourceFile(file);
            if (sourceFile !== undefined) {
                contents = sourceFile.text;
            }
        } else {
            contents = await tryReadFile(file, logger);
        }

        if (contents !== undefined) {
            linter.lint(file, contents, configFile);
        }
    }

    return linter.getResult();
}

function showDiagnostic(
    { file, start, category, messageText }: ts.Diagnostic,
    program: ts.Program,
    outputAbsolutePaths?: boolean,
): string {
    let message = ts.DiagnosticCategory[category];
    if (file !== undefined && start !== undefined) {
        const { line, character } = file.getLineAndCharacterOfPosition(start);
        const currentDirectory = program.getCurrentDirectory();
        const filePath = outputAbsolutePaths
            ? path.resolve(currentDirectory, file.fileName)
            : path.relative(currentDirectory, file.fileName);
        message += ` at ${filePath}:${line + 1}:${character + 1}:`;
    }
    return `${message} ${ts.flattenDiagnosticMessageText(messageText, "\n")}`;
}
