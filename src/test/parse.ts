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

import {FILE_EXTENSION, LintError, errorComparator, lintSyntaxError} from "./types";
import {Line, ErrorLine, CodeLine, MultilineErrorLine, EndErrorLine, MessageSubstitutionLine,
        textToLineObj, lineObjToText} from "./lines";

/**
 * Takes the full text of a .linttest file and returns the contents of the file
 * with all error markup removed
 */
export function removeErrorMarkup(text: string): string {
    const textWithMarkup = text.split("\n");
    const lines = textWithMarkup.map(textToLineObj);
    const codeText = lines.filter((line) => (line instanceof CodeLine)).map((line) => (<CodeLine>line).contents);
    return codeText.join("\n");
}

/* tslint:disable:object-literal-sort-keys */
/**
 * Takes the full text of a .linttest file and returns an array of LintErrors
 * corresponding to the error markup in the file.
 */
export function parseErrorsFromMarkup(text: string): LintError[] {
    const textWithMarkup = text.split("\n");
    const lines = textWithMarkup.map(textToLineObj);

    if (lines.length > 0 && !(lines[0] instanceof CodeLine)) {
        throw lintSyntaxError(`Cannot start a ${FILE_EXTENSION} file with an error mark line.`);
    }

    const messageSubstitutionLines = <MessageSubstitutionLine[]>lines.filter((l) => l instanceof MessageSubstitutionLine);
    const messageSubstitutions: { [key: string]: string } = {};
    for (const line of messageSubstitutionLines) {
        messageSubstitutions[line.key] = line.message;
    }

    // errorLineForCodeLine[5] contains all the ErrorLine objects associated with the 5th line of code, for example
    const errorLinesForCodeLines = separateErrorLinesFromCodeLines(lines);

    const lintErrors: LintError[] = [];
    // for each line of code...
    errorLinesForCodeLines.forEach((errorLinesForLineOfCode, lineNo) => {

        // for each error marking on that line...
        while (errorLinesForLineOfCode.length > 0) {
            const errorLine = errorLinesForLineOfCode.shift();
            const errorStartPos = { line: lineNo, col: errorLine.startCol };

            // if the error starts and ends on this line, add it now to list of errors
            if (errorLine instanceof EndErrorLine) {
                lintErrors.push({
                    startPos: errorStartPos,
                    endPos: { line: lineNo, col: errorLine.endCol },
                    message: messageSubstitutions[errorLine.message] || errorLine.message
                });

            // if the error is the start of a multiline error
            } else if (errorLine instanceof MultilineErrorLine) {

                // iterate through the MultilineErrorLines until we get to an EndErrorLine
                for (let nextLineNo = lineNo + 1; ; ++nextLineNo) {
                    if (!validErrorMarkupContinuation(errorLinesForCodeLines, nextLineNo)) {
                        throw lintSyntaxError(
                            `Error mark starting at ${errorStartPos.line}:${errorStartPos.col} does not end correctly.`
                        );
                    } else {
                        const nextErrorLine = errorLinesForCodeLines[nextLineNo].shift();

                        // if end of multiline error, add it it list of errors
                        if (nextErrorLine instanceof EndErrorLine) {
                            lintErrors.push({
                                startPos: errorStartPos,
                                endPos: { line: nextLineNo, col: nextErrorLine.endCol },
                                message: messageSubstitutions[nextErrorLine.message] || nextErrorLine.message
                            });
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

export function createMarkupFromErrors(code: string, lintErrors: LintError[]) {
    lintErrors.sort(errorComparator);

    const codeText = code.split("\n");
    const errorLinesForCodeText: ErrorLine[][] = codeText.map(() => []);

    for (const error of lintErrors) {
        const {startPos, endPos, message} = error;

        if (startPos.line === endPos.line) {  // single line error
            errorLinesForCodeText[startPos.line].push(new EndErrorLine(
                startPos.col,
                endPos.col,
                message
            ));
        } else {  // multiline error
            errorLinesForCodeText[startPos.line].push(new MultilineErrorLine(startPos.col));
            for (let lineNo = startPos.line + 1; lineNo < endPos.line; ++lineNo) {
                errorLinesForCodeText[lineNo].push(new MultilineErrorLine(0));
            }
            errorLinesForCodeText[endPos.line].push(new EndErrorLine(0, endPos.col, message));
        }
    }

    const finalText = combineCodeTextAndErrorLines(codeText, errorLinesForCodeText);
    return finalText.join("\n");
}
/* tslint:enable:object-literal-sort-keys */

function combineCodeTextAndErrorLines(codeText: string[], errorLinesForCodeText: ErrorLine[][]) {
    return codeText.reduce((finalText, code, i) => {
        finalText.push(code);
        finalText.push(...errorLinesForCodeText[i].map((line) => lineObjToText(line, code)));
        return finalText;
    }, <string[]>[]);
}

function separateErrorLinesFromCodeLines(lines: Line[]) {
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

function validErrorMarkupContinuation(errorLinesForCodeLines: ErrorLine[][], lineNo: number) {
    return lineNo < errorLinesForCodeLines.length
        && errorLinesForCodeLines[lineNo].length !== 0
        && errorLinesForCodeLines[lineNo][0].startCol === 0;
}
