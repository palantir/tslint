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

import {LintError, FILE_EXTENSION, errorComparator, lintSyntaxError} from "./types";
import {ErrorLine, CodeLine, MultilineErrorLine, EndErrorLine, MessageSubstitutionLine, classifyLine, createErrorString} from "./lines";

export function removeErrorMarkup(text: string): string {
    const textLines = text.split("\n");
    const lines = textLines.map(classifyLine);
    const codeLines = lines.filter((line) => (line instanceof CodeLine)).map((line) => (<CodeLine>line).contents);
    return codeLines.join("\n");
}

/* tslint:disable:object-literal-sort-keys */
export function parseErrorsFromMarkup(text: string): LintError[] {
    const textLines = text.split("\n");
    const classifiedLines = textLines.map(classifyLine);

    if (classifiedLines.length > 0 && !(classifiedLines[0] instanceof CodeLine)) {
        throw lintSyntaxError(`Cannot start a ${FILE_EXTENSION} file with an error mark line.`);
    }

    const messageSubstitutionLines = <MessageSubstitutionLine[]> classifiedLines.filter((l) => l instanceof MessageSubstitutionLine);
    const messageSubstitutions = messageSubstitutionLines.reduce((obj, line) => {
        obj[line.key] = line.message;
        return obj;
    }, <any>{});

    // map each actual line of code to the error markings beneath it
    const errorMarkupForLinesOfCode = classifiedLines.reduce((lineMap, line) => {
        if (line instanceof CodeLine) {
            lineMap.push([]);
        } else if (line instanceof MessageSubstitutionLine) {
            // do nothing, already processed above
        } else {
            lineMap[lineMap.length - 1].push(<ErrorLine>line);
        }
        return lineMap;
    }, (<ErrorLine[][]> []));


    const lintErrors: LintError[] = [];

    // for each line of code...
    errorMarkupForLinesOfCode.forEach((errorMarkupForLineOfCode, lineNo) => {

        // for each error marking on that line...
        while (errorMarkupForLineOfCode.length > 0) {
            const errorMarkup = errorMarkupForLineOfCode.shift();
            const errorStartPos = { line: lineNo, col: errorMarkup.startCol };

            // if the error starts and ends on this line, add it now to list of errors
            if (errorMarkup instanceof EndErrorLine) {
                lintErrors.push({
                    startPos: errorStartPos,
                    endPos: { line: lineNo, col: errorMarkup.endCol },
                    message: getFullMessage(messageSubstitutions, errorMarkup.message)
                });

            // if the error is the start of a multiline error
            } else if (errorMarkup instanceof MultilineErrorLine) {

                // keep going until we get to the end of the multiline error
                for (let nextLineNo = lineNo + 1; ; ++nextLineNo) {
                    if (!validErrorMarkupContinuation(errorMarkupForLinesOfCode, nextLineNo)) {
                        throw lintSyntaxError(
                            `Error mark starting at ${errorStartPos.line}:${errorStartPos.col} does not end correctly.`
                        );
                    } else {
                        const nextErrorLine = errorMarkupForLinesOfCode[nextLineNo].shift();

                        // if end of multiline error, add it it list of errors
                        if (nextErrorLine instanceof EndErrorLine) {
                            lintErrors.push({
                                startPos: errorStartPos,
                                endPos: { line: nextLineNo, col: nextErrorLine.endCol },
                                message: getFullMessage(messageSubstitutions, nextErrorLine.message)
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
    const errorMarkupForLinesOfCode: ErrorLine[][] = codeLines.map(() => []);

    for (const error of lintErrors) {
        const {startPos, endPos, message} = error;

        if (startPos.line === endPos.line) {  // single line error
            errorMarkupForLinesOfCode[startPos.line].push(new EndErrorLine(
                startPos.col,
                endPos.col,
                message
            ));
        } else {  // multiline error
            errorMarkupForLinesOfCode[startPos.line].push(new MultilineErrorLine(startPos.col));
            for (let lineNo = startPos.line + 1; lineNo < endPos.line; ++lineNo) {
                errorMarkupForLinesOfCode[lineNo].push(new MultilineErrorLine(0));
            }
            errorMarkupForLinesOfCode[endPos.line].push(new EndErrorLine(0, endPos.col, message));
        }
    }

    const resultLines = codeLines.reduce((finalLines, codeLine, i) => {
        finalLines.push(codeLine);
        for (const errorMarkup of errorMarkupForLinesOfCode[i]) {
            finalLines.push(createErrorString(codeLine, errorMarkup));
        }
        return finalLines;
    }, <string[]>[]);
    return resultLines.join("\n");
}

function getFullMessage(messageSubstitutions: {[k: string]: string}, message: string) {
    return messageSubstitutions[message] || message;
}

function validErrorMarkupContinuation(errorMarkupForLinesOfCode: ErrorLine[][], lineNo: number) {
    return lineNo < errorMarkupForLinesOfCode.length
        && errorMarkupForLinesOfCode[lineNo].length !== 0
        && errorMarkupForLinesOfCode[lineNo][0].startCol === 0;
}
/* tslint:enable:object-literal-sort-keys */
