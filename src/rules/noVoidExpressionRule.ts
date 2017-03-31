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

import * as Lint from "../index";
import { isTypeFlagSet } from "../language/utils";

const OPTION_ALLOW_ARROW_FUNCTION_SHORTHAND = "allow-arrow-function-shorthand";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-void-expression",
        description: "Requires expressions of type `void` to appear in statement position.",
        optionsDescription: Lint.Utils.dedent`
            If \`${OPTION_ALLOW_ARROW_FUNCTION_SHORTHAND}\` is provided, \`() => returnsVoid()\` will be allowed.
            Otherwise, it must be written as \`() => { returnsVoid(); }\`.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_ALLOW_ARROW_FUNCTION_SHORTHAND],
            },
            minLength: 0,
            maxLength: 1,
        },
        requiresTypeInfo: true,
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Expression has type `void`. Put it on its own line as a statement.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const allowArrowFunctionShorthand = this.ruleArguments.indexOf(OPTION_ALLOW_ARROW_FUNCTION_SHORTHAND) !== -1;
        return this.applyWithFunction(sourceFile, (ctx) => walk(ctx, program.getTypeChecker()), allowArrowFunctionShorthand);
    }
}

function walk(ctx: Lint.WalkContext<boolean>, checker: ts.TypeChecker): void {
    const { sourceFile, options: allowArrowFunctionShorthand } = ctx;
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (isPossiblyVoidExpression(node)
                && !isParentAllowedVoid(node)
                && isTypeFlagSet(checker.getTypeAtLocation(node), ts.TypeFlags.Void)) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });

    function isParentAllowedVoid(node: ts.Node): boolean {
        switch (node.parent!.kind) {
            case ts.SyntaxKind.ExpressionStatement:
                return true;
            case ts.SyntaxKind.ArrowFunction:
                return allowArrowFunctionShorthand;
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
