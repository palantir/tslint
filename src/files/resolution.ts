/**
 * @license
 * Copyright 2019 Palantir Technologies, Inc.
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
import { filter as createMinimatchFilter, Minimatch } from "minimatch";
import * as path from "path";
import * as ts from "typescript";

import { FatalError } from "../error";
import { Linter } from "../linter";
import { Logger, Options } from "../runner";
import { flatMap, trimSingleQuotes } from "../utils";

export function filterFiles(files: string[], patterns: string[], include: boolean): string[] {
    if (patterns.length === 0) {
        return include ? [] : files;
    }
    const matcher = patterns.map(pattern => new Minimatch(pattern, { dot: !include })); // `glob` always enables `dot` for ignore patterns
    return files.filter(file => include === matcher.some(pattern => pattern.match(file)));
}

export function findTsconfig(project: string): string | undefined {
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

export function resolveGlobs(
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

export function resolveFilesAndProgram(
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
