/*
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
import * as os from "os";
import * as path from "path";
import * as ts from "typescript";

import * as Lint from "./lint";

export function getSourceFile(fileName: string): ts.SourceFile {
    const relativePath = path.join("test", "files", fileName);
    const source = fs.readFileSync(relativePath, "utf8");

    return Lint.getSourceFile(fileName, source);
}

export function getFormatter(formatterName: string): Lint.FormatterConstructor {
    const formattersDirectory = path.join(__dirname, "../src/formatters");
    return Lint.findFormatter(formatterName, formattersDirectory)!;
}

export function createTempFile(extension: string) {
    for (let i = 0; i < 5; i++) {
        const attempt = path.join(
            os.tmpdir(),
            `tslint.test${Math.round(Date.now() * Math.random())}.${extension}`
        );
        if (!fs.existsSync(attempt)) {
            return attempt;
        }
    }
    throw new Error("Couldn't create temp file");
}
