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

import * as semver from "semver";
import * as ts from "typescript";
import { format } from "util";

import { flatMap, mapDefined } from "../utils";
import {
    CodeLine,
    EndErrorLine,
    ErrorLine,
    Line,
    MessageSubstitutionLine,
    MultilineErrorLine,
    parseLine,
    printLine,
} from "./lines";
import { errorComparator, LintError, lintSyntaxError } from "./lintError";

let scanner: ts.Scanner | undefined;

export function getTypescriptVersionRequirement(text: string): string | undefined {
    const lines = text.split(/\r?\n/);
    const firstLine = parseLine(lines[0]);
    if (firstLine instanceof MessageSubstitutionLine && firstLine.key === "typescript") {
        return firstLine.message;
    }
    return undefined;
}

export function getNormalizedTypescriptVersion(): string {
    const tsVersion = new semver.SemVer(ts.version);
    // remove prerelease suffix when matching to allow testing with nightly builds
    return `${tsVersion.major}.${tsVersion.minor}.${tsVersion.patch}`;
}

export function preprocessDirectives(text: string): string {
    if (!/^#(?:if|else|endif)\b/m.test(text)) {
        return text; // If there are no directives, just return the input unchanged
    }
    const tsVersion = getNormalizedTypescriptVersion();
    const enum State {
        Initial,
        If,
        Else,
    }
    const lines = text.split(/\n/);
    const result = [];
    let collecting = true;
    let state = State.Initial;
    for (const line of lines) {
        if (line.startsWith("#if typescript")) {
            if (state !== State.Initial) {
                throw lintSyntaxError("#if directives cannot be nested");
            }
            state = State.If;
            collecting = semver.satisfies(tsVersion, line.slice("#if typescript".length).trim());
        } else if (/^#else\s*$/.test(line)) {
            if (state !== State.If) {
                throw lintSyntaxError("unexpected #else");
            }
            state = State.Else;
            collecting = !collecting;
        } else if (/^#endif\s*$/.test(line)) {
            if (state === State.Initial) {
                throw lintSyntaxError("unexpected #endif");
            }
            state = State.Initial;
            collecting = true;
        } else if (collecting) {
            result.push(line);
        }
    }

    if (state !== State.Initial) {
        throw lintSyntaxError("expected #endif");
    }

    return result.join("\n");
}

/**
 * Takes the full text of a .lint file and returns the contents of the file
 * with all error markup removed
 */
export function removeErrorMarkup(text: string): string {
    const textWithMarkup = text.split("\n");
    const lines = textWithMarkup.map(parseLine);
    const codeText = lines
        .filter(line => line instanceof CodeLine)
        .map(line => (line as CodeLine).contents);
    return codeText.join("\n");
}

/* tslint:disable:object-literal-sort-keys */
/**
 * Takes the full text of a .lint file and returns an array of LintErrors
 * corresponding to the error markup in the file.
 */
export function parseErrorsFromMarkup(text: string): LintError[] {
    const textWithMarkup = text.split("\n");
    const lines = textWithMarkup.map(parseLine);

    if (lines.length > 0 && !(lines[0] instanceof CodeLine)) {
        throw lintSyntaxError("text cannot start with an error mark line.");
    }

    const messageSubstitutionLines = lines.filter(
        l => l instanceof MessageSubstitutionLine,
    ) as MessageSubstitutionLine[];
    const messageSubstitutions = new Map<string, string>();
    for (const { key, message } of messageSubstitutionLines) {
        messageSubstitutions.set(key, formatMessage(messageSubstitutions, message));
    }

    // errorLineForCodeLine[5] contains all the ErrorLine objects associated with the 5th line of code, for example
    const errorLinesForCodeLines = createCodeLineNoToErrorsMap(lines);

    const lintErrors: LintError[] = [];
    function addError(
        errorLine: EndErrorLine,
        errorStartPos: { line: number; col: number },
        lineNo: number,
    ) {
        lintErrors.push({
            startPos: errorStartPos,
            endPos: { line: lineNo, col: errorLine.endCol },
            message: substituteMessage(messageSubstitutions, errorLine.message),
        });
    }
    // for each line of code...
    errorLinesForCodeLines.forEach((errorLinesForLineOfCode, lineNo) => {
        // for each error marking on that line...
        while (errorLinesForLineOfCode.length > 0) {
            const errorLine = errorLinesForLineOfCode.shift();
            const errorStartPos = { line: lineNo, col: errorLine!.startCol };

            // if the error starts and ends on this line, add it now to list of errors
            if (errorLine instanceof EndErrorLine) {
                addError(errorLine, errorStartPos, lineNo);

                // if the error is the start of a multiline error
            } else if (errorLine instanceof MultilineErrorLine) {
                // iterate through the MultilineErrorLines until we get to an EndErrorLine
                for (let nextLineNo = lineNo + 1; ; ++nextLineNo) {
                    if (!isValidErrorMarkupContinuation(errorLinesForCodeLines, nextLineNo)) {
                        throw lintSyntaxError(
                            `Error mark starting at ${errorStartPos.line}:${
                                errorStartPos.col
                            } does not end correctly.`,
                        );
                    } else {
                        const nextErrorLine = errorLinesForCodeLines[nextLineNo].shift();

                        // if end of multiline error, add it it list of errors
                        if (nextErrorLine instanceof EndErrorLine) {
                            addError(nextErrorLine, errorStartPos, nextLineNo);
                            break;
                        }
                    }
                }
            }
        }
    });

    lintErrors.sort(errorComparator);

    return lintErrors;
}

