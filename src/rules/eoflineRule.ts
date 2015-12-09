/**
 * @license
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

import * as Lint from "../lint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "eofline",
        description: "Ensures the file ends with a newline.",
        rationale: "It is a [standard convention](http://stackoverflow.com/q/729692/3124288) to end files with a newline.",
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "maintainability",
    };
    /* tslint:enable:object-literal-sort-keys */
    public static FAILURE_STRING = "file should end with a newline";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.text === "") {
            // if the file is empty, it "ends with a newline", so don't return a failure
            return [];
        }

        const eofToken = sourceFile.endOfFileToken;
        const eofTokenFullText = eofToken.getFullText();
        if (eofTokenFullText.length === 0 || eofTokenFullText.charAt(eofTokenFullText.length - 1) !== "\n") {
            const start = eofToken.getStart();
            return [
                new Lint.RuleFailure(sourceFile, start, start, Rule.FAILURE_STRING, this.getOptions().ruleName),
            ];
        }

        return [];
    }
}
