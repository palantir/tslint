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

import { isThisParameter } from "tsutils";
import * as ts from "typescript";
import * as Lint from "..";

const OPTION_FUNCTION_IN_METHOD = "check-function-in-method";
const DEPRECATED_OPTION_FUNCTION_IN_METHOD = "no-this-in-function-in-method";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-invalid-this",
        description: "Disallows using the `this` keyword outside of classes.",
        rationale:
            "See [the rule's author's rationale here.](https://github.com/palantir/tslint/pull/1105#issue-147549402)",
        optionsDescription: Lint.Utils.dedent`
            One argument may be optionally provided:

            * \`${OPTION_FUNCTION_IN_METHOD}\` disallows using the \`this\` keyword in functions within class methods.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_FUNCTION_IN_METHOD]
            },
            minLength: 0,
            maxLength: 1
        },
        optionExamples: [true, [true, OPTION_FUNCTION_IN_METHOD]],
        type: "functionality",
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_OUTSIDE =
        'the "this" keyword is disallowed outside of a class body';
    public static FAILURE_STRING_INSIDE =
        'the "this" keyword is disallowed in function bodies inside class methods, ' +
        "use arrow functions instead";
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const hasOption = (name: string) => this.ruleArguments.indexOf(name) !== -1;
        const checkFuncInMethod =
            hasOption(DEPRECATED_OPTION_FUNCTION_IN_METHOD) || hasOption(OPTION_FUNCTION_IN_METHOD);
        return this.applyWithFunction(sourceFile, walk, checkFuncInMethod);
    }
}

function walk(ctx: Lint.WalkContext<boolean>): void {
    const { sourceFile, options: checkFuncInMethod } = ctx;
    let inClass = false;
    let inFunctionInClass = false;

    ts.forEachChild(sourceFile, function cb(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.ClassExpression:
                if (!inClass) {
                    inClass = true;
                    ts.forEachChild(node, cb);
                    inClass = false;
                    return;
                }
                break;

            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.FunctionExpression:
                if ((node as ts.FunctionLikeDeclaration).parameters.some(isThisParameter)) {
                    return;
                }
                if (inClass) {
                    inFunctionInClass = true;
                    ts.forEachChild(node, cb);
                    inFunctionInClass = false;
                    return;
                }
                break;

            case ts.SyntaxKind.ThisKeyword:
                if (!inClass) {
                    ctx.addFailureAtNode(node, Rule.FAILURE_STRING_OUTSIDE);
                } else if (checkFuncInMethod && inFunctionInClass) {
                    ctx.addFailureAtNode(node, Rule.FAILURE_STRING_INSIDE);
                }
                return;
        }

        ts.forEachChild(node, cb);
    });
}
