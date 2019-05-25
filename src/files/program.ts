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
import { filter as createMinimatchFilter } from "minimatch";
import * as path from "path";
import * as ts from "typescript";

import { Linter } from "../linter";
import { FatalError } from "../error";
import { Options, Logger } from "../runner";
import { trimSingleQuotes } from "../utils";
import { resolveGlobs, findTsconfig, filterFiles } from "./finding";

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
