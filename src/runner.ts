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
import { LintResult } from "./index";
import * as Linter from "./linter";
import { consoleTestResultsHandler, runTests } from "./test";
import { arrayify, flatMap } from "./utils";

export interface Options {
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

export const enum Status {
    Ok = 0,
    FatalError = 1,
    LintError = 2,
}

export async function run(options: Options, outputStream: NodeJS.WritableStream): Promise<Status> {
    try {
        return await runWorker(options, outputStream);
    } catch (error) {
        if ((error as FatalError).name === FatalError.NAME) {
            console.error((error as FatalError).message);
            return Status.FatalError;
        }
        throw error;
    }
}

async function runWorker(options: Options, outputStream: NodeJS.WritableStream): Promise<Status> {
    if (options.version) {
        await writeToStream(outputStream, Linter.VERSION + "\n");
        return Status.Ok;
    }

    if (options.init) {
        if (fs.existsSync(CONFIG_FILENAME)) {
            throw new FatalError(`Cannot generate ${CONFIG_FILENAME}: file already exists`);
        }

        fs.writeFileSync(CONFIG_FILENAME, JSON.stringify(DEFAULT_CONFIG, undefined, "    "));
        return Status.Ok;
    }

    if (options.test) {
        const results = runTests((options.files || []).map(trimSingleQuotes), options.rulesDirectory);
        return consoleTestResultsHandler(results) ? Status.Ok : Status.FatalError;
    }

    if (options.config && !fs.existsSync(options.config)) {
        throw new FatalError(`Invalid option for configuration: ${options.config}`);
    }

    const { output, errorCount } = runLinter(options);
    await writeToStream(outputStream, output);
    return options.force || errorCount === 0 ? Status.Ok : Status.LintError;
}

function runLinter(options: Options): LintResult {
    const { files, program } = resolveFilesAndProgram(options);
    // if type checking, run the type checker
    if (program) {
        const diagnostics = ts.getPreEmitDiagnostics(program);
        if (diagnostics.length !== 0) {
            const message = diagnostics.map(showDiagnostic).join("\n");
            if (options.force) {
                console.error(message);
            } else {
                throw new FatalError(message);
            }
        }
    }
    return doLinting(options, files, program);
}

function resolveFilesAndProgram({ files, project, exclude, typeCheck }: Options): { files: string[], program?: ts.Program } {
    // if both files and tsconfig are present, use files
    if (project === undefined || files && files.length > 0) {
        if (typeCheck) {
            throw new FatalError("--project must be specified in order to enable type checking.");
        }
        return { files: resolveGlobs(files, exclude) };
    }

    if (!fs.existsSync(project)) {
        throw new FatalError(`Invalid option for project: ${project}`);
    }

    const program = Linter.createProgram(project);
    // if not type checking, we don't need to pass in a program object
    return { files: Linter.getFileNames(program), program: typeCheck ? program : undefined };
}

function resolveGlobs(files: string[] | undefined, exclude: Options["exclude"]): string[] {
    const ignore = arrayify(exclude).map(trimSingleQuotes);
    return flatMap(arrayify(files), (file) =>
        // remove single quotes which break matching on Windows when glob is passed in single quotes
        glob.sync(trimSingleQuotes(file), { ignore, nodir: true }));
}

function doLinting(options: Options, files: string[], program: ts.Program | undefined): LintResult {
    const possibleConfigAbsolutePath = options.config !== undefined ? path.resolve(options.config) : null;
    const linter = new Linter({
        fix: !!options.fix,
        formatter: options.format,
        formattersDirectory: options.formattersDirectory,
        rulesDirectory: options.rulesDirectory,
    }, program);

    let lastFolder: string | undefined;
    let configFile: IConfigurationFile | undefined;
    for (const file of files) {
        if (!fs.existsSync(file)) {
            throw new FatalError(`Unable to open file: ${file}`);
        }

        const contents = tryReadFile(file);
        if (contents !== undefined) {
            const folder = path.dirname(file);
            if (lastFolder !== folder) {
                configFile = findConfiguration(possibleConfigAbsolutePath, folder).results;
                lastFolder = folder;
            }
            linter.lint(file, contents, configFile);
        }
    }

    return linter.getResult();
}

/** Read a file, but return undefined if it is an MPEG '.ts' file. */
function tryReadFile(filename: string): string | undefined {
    const buffer = new Buffer(256);
    const fd = fs.openSync(filename, "r");
    try {
        fs.readSync(fd, buffer, 0, 256, 0);
        if (buffer.readInt8(0, true) === 0x47 && buffer.readInt8(188, true) === 0x47) {
            // MPEG transport streams use the '.ts' file extension. They use 0x47 as the frame
            // separator, repeating every 188 bytes. It is unlikely to find that pattern in
            // TypeScript source, so tslint ignores files with the specific pattern.
            console.warn(`${filename}: ignoring MPEG transport stream`);
            return undefined;
        }
    } finally {
        fs.closeSync(fd);
    }

    return fs.readFileSync(filename, "utf8");
}

function showDiagnostic({ file, start, category, messageText }: ts.Diagnostic): string {
    let message = ts.DiagnosticCategory[category];
    if (file) {
        const {line, character} = file.getLineAndCharacterOfPosition(start);
        message += ` at ${file.fileName}:${line + 1}:${character + 1}:`;
    }
    return message + " " + ts.flattenDiagnosticMessageText(messageText, "\n");
}

function trimSingleQuotes(str: string): string {
    return str.replace(/^'|'$/g, "");
}

function writeToStream(outputStream: NodeJS.WritableStream, output: string): Promise<void> {
    return new Promise<void>((resolve) => {
        outputStream.write(output, () => { resolve(); });
    });
}
