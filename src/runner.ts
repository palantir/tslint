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
import * as glob from "glob";
import { filter as createMinimatchFilter, Minimatch } from "minimatch";
import * as path from "path";
import * as ts from "typescript";

import {
    DEFAULT_CONFIG,
    findConfiguration,
    isFileExcluded,
    JSON_CONFIG_FILENAME,
} from "./configuration";
import { FatalError } from "./error";
import { LintResult } from "./index";
import { Linter } from "./linter";
import { flatMap } from "./utils";

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

function resolveFilesAndProgram(
    { files, project, exclude, outputAbsolutePaths }: Options,
    logger: Logger,
): { files: string[]; program?: ts.Program } {
    // remove single quotes which break matching on Windows when glob is passed in single quotes
    exclude = exclude.map(trimSingleQuotes);

    if (project === undefined) {
        return { files: resolveGlobs(files, exclude, outputAbsolutePaths, logger) };
    }

    const projectPath = findTsconfig(project);
    if (projectPath === undefined) {
        throw new FatalError(`Invalid option for project: ${project}`);
    }

    exclude = exclude.map(pattern => path.resolve(pattern));
    const program = Linter.createProgram(projectPath);
    let filesFound: string[];
    if (files.length === 0) {
        filesFound = filterFiles(Linter.getFileNames(program), exclude, false);
    } else {
        files = files.map(f => path.resolve(f));
        filesFound = filterFiles(program.getSourceFiles().map(f => f.fileName), files, true);
        filesFound = filterFiles(filesFound, exclude, false);

        // find non-glob files that have no matching file in the project and are not excluded by any exclude pattern
        for (const file of filterFiles(files, exclude, false)) {
            if (!glob.hasMagic(file) && !filesFound.some(createMinimatchFilter(file))) {
                if (fs.existsSync(file)) {
                    throw new FatalError(`'${file}' is not included in project.`);
                }
                logger.error(`'${file}' does not exist. This will be an error in TSLint 6.\n`); // TODO make this an error in v6.0.0
            }
        }
    }
    return { files: filesFound, program };
}

function filterFiles(files: string[], patterns: string[], include: boolean): string[] {
    if (patterns.length === 0) {
        return include ? [] : files;
    }
    const matcher = patterns.map(pattern => new Minimatch(pattern, { dot: !include })); // `glob` always enables `dot` for ignore patterns
    return files.filter(file => include === matcher.some(pattern => pattern.match(file)));
}

function resolveGlobs(
    files: string[],
    ignore: string[],
    outputAbsolutePaths: boolean | undefined,
    logger: Logger,
): string[] {
    const results = flatMap(files, file =>
        glob.sync(trimSingleQuotes(file), { ignore, nodir: true }),
    );
    // warn if `files` contains non-existent files, that are not patters and not excluded by any of the exclude patterns
    for (const file of filterFiles(files, ignore, false)) {
        if (!glob.hasMagic(file) && !results.some(createMinimatchFilter(file))) {
            logger.error(`'${file}' does not exist. This will be an error in TSLint 6.\n`); // TODO make this an error in v6.0.0
        }
    }
    const cwd = process.cwd();
    return results.map(file =>
        outputAbsolutePaths ? path.resolve(cwd, file) : path.relative(cwd, file),
    );
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
                : "prose";
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

/** Read a file, but return undefined if it is an MPEG '.ts' file. */
async function tryReadFile(filename: string, logger: Logger): Promise<string | undefined> {
    if (!fs.existsSync(filename)) {
        throw new FatalError(`Unable to open file: ${filename}`);
    }
    const buffer = Buffer.allocUnsafe(256);
    const fd = fs.openSync(filename, "r");
    try {
        fs.readSync(fd, buffer, 0, 256, 0);
        if (buffer.readInt8(0) === 0x47 && buffer.readInt8(188) === 0x47) {
            // MPEG transport streams use the '.ts' file extension. They use 0x47 as the frame
            // separator, repeating every 188 bytes. It is unlikely to find that pattern in
            // TypeScript source, so tslint ignores files with the specific pattern.
            logger.error(`${filename}: ignoring MPEG transport stream\n`);
            return undefined;
        }
    } finally {
        fs.closeSync(fd);
    }

    return fs.readFileSync(filename, "utf8");
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

function trimSingleQuotes(str: string): string {
    return str.replace(/^'|'$/g, "");
}

function findTsconfig(project: string): string | undefined {
    try {
        const stats = fs.statSync(project); // throws if file does not exist
        if (!stats.isDirectory()) {
            return project;
        }
        const projectFile = path.join(project, "tsconfig.json");
        fs.accessSync(projectFile); // throws if file does not exist
        return projectFile;
    } catch (e) {
        return undefined;
    }
}
