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

import {LintError, errorComparator, lintSyntaxError} from "./types";
import {ErrorLine, CodeLine, MultilineErrorLine, EndErrorLine, classifyLine, createErrorString} from "./lines";

export function removeErrorMarkup(text: string): string {
    const textLines = text.split("\n");
    const lines = textLines.map(classifyLine);
    const codeLines = lines.filter((line) => (line instanceof CodeLine)).map((line) => (<CodeLine>line).contents);
    return codeLines.join("\n");
}

/* tslint:disable:object-literal-sort-keys */
export function parseErrorsFromMarkup(text: string): LintError[] {
    const textLines = text.split("\n");
    const lines = textLines.map(classifyLine);

    if (lines.length > 0 && !(lines[0] instanceof CodeLine)) {
        throw lintSyntaxError("Cannot start a lint file with an error mark line.");
    }

    // map each line of code to the error markings beneath it
    let lineIndex = -1;
    const lineErrorMap: ErrorLine[][] = [];
    for (const line of lines) {
        if (line instanceof CodeLine) {
            lineIndex++;
            lineErrorMap[lineIndex] = [];
        } else {
            lineErrorMap[lineIndex].push(<ErrorLine>line);
        }
    }

    const lintErrors: LintError[] = [];

    // for each line of code...
    lineErrorMap.forEach((errorLines, lineNo) => {

        // for each error marking on that line...
        while (errorLines.length > 0) {
            const errorLine = errorLines.shift();
            const errorStartPos = { line: lineNo, col: errorLine.startCol };

            // if the error starts and ends on this line, add it now to list of errors
            if (errorLine instanceof EndErrorLine) {
                lintErrors.push({
                    startPos: errorStartPos,
                    endPos: { line: lineNo, col: errorLine.endCol },
                    message: errorLine.message
                });

                // if the error is the start of a multiline error
            } else if (errorLine instanceof MultilineErrorLine) {
                // keep going until we get to the end of the multiline error
                for (let endLineNo = lineNo + 1; ; ++endLineNo) {
                    if (endLineNo >= lineErrorMap.length
                        || lineErrorMap[endLineNo].length === 0
                        || lineErrorMap[endLineNo][0].startCol !== 0) {
                        throw lintSyntaxError(
                            `Error mark starting at ${errorStartPos.line}:${errorStartPos.col} does not end correctly.`
                        );
                    } else {
                        const nextErrorLine = lineErrorMap[endLineNo].shift();

                        // if end of multiline error, add it it list of errors
                        if (nextErrorLine instanceof EndErrorLine) {
                            lintErrors.push({
                                startPos: errorStartPos,
                                endPos: { line: endLineNo, col: nextErrorLine.endCol },
                                message: nextErrorLine.message
                            });
                            break;
                        }
                    }
                }
            }
        }
    });

    // sort errors by startPos then endPos
    lintErrors.sort(errorComparator);

    return lintErrors;
}

export function createMarkupFromErrors(code: string, lintErrors: LintError[]) {
    // theoretically, lint errors should be already sorted, but just to play it safe...
    lintErrors.sort(errorComparator);

    const codeLines = code.split("\n");
    const lineErrorMap: ErrorLine[][] = codeLines.map(() => []);
    for (const error of lintErrors) {
        const {startPos, endPos, message} = error;
        if (startPos.line === endPos.line) {  // single line error
            lineErrorMap[startPos.line].push(new EndErrorLine(
                startPos.col,
                endPos.col,
                message
            ));
        } else {  // multiline error
            lineErrorMap[startPos.line].push(new MultilineErrorLine(startPos.col));
            for (let lineNo = startPos.line + 1; lineNo < endPos.line; ++lineNo) {
                lineErrorMap[lineNo].push(new MultilineErrorLine(0));
            }
            lineErrorMap[endPos.line].push(new EndErrorLine(0, endPos.col, message));
        }
    }

    let resultLines: string[] = [];
    codeLines.forEach((codeLine, i) => {
        resultLines.push(codeLine);
        for (let errorLine of lineErrorMap[i]) {
            resultLines.push(createErrorString(codeLine, errorLine));
        }
    });
    return resultLines.join("\n");
}
/* tslint:enable:object-literal-sort-keys */