/**
 * Process `message` as follows:
 * - search `substitutions` for an exact match and return the substitution
 * - try to format the message when it looks like: name % ('substitution1' [, "substitution2" [, ...]])
 * - or return it unchanged
 */
function substituteMessage(templates: Map<string, string>, message: string): string {
    const substitution = templates.get(message);
    if (substitution !== undefined) {
        return substitution;
    }
    return formatMessage(templates, message);
}

/**
 * Tries to format the message when it has the correct format or returns it unchanged:  name % ('substitution1' [, "substitution2" [, ...]])
 * Where `name` is the name of a message substitution that is used as template.
 * If `name` is not found in `templates`, `message` is returned unchanged.
 */
function formatMessage(templates: Map<string, string>, message: string): string {
    const formatMatch = /^([-\w]+) % \((.+)\)$/.exec(message);
    if (formatMatch !== null) {
        const template = templates.get(formatMatch[1]);
        if (template !== undefined) {
            const formatArgs = parseFormatArguments(formatMatch[2]);
            if (formatArgs !== undefined) {
                message = format(template, ...formatArgs);
            }
        }
    }
    return message;
}

/**
 * Parse a list of comma separated string literals.
 * This function bails out if it sees something unexpected.
 * Whitespace between tokens is ignored.
 * Trailing comma is allowed.
 */
function parseFormatArguments(text: string): string[] | undefined {
    if (scanner === undefined) {
        // once the scanner is created, it is cached for subsequent calls
        scanner = ts.createScanner(ts.ScriptTarget.Latest, false);
    }
    scanner.setText(text);
    const result: string[] = [];
    let expectValue = true;
    for (
        let token = scanner.scan();
        token !== ts.SyntaxKind.EndOfFileToken;
        token = scanner.scan()
    ) {
        if (token === ts.SyntaxKind.StringLiteral) {
            if (!expectValue) {
                return undefined;
            }
            result.push(scanner.getTokenValue());
            expectValue = false;
        } else if (token === ts.SyntaxKind.CommaToken) {
            if (expectValue) {
                return undefined;
            }
            expectValue = true;
        } else if (token !== ts.SyntaxKind.WhitespaceTrivia) {
            // only ignore whitespace, other trivia like comments makes this function bail out
            return undefined;
        }
    }

    return result.length === 0 ? undefined : result;
}

export function createMarkupFromErrors(fileName: string, code: string, lintErrors: LintError[]) {
    lintErrors.sort(errorComparator);

    const codeText = code.split("\n");
    const errorLinesForCodeText: ErrorLine[][] = codeText.map(() => []);

    for (const error of lintErrors) {
        const { startPos, endPos, message } = error;

        if (startPos.line === endPos.line) {
            // single line error
            errorLinesForCodeText[startPos.line].push(
                new EndErrorLine(startPos.col, endPos.col, message),
            );
        } else {
            // multiline error
            errorLinesForCodeText[startPos.line].push(new MultilineErrorLine(startPos.col));
            for (let lineNo = startPos.line + 1; lineNo < endPos.line; ++lineNo) {
                errorLinesForCodeText[lineNo].push(new MultilineErrorLine(0));
            }
            errorLinesForCodeText[endPos.line].push(new EndErrorLine(0, endPos.col, message));
        }
    }

    return flatMap(codeText, (line, i) => [
        line,
        ...mapDefined(errorLinesForCodeText[i], err => printLine(fileName, err, line)),
    ]).join("\n");
}
/* tslint:enable:object-literal-sort-keys */

function createCodeLineNoToErrorsMap(lines: Line[]) {
    const errorLinesForCodeLine: ErrorLine[][] = [];
    for (const line of lines) {
        if (line instanceof CodeLine) {
            errorLinesForCodeLine.push([]);
        } else if (line instanceof ErrorLine) {
            errorLinesForCodeLine[errorLinesForCodeLine.length - 1].push(line);
        }
    }
    return errorLinesForCodeLine;
}

function isValidErrorMarkupContinuation(errorLinesForCodeLines: ErrorLine[][], lineNo: number) {
    return (
        lineNo < errorLinesForCodeLines.length &&
        errorLinesForCodeLines[lineNo].length !== 0 &&
        errorLinesForCodeLines[lineNo][0].startCol === 0
    );
}
