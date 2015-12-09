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
        ruleName: "no-construct",
        description: "Disallows access to the constructors of `String`, `Number`, and `Boolean`.",
        descriptionDetails: "Disallows constructor use such as `new Number(foo)` but does not disallow `Number(foo)`.",
        rationale: Lint.Utils.dedent`
            There is little reason to use \`String\`, \`Number\`, or \`Boolean\` as constructors.
            In almost all cases, the regular function-call version is more appropriate.
            [More details](http://stackoverflow.com/q/4719320/3124288) are available on StackOverflow.`,
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "undesirable constructor use";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoConstructWalker(sourceFile, this.getOptions()));
    }
}

class NoConstructWalker extends Lint.RuleWalker {
    private static FORBIDDEN_CONSTRUCTORS = [
        "Boolean",
        "Number",
        "String",
    ];

    public visitNewExpression(node: ts.NewExpression) {
        if (node.expression.kind === ts.SyntaxKind.Identifier) {
            const identifier = <ts.Identifier> node.expression;
            const constructorName = identifier.text;
            if (NoConstructWalker.FORBIDDEN_CONSTRUCTORS.indexOf(constructorName) !== -1) {
                const failure = this.createFailure(node.getStart(), identifier.getEnd() - node.getStart(), Rule.FAILURE_STRING);
                this.addFailure(failure);
            }
        }
        super.visitNewExpression(node);
    }
}
