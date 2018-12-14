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

import {
    hasSideEffects,
    isCallExpression,
    isExpressionValueUsed,
    isIdentifier,
    isObjectLiteralExpression,
    isPropertyAccessExpression,
    isSpreadElement,
    SideEffectOptions,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-object-spread",
        description:
            "Enforces the use of the ES2018 object spread operator over `Object.assign()` where appropriate.",
        rationale: "Object spread allows for better type checking and inference.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
        hasFix: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Use the object spread operator instead.";
    public static ASSIGNMENT_FAILURE_STRING =
        "'Object.assign' returns the first argument. Prefer object spread if you want a new object.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (
            isCallExpression(node) &&
            node.arguments.length !== 0 &&
            isPropertyAccessExpression(node.expression) &&
            node.expression.name.text === "assign" &&
            isIdentifier(node.expression.expression) &&
            node.expression.expression.text === "Object" &&
            !ts.isFunctionLike(node.arguments[0]) &&
            // Object.assign(...someArray) cannot be written as object spread
            !node.arguments.some(isSpreadElement) &&
            /**
             * @TODO
             * Remove !node.arguments.some(isThisKeyword) when typescript get's
             * support for spread types.
             * PR: https://github.com/Microsoft/TypeScript/issues/10727
             */
            !node.arguments.some(isThisKeyword)
        ) {
            if (node.arguments[0].kind === ts.SyntaxKind.ObjectLiteralExpression) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING, createFix(node, ctx.sourceFile));
            } else if (
                isExpressionValueUsed(node) &&
                !hasSideEffects(node.arguments[0], SideEffectOptions.Constructor)
            ) {
                ctx.addFailureAtNode(
                    node,
                    Rule.ASSIGNMENT_FAILURE_STRING,
                    createFix(node, ctx.sourceFile),
                );
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function createFix(node: ts.CallExpression, sourceFile: ts.SourceFile): Lint.Fix {
    const args = node.arguments;
    const objectNeedsParens = node.parent.kind === ts.SyntaxKind.ArrowFunction;
    const fix = [
        Lint.Replacement.replaceFromTo(
            node.getStart(sourceFile),
            args[0].getStart(sourceFile),
            `${objectNeedsParens ? "(" : ""}{`,
        ),
        new Lint.Replacement(node.end - 1, 1, `}${objectNeedsParens ? ")" : ""}`),
    ];
    for (let i = 0; i < args.length; ++i) {
        const arg = args[i];
        if (isObjectLiteralExpression(arg)) {
            if (arg.properties.length === 0) {
                let end = arg.end;
                if (i !== args.length - 1) {
                    end = args[i + 1].getStart(sourceFile);
                } else if (args.hasTrailingComma) {
                    end = args.end;
                }
                // remove empty object iteral and the following comma if exists
                fix.push(Lint.Replacement.deleteFromTo(arg.getStart(sourceFile), end));
            } else {
                fix.push(
                    // remove open brace
                    Lint.Replacement.deleteText(arg.getStart(sourceFile), 1),
                    // remove trailing comma if exists and close brace
                    Lint.Replacement.deleteFromTo(
                        arg.properties[arg.properties.length - 1].end,
                        arg.end,
                    ),
                );
            }
        } else {
            const parens = needsParens(arg);
            fix.push(
                Lint.Replacement.appendText(arg.getStart(sourceFile), parens ? "...(" : "..."),
            );
            if (parens) {
                fix.push(Lint.Replacement.appendText(arg.end, ")"));
            }
        }
    }

    return fix;
}

function isThisKeyword(node: ts.Expression): boolean {
    return node.kind === ts.SyntaxKind.ThisKeyword;
}

function needsParens(node: ts.Node): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.ConditionalExpression:
        case ts.SyntaxKind.BinaryExpression:
            return true;
        default:
            return false;
    }
}
