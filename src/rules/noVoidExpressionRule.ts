/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import { isTypeFlagSet } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_IGNORE_ARROW_FUNCTION_SHORTHAND = "ignore-arrow-function-shorthand";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-void-expression",
        description: "Requires expressions of type `void` to appear in statement position.",
        optionsDescription: Lint.Utils.dedent`
            If \`${OPTION_IGNORE_ARROW_FUNCTION_SHORTHAND}\` is provided, \`() => returnsVoid()\` will be allowed.
            Otherwise, it must be written as \`() => { returnsVoid(); }\`.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_IGNORE_ARROW_FUNCTION_SHORTHAND],
            },
            minLength: 0,
            maxLength: 1,
        },
        rationale: Lint.Utils.dedent`
            It's misleading returning the results of an expression whose type is \`void\`.
            Attempting to do so is likely a symptom of expecting a different return type from a function.
            For example, the following code will log \`undefined\` but looks like it logs a value:

            \`\`\`
            const performWork = (): void => {
                workFirst();
                workSecond();
            };

            console.log(performWork());
            \`\`\`
        `,
        requiresTypeInfo: true,
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Expression has type `void`. Put it on its own line as a statement.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const ignoreArrowFunctionShorthand =
            this.ruleArguments.indexOf(OPTION_IGNORE_ARROW_FUNCTION_SHORTHAND) !== -1;
        return this.applyWithFunction(
            sourceFile,
            walk,
            { ignoreArrowFunctionShorthand },
            program.getTypeChecker(),
        );
    }
}

interface Options {
    ignoreArrowFunctionShorthand: boolean;
}

function walk(ctx: Lint.WalkContext<Options>, checker: ts.TypeChecker): void {
    const {
        sourceFile,
        options: { ignoreArrowFunctionShorthand },
    } = ctx;
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (
            isPossiblyVoidExpression(node) &&
            !isParentAllowedVoid(node) &&
            isTypeFlagSet(checker.getTypeAtLocation(node), ts.TypeFlags.Void)
        ) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });

    function isParentAllowedVoid(node: ts.Node): boolean {
        switch (node.parent.kind) {
            case ts.SyntaxKind.ExpressionStatement:
                return true;
            case ts.SyntaxKind.ArrowFunction:
                return ignoreArrowFunctionShorthand;

            // Something like "x && console.log(x)".
            case ts.SyntaxKind.BinaryExpression:
                return isParentAllowedVoid(node.parent);
            default:
                return false;
        }
    }
}

function isPossiblyVoidExpression(node: ts.Node): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.AwaitExpression:
        case ts.SyntaxKind.CallExpression:
        case ts.SyntaxKind.TaggedTemplateExpression:
            return true;
        default:
            return false;
    }
}
