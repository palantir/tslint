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
  hasModifier,
  isBinaryExpression,
  isCallExpression,
  isClassDeclaration,
  isConstructorDeclaration,
  isExpressionStatement,
  isPropertyAccessExpression,
} from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

const OPTION_IGNORE_STATIC = "ignore-static";

interface Options {
    ignoreStatic: boolean;
}

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unbound-method",
        description: "Warns when a method is used as outside of a method call.",
        optionsDescription: `You may optionally pass "${OPTION_IGNORE_STATIC}" to ignore static methods.`,
        options: {
            type: "string",
            enum: [OPTION_IGNORE_STATIC],
        },
        optionExamples: [true, [true, OPTION_IGNORE_STATIC]],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Avoid referencing unbound methods which may cause unintentional scoping of 'this'.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, (ctx: Lint.WalkContext<Options>) => walk(ctx, program.getTypeChecker()), {
            ignoreStatic: this.ruleArguments.indexOf(OPTION_IGNORE_STATIC) !== -1,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>, tc: ts.TypeChecker) {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (isPropertyAccessExpression(node) && !isSafeUse(node)) {
            const symbol = tc.getSymbolAtLocation(node);
            const declaration = symbol === undefined ? undefined : symbol.valueDeclaration;
            if (declaration !== undefined &&
                isMethod(declaration, ctx.options.ignoreStatic) &&
                !isMethodBoundInConstructor(declaration, tc)) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function isMethod(node: ts.Node, ignoreStatic: boolean): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.MethodSignature:
            return !(ignoreStatic && hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword));
        default:
            return false;
    }
}

function isSafeUse(node: ts.Node): boolean {
    const parent = node.parent!;
    switch (parent.kind) {
        case ts.SyntaxKind.CallExpression:
            return (parent as ts.CallExpression).expression === node;
        case ts.SyntaxKind.TaggedTemplateExpression:
            return (parent as ts.TaggedTemplateExpression).tag === node;
        // E.g. `obj.method.bind(obj)`.
        case ts.SyntaxKind.PropertyAccessExpression:
            return true;
        // Allow most binary operators, but don't allow e.g. `myArray.forEach(obj.method || otherObj.otherMethod)`.
        case ts.SyntaxKind.BinaryExpression:
            return (parent as ts.BinaryExpression).operatorToken.kind !== ts.SyntaxKind.BarBarToken;
        case ts.SyntaxKind.NonNullExpression:
        case ts.SyntaxKind.AsExpression:
        case ts.SyntaxKind.TypeAssertionExpression:
        case ts.SyntaxKind.ParenthesizedExpression:
            return isSafeUse(parent);
        // Allow use in conditions
        case ts.SyntaxKind.ConditionalExpression:
            return (parent as ts.ConditionalExpression).condition === node;
        case ts.SyntaxKind.IfStatement:
        case ts.SyntaxKind.WhileStatement:
        case ts.SyntaxKind.DoStatement:
        case ts.SyntaxKind.ForStatement:
            return true;
        default:
            return false;
    }
}

function isMethodBoundInConstructor(methodDeclaration: ts.Declaration, tc: ts.TypeChecker): boolean {
    if (methodDeclaration.parent !== undefined && isClassDeclaration(methodDeclaration.parent)) {
        for (const member of methodDeclaration.parent.members) {
            if (isConstructorDeclaration(member) && member.body !== undefined) {
                for (const statement of member.body.statements) {
                    if (isExpressionStatement(statement) && isBinaryExpression(statement.expression)) {
                        const {left, right} = statement.expression;
                        if (isMethodPropertyAccessExpression(left, methodDeclaration, tc) &&
                            isMethodBindCallExpression(right, methodDeclaration, tc)) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

function isMethodPropertyAccessExpression(
    node: ts.Node,
    methodDeclaration: ts.Declaration,
    tc: ts.TypeChecker,
): boolean {
    return isPropertyAccessExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ThisKeyword &&
        symbolForNodeMatchesDeclaration(node, methodDeclaration, tc);
}

function isMethodBindCallExpression(
    node: ts.Node,
    methodDeclaration: ts.Declaration,
    tc: ts.TypeChecker,
): boolean {
    return isCallExpression(node) &&
        isPropertyAccessExpression(node.expression) &&
        node.expression.name.text === "bind" &&
        isPropertyAccessExpression(node.expression.expression) &&
        node.expression.expression.expression.kind === ts.SyntaxKind.ThisKeyword &&
        node.arguments[0].kind === ts.SyntaxKind.ThisKeyword &&
        symbolForNodeMatchesDeclaration(node.expression.expression, methodDeclaration, tc);
}

function symbolForNodeMatchesDeclaration(
    node: ts.Node,
    declaration: ts.Declaration,
    tc: ts.TypeChecker,
): boolean {
    const symbol = tc.getSymbolAtLocation(node);
    return symbol === undefined ? false : symbol.valueDeclaration === declaration;
}
