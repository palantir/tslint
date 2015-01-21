/*
 * Copyright 2013 Palantir Technologies, Inc.
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

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "file should end with a newline";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        var eofToken = sourceFile.endOfFileToken;
        var eofTokenFullText = eofToken.getFullText();
        if (eofTokenFullText.length === 0 || eofTokenFullText.charAt(eofTokenFullText.length - 1) !== "\n") {
            var start = eofToken.getStart();
            var failure = new Lint.RuleFailure(sourceFile, start, start, Rule.FAILURE_STRING, this.getOptions().ruleName);
            return [failure];
        }

        return [];
    }
}
