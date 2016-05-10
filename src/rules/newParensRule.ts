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
        ruleName: "new-parens",
        description: "Requires parentheses when invoking a constructor via the `new` keyword.",
        rationale: "Maintains stylistic consistency with other function calls.",
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "style",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "parentheses required when invoking a constructor";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const newParensWalker = new NewParensWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(newParensWalker);
    }
}

class NewParensWalker extends Lint.RuleWalker {
    public visitNewExpression(node: ts.NewExpression) {
        if (node.arguments === undefined) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        super.visitNewExpression(node);
    }
}
