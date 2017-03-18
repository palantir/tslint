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

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "encoding",
        description: "Enforces UTF-8 file encoding.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: false,
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

export type Encoding = "utf8" | "utf8-bom" | "utf16le" | "utf16be";
function detectEncoding(fileName: string): Encoding {
    const fd = fs.openSync(fileName, "r");
    const maxBytesRead = 3; // Only need 3 bytes to detect the encoding.
    const buffer = new Buffer(maxBytesRead);
    const bytesRead = fs.readSync(fd, buffer, /*offset*/ 0, /*length*/ maxBytesRead, /*position*/ 0);
    return detectBufferEncoding(buffer, bytesRead);
}

export function readBufferWithDetectedEncoding(buffer: Buffer): string {
    switch (detectBufferEncoding(buffer)) {
        case "utf8":
            return buffer.toString();
        case "utf8-bom":
            return buffer.toString("utf-8", 2);
        case "utf16le":
            return buffer.toString("utf16le", 2);
        case "utf16be":
            // Round down to nearest multiple of 2.
            const len = buffer.length & ~1; // tslint:disable-line no-bitwise
            // Flip all byte pairs, then read as little-endian.
            for (let i = 0; i < len; i += 2) {
                const temp = buffer[i];
                buffer[i] = buffer[i + 1];
                buffer[i + 1] = temp;
            }
            return buffer.toString("utf16le", 2);
    }
}

function detectBufferEncoding(buffer: Buffer, length = buffer.length): Encoding {
    if (length < 2) {
        return "utf8";
    }

    switch (buffer[0]) {
        case 0xef:
            if (buffer[1] === 0xbb && length >= 3 && buffer[2] === 0xbf) {
                return "utf8-bom";
            }
            break;

        case 0xfe:
            if (buffer[1] === 0xff) {
                return "utf16be";
            }
            break;

        case 0xff:
            if (buffer[1] === 0xfe) {
                return "utf16le";
            }
    }

    return "utf8";
}
