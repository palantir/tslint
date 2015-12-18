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
export type ErrorLine = MultilineErrorLine | EndErrorLine;
export type Line = CodeLine | ErrorLine;

const multilineErrorRegex = /^\s*~+$/;
const endErrorRegex = /^\s*~+\s*\[([\w ]+)\]\s*$/;

export function classifyLine(line: string): Line {
    let matches: RegExpMatchArray;
    /* tslint:disable:no-conditional-assignment */
    if (line.match(multilineErrorRegex)) {
        // 1-based indexing for line and column numbers
        const startErrorCol = line.indexOf("~");
        return new MultilineErrorLine(startErrorCol);
    } else if (matches = line.match(endErrorRegex)) {
        const startErrorCol = line.indexOf("~");
        // exclusive endpoint
        const endErrorCol = line.lastIndexOf("~") + 1;
        const [, message] = matches;
        return new EndErrorLine(startErrorCol, endErrorCol, message);
    } else {
        return new CodeLine(line);
    }
    /* tslint:enable:no-conditional-assignment */
}

export function createErrorString(code: string, errorLine: ErrorLine) {
    const startSpaces = strMult(" ", errorLine.startCol);
    if (errorLine instanceof MultilineErrorLine) {
        const tildes = strMult("~", code.length - startSpaces.length);
        return `${startSpaces}${tildes}`;
    } else if (errorLine instanceof EndErrorLine) {
        const tildes = strMult("~", errorLine.endCol - errorLine.startCol);
        const endSpaces = strMult(" ", code.length - errorLine.endCol);
        return `${startSpaces}${tildes}${endSpaces} [${errorLine.message}]`;
    }
}
