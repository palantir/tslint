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

import { isNewExpression } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-construct",
        description: "Disallows access to the constructors of `String`, `Number`, and `Boolean`.",
        descriptionDetails:
            "Disallows constructor use such as `new Number(foo)` but does not disallow `Number(foo)`.",
        rationale: Lint.Utils.dedent`
            There is little reason to use \`String\`, \`Number\`, or \`Boolean\` as constructors.
            In almost all cases, the regular function-call version is more appropriate.
            [More details](http://stackoverflow.com/q/4719320/3124288) are available on StackOverflow.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Forbidden constructor, use a literal or simple function call instead";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isNewExpression(node) && node.expression.kind === ts.SyntaxKind.Identifier) {
            switch ((node.expression as ts.Identifier).text) {
                case "Boolean":
                case "String":
                case "Number":
                    ctx.addFailure(
                        node.getStart(ctx.sourceFile),
                        node.expression.end,
                        Rule.FAILURE_STRING
                    );
            }
        }
        return ts.forEachChild(node, cb);
    });
}
