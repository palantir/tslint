/*
 * Copyright 2016 Palantir Technologies, Inc.
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

/*
 * This script compiles documentation embedded in the TSLint source code
 * as well as adjacent markdown files into a static documentation web site.
 *
 * This script expects there to be a `tslint-gh-pages` directory
 * next to the to the directory where this repo lives.
 * The `tslint-gh-pages` directory should have the gh-pages branch
 * of the TSLint repo checked out. One easy way to do this is with
 * `git worktree`:
 *
 * ```
 * git worktree add -b gh-pages ../tslint-gh-pages origin/gh-pages
 * ```
 *
 * See http://palantir.github.io/tslint/develop/docs/ for more info.
 */

import { Documentalist, ICompiler, IFile, IPlugin, MarkdownPlugin } from "documentalist";
import { writeFileSync } from "fs";
import stringify = require("json-stringify-pretty-compact");

import { IFormatterMetadata, IRuleMetadata } from "../lib";

main();

function main() {
    const lintRulePlugin = createMetadataPlugin((metadata: IRuleMetadata) => {
        if (metadata.optionExamples != null) {
            metadata = { ...metadata };
            metadata.optionExamples = metadata.optionExamples.map((example: any) => {
                return typeof example === "string" ? example : stringify(example);
            });
        }
        return metadata;
    });
    const lintFormatterPlugin = createMetadataPlugin<IFormatterMetadata>();
    const dm = new Documentalist({ markdown: { gfm: true }})
        .use("md", new MarkdownPlugin())
        .use("Rule.ts", lintRulePlugin)
        .use("Formatter.ts", lintFormatterPlugin);

    dm.documentGlobs("src/**/*")
        .then((docs) => JSON.stringify(docs, null, 2))
        .then((content) => writeFileSync("docs/generated/data.json", content));
}

function createMetadataPlugin<T>(sanitize = (m: T) => m): IPlugin<T[]> {
    return {
        compile: (files: IFile[], _compiler: ICompiler) => {
            return files.map(({ path }) => require(path))
                .filter((module) => module != null && module.metadata != null)
                .map(({ metadata }: { metadata: T }) => sanitize(metadata));
        },
    };
}
