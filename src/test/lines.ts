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

import {strMult} from "./utils";

// Use classes here instead of interfaces because we want runtime type data
export class CodeLine {
    constructor(public contents: string) { }
}
export class MultilineErrorLine {
    constructor(public startCol: number) { }
}
export class EndErrorLine {
    constructor(public startCol: number, public endCol: number, public message: string) { }
}
export class MessageSubstitutionLine {
    constructor(public key: string, public message: string) { }
}
export type ErrorLine = MultilineErrorLine | EndErrorLine;
export type Line = CodeLine | ErrorLine | MessageSubstitutionLine;

const multilineErrorRegex = /^\s*(~+|~nil)$/;
const endErrorRegex = /^\s*(~+|~nil)\s*\[(.+)\]\s*$/;
const messageSubstitutionRegex = /^\[([\w\-\_]+?)]: \s*(.+?)\s*$/;

export function classifyLine(line: string): Line {
    let matches: RegExpMatchArray;
    /* tslint:disable:no-conditional-assignment */
    if (line.match(multilineErrorRegex)) {
        // 1-based indexing for line and column numbers
        const startErrorCol = line.indexOf("~");
        return new MultilineErrorLine(startErrorCol);
    } else if (matches = line.match(endErrorRegex)) {
        const [, squiggles, message] = matches;
        const startErrorCol = line.indexOf("~");
        const zeroLengthError = (squiggles === "~nil");
        const endErrorCol = zeroLengthError ? startErrorCol : line.lastIndexOf("~") + 1;
        return new EndErrorLine(startErrorCol, endErrorCol, message);
    } else if (matches = line.match(messageSubstitutionRegex)) {
        const [, key, message] = matches;
        return new MessageSubstitutionLine(key, message);
    } else {
        return new CodeLine(line);
    }
    /* tslint:enable:no-conditional-assignment */
}

export function createErrorString(code: string, errorLine: ErrorLine) {
    const startSpaces = strMult(" ", errorLine.startCol);
    if (errorLine instanceof MultilineErrorLine) {
        // special case for when the line of code is simply a newline.
        // use "~nil" to indicate the error continues on that line
        if (code.length === 0 && errorLine.startCol === 0) {
            return "~nil";
        }

        let tildes = strMult("~", code.length - startSpaces.length);
        return `${startSpaces}${tildes}`;
    } else if (errorLine instanceof EndErrorLine) {
        let tildes = strMult("~", errorLine.endCol - errorLine.startCol);
        let endSpaces = strMult(" ", code.length - errorLine.endCol);
        if (tildes.length === 0) {
            tildes = "~nil";
            // because we add "~nil" we need three less spaces than normal.
            // always make sure we have at least one space though
            endSpaces = endSpaces.substring(0, Math.max(endSpaces.length - 4, 1));
        }
        return `${startSpaces}${tildes}${endSpaces} [${errorLine.message}]`;
    }
}
