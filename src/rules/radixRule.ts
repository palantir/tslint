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

import * as ts from "typescript";
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "radix",
        description: "Requires the radix parameter to be specified when calling `parseInt`.",
        rationale: Lint.Utils.dedent`
            From [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt): 
            > Always specify this parameter to eliminate reader confusion and to guarantee predictable behavior.
            > Different implementations produce different results when a radix is not specified, usually defaulting the value to 10.`,
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "missing radix parameter";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const radixWalker = new RadixWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(radixWalker);
    }
}

class RadixWalker extends Lint.RuleWalker {
    public visitCallExpression(node: ts.CallExpression) {
        const expression = node.expression;

        if (expression.kind === ts.SyntaxKind.Identifier
                && node.getFirstToken().getText() === "parseInt"
                && node.arguments.length < 2) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }

        super.visitCallExpression(node);
    }
}
