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
import * as path from "path";
import * as ts from "typescript";

import { findConfiguration, IConfigurationFile, isFileExcluded } from "./configuration";
import { FatalError } from "./error";
import { ILinterOptions, LintResult } from "./index";
import { Linter } from "./linter";
import { Logger } from "./logger";
import { NonTypedLinter, TypedLinter } from "./specialLinters";

export async function doAllLinting(
    files: string[],
    optionsConfig: IConfigurationFile | undefined,
    linterOptions: ILinterOptions,
    program: ts.Program | undefined,
    logger: Logger,
): Promise<LintResult> {
    const linter = new Linter(linterOptions, program);
    return doLintingImpl(files, optionsConfig, linter, async (file: string) => {
        let contents: string | undefined;
        if (program !== undefined) {
            const sourceFile = program.getSourceFile(file);
            if (sourceFile !== undefined) {
                contents = sourceFile.text;
            }
        } else {
            contents = await tryReadFile(file, logger);
        }

        return contents;
    });
}

export async function doTypedLinting(
    files: string[],
    optionsConfig: IConfigurationFile | undefined,
    linterOptions: ILinterOptions,
    program: ts.Program,
): Promise<LintResult> {
    const linter = new TypedLinter(linterOptions, program);
    return doLintingImpl(files, optionsConfig, linter, async (file: string) => {
        const sourceFile = program.getSourceFile(file);
        return sourceFile !== undefined ? sourceFile.text : undefined;
    });
}

export async function doNonTypedLinting(
    files: string[],
    optionsConfig: IConfigurationFile | undefined,
    linterOptions: ILinterOptions,
    logger: Logger,
): Promise<LintResult> {
    const linter = new NonTypedLinter(linterOptions);
    return doLintingImpl(files, optionsConfig, linter, async (file: string) =>
        tryReadFile(file, logger),
    );
}

async function doLintingImpl(
    files: string[],
    optionsConfig: IConfigurationFile | undefined,
    linter: Linter,
    getFileContent: (path: string) => Promise<string | undefined>,
): Promise<LintResult> {
    let configFile = optionsConfig;

    let lastFolder: string | undefined;

    for (const file of files) {
        if (optionsConfig === undefined) {
            const folder = path.dirname(file);
            if (lastFolder !== folder) {
                configFile = findConfiguration(null, folder).results;
                lastFolder = folder;
            }
        }
        if (isFileExcluded(file, configFile)) {
            continue;
        }

        const contents = await getFileContent(file);
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
