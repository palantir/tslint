/**
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

import * as ts from "typescript";

import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "cyclomatic-complexity",
        description: "Enforces a threshold of cyclomatic complexity.",
        descriptionDetails: Lint.Utils.dedent`
            Cyclomatic complexity is assessed for each function (including arrow functions). A
            starting value of 1 is assigned and this value is then incremented for every statement
            which can alter the control flow within the function.

            The following control flow statements contribute to cyclomatic complexity:
            * \`catch\`
            * \`if\` and \`else\`
            * \`? :\`
            * \`||\` and \`&&\` due to short-circuit evaluation
            * \`for\`, \`for in\` and \`for of\``,
        rationale: Lint.Utils.dedent`
            Cyclomatic complexity is a code metric which indicates the level of complexity in a
            section of code. High cyclomatic complexity indicates confusing code which may be prone
            to errors or difficult to modify.`,
        optionsDescription: Lint.Utils.dedent`
            An optional upper limit for cyclomatic complexity can be specified. If no limit option
            is provided a default value of $(Rule.DEFAULT_UPPER_LIMIT) will be used.`,
        options: {
            type: "number",
            minimum: "1",
        },
        optionExamples: ["[true, 10]"],
        type: "maintainability",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static DEFAULT_UPPER_LIMIT = 10;

    public static FAILURE_STRING = "The cyclomatic complexity of this function is higher than the allowed value";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new CyclomaticComplexityWalker(sourceFile, this.getOptions()));
    }
}

class CyclomaticComplexityWalker extends Lint.RuleWalker {
}
