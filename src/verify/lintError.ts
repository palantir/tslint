/*
 * @license
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

export interface PositionInFile {
   line: number;
   col: number;
}

export interface LintError {
   startPos: PositionInFile;
   endPos: PositionInFile;
   message: string;
}

export function errorComparator(err1: LintError, err2: LintError) {
    if (err1.startPos.line !== err2.startPos.line) {
        return err1.startPos.line - err2.startPos.line;
    } else if (err1.startPos.col !== err2.startPos.col) {
        return err1.startPos.col - err2.startPos.col;
    } else if (err1.endPos.line !== err2.endPos.line) {
        return err1.endPos.line - err2.endPos.line;
    } else if (err1.endPos.col !== err2.endPos.col) {
        return err1.endPos.col - err2.endPos.col;
    } else {
        return err1.message.localeCompare(err2.message);
    }
}

export function lintSyntaxError(message: string) {
    return new Error(`Lint File Syntax Error: ${message}`);
}
