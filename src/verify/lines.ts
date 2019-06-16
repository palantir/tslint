/*
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

// Use classes here instead of interfaces because we want runtime type data
export class Line {}
export class CodeLine extends Line {
    constructor(public contents: string) {
        super();
    }
}
export class MessageSubstitutionLine extends Line {
    constructor(public key: string, public message: string) {
        super();
    }
}

export class ErrorLine extends Line {
    constructor(public startCol: number) {
        super();
    }
}
export class MultilineErrorLine extends ErrorLine {
    constructor(startCol: number) {
        super(startCol);
    }
}
export class EndErrorLine extends ErrorLine {
    constructor(startCol: number, public endCol: number, public message: string) {
        super(startCol);
    }
}

// example matches (between the quotes):
// "    ~~~~~~~~"
const multilineErrorRegex = /^\s*(~+|~nil)$/;
// "    ~~~~~~~~~   [some error message]"
const endErrorRegex = /^\s*(~+|~nil)\s*\[(.+)\]\s*$/;
// "[shortcut]: full messages goes here!!  "
const messageSubstitutionRegex = /^\[([-\w]+?)]: \s*(.+?)\s*$/;

export const ZERO_LENGTH_ERROR = "~nil";

/**
 * Maps a line of text from a .lint file to an appropriate Line object
 */
export function parseLine(text: string): Line {
    const multilineErrorMatch = text.match(multilineErrorRegex);
    if (multilineErrorMatch !== null) {
        const startErrorCol = text.indexOf("~");
        return new MultilineErrorLine(startErrorCol);
    }

    const endErrorMatch = text.match(endErrorRegex);
    if (endErrorMatch !== null) {
        const [, squiggles, message] = endErrorMatch;
        const startErrorCol = text.indexOf("~");
        const zeroLengthError = squiggles === ZERO_LENGTH_ERROR;
        const endErrorCol = zeroLengthError ? startErrorCol : text.lastIndexOf("~") + 1;
        return new EndErrorLine(startErrorCol, endErrorCol, message);
    }

    const messageSubstitutionMatch = text.match(messageSubstitutionRegex);
    if (messageSubstitutionMatch !== null) {
        const [, key, message] = messageSubstitutionMatch;
        return new MessageSubstitutionLine(key, message);
    }

    // line doesn't match any syntax for error markup, so it's a line of code to be linted
    return new CodeLine(text);
}

/**
 * Maps a Line object to a matching line of text that could be in a .lint file.
 * This is almost the inverse of parseLine.
 * If you ran `printLine(parseLine(someText), code)`, the whitespace in the result may be different than in someText
 * @param fileName - File name containing the line and code.
 * @param line - A Line object to convert to text
 * @param code - If line represents error markup, this is the line of code preceding the markup.
 *               Otherwise, this parameter is not required.
 */
export function printLine(fileName: string, line: Line, code?: string): string | undefined {
    if (line instanceof ErrorLine) {
        if (code === undefined) {
            throw new Error(
                `${fileName}: Must supply argument for code parameter when line is an ErrorLine`,
            );
        }

        const leadingSpaces = " ".repeat(line.startCol);
        if (line instanceof MultilineErrorLine) {
            // special case for when the line of code is simply a newline.
            // use "~nil" to indicate the error continues on that line
            if (code.length === 0 && line.startCol === 0) {
                return ZERO_LENGTH_ERROR;
            }

            const tildes = "~".repeat(code.length - leadingSpaces.length);
            return `${leadingSpaces}${tildes}`;
        } else if (line instanceof EndErrorLine) {
            let tildes = "~".repeat(line.endCol - line.startCol);
            if (code.length < line.endCol) {
                // Better than crashing in String.repeat
                throw new Error(`Bad error marker in ${fileName} at ${JSON.stringify(line)}`);
            }
            let endSpaces = " ".repeat(code.length - line.endCol);
            if (tildes.length === 0) {
                tildes = ZERO_LENGTH_ERROR;
                // because we add "~nil" we need four less spaces than normal at the end
                // always make sure we have at least one space though
                endSpaces = endSpaces.substring(0, Math.max(endSpaces.length - 4, 1));
            }
            return `${leadingSpaces}${tildes}${endSpaces} [${line.message}]`;
        }
    } else if (line instanceof MessageSubstitutionLine) {
        return `[${line.key}]: ${line.message}`;
    } else if (line instanceof CodeLine) {
        return line.contents;
    }
    return undefined;
}
