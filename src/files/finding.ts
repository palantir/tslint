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

import { Logger } from "../runner";
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
