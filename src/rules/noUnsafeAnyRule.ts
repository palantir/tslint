/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unsafe-any",
        description: Lint.Utils.dedent`
            Warns when using an expression of type 'any' in a dynamic way.
            Uses are only allowed if they would work for \`{} | null | undefined\`.
            Type casts and tests are allowed.
            Expressions that work on all values (such as \`"" + x\`) are allowed.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Unsafe use of expression of type 'any'.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, (ctx) => walk(ctx, program.getTypeChecker()));
    }
}

// This is marked @internal, but we need it!
const isExpression: (node: ts.Node) => node is ts.Expression = (ts as any).isExpression;

function walk(ctx: Lint.WalkContext<void>, checker: ts.TypeChecker): void {
    return ts.forEachChild(ctx.sourceFile, recur);
    function recur(node: ts.Node): void {
        if (isExpression(node) && isAny(checker.getTypeAtLocation(node)) && !isAllowedLocation(node, checker)) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        } else {
            return ts.forEachChild(node, recur);
        }
    }
}

function isAllowedLocation(node: ts.Expression, { getContextualType, getTypeAtLocation }: ts.TypeChecker): boolean {
    const parent = node.parent!;
    switch (parent.kind) {
        case ts.SyntaxKind.ExpressionStatement: // Allow unused expression
        case ts.SyntaxKind.Parameter: // Allow to declare a parameter of type 'any'
        case ts.SyntaxKind.TypeOfExpression: // Allow test
        case ts.SyntaxKind.TemplateSpan: // Allow stringification (works on all values)
        // Allow casts
        case ts.SyntaxKind.TypeAssertionExpression:
        case ts.SyntaxKind.AsExpression:
            return true;

        // OK to pass 'any' to a function that takes 'any' as its argument
        case ts.SyntaxKind.CallExpression:
        case ts.SyntaxKind.NewExpression:
            return isAny(getContextualType(node));

        case ts.SyntaxKind.BinaryExpression:
            const { left, right, operatorToken } = parent as ts.BinaryExpression;
            // Allow equality since all values support equality.
            if (Lint.getEqualsKind(operatorToken) !== undefined) {
                return true;
            }
            switch (operatorToken.kind) {
                case ts.SyntaxKind.InstanceOfKeyword: // Allow test
                    return true;
                case ts.SyntaxKind.PlusToken: // Allow stringification
                    return node === left ? isStringLike(right) : isStringLike(left);
                case ts.SyntaxKind.PlusEqualsToken: // Allow stringification in `str += x;`, but not `x += str;`.
                    return node === right && isStringLike(left);
                default:
                    return false;
            }

        // Allow `const x = foo;`, but not `const x: Foo = foo;`.
        case ts.SyntaxKind.VariableDeclaration:
            return Lint.hasModifier(parent.parent!.parent!.modifiers, ts.SyntaxKind.DeclareKeyword) ||
                (parent as ts.VariableDeclaration).type === undefined;

        case ts.SyntaxKind.PropertyAccessExpression:
            // Don't warn for right hand side; this is redundant if we warn for the left-hand side.
            return (parent as ts.PropertyAccessExpression).name === node;

        default:
            return false;
    }

    function isStringLike(expr: ts.Expression): boolean {
        return Lint.isTypeFlagSet(getTypeAtLocation(expr), ts.TypeFlags.StringLike);
    }
}

function isAny(type: ts.Type | undefined): boolean {
    return type !== undefined && Lint.isTypeFlagSet(type, ts.TypeFlags.Any);
}
