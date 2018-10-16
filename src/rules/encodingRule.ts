/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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
import * as ts from "typescript";

import * as Lint from "../index";
import { detectBufferEncoding, Encoding } from "../utils";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "encoding",
        description: "Enforces UTF-8 file encoding.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(actual: Encoding): string {
        return `This file is encoded as ${showEncoding(actual)} instead of UTF-8.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    const encoding = detectEncoding(ctx.sourceFile.fileName);
    if (encoding !== "utf8") {
        ctx.addFailure(0, 1, Rule.FAILURE_STRING(encoding));
    }
}

function showEncoding(encoding: Encoding): string {
    switch (encoding) {
        case "utf8":
            return "UTF-8";
        case "utf8-bom":
            return "UTF-8 with byte-order marker (BOM)";
        case "utf16le":
            return "UTF-16 (little-endian)";
        case "utf16be":
            return "UTF-16 (big-endian)";
    }
}

function detectEncoding(fileName: string): Encoding {
    const fd = fs.openSync(fileName, "r");
    const maxBytesRead = 3; // Only need 3 bytes to detect the encoding.
    const buffer = Buffer.allocUnsafe(maxBytesRead);
    const bytesRead = fs.readSync(
        fd,
        buffer,
        /*offset*/ 0,
        /*length*/ maxBytesRead,
        /*position*/ 0
    );
    fs.closeSync(fd);
    return detectBufferEncoding(buffer, bytesRead);
}
