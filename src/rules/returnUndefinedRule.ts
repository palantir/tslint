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

import * as u from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "return-undefined",
        description: "Prefer `return;` in void functions and `return undefined;` in value-returning functions.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "style",
        typescriptOnly: false,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_VALUE_RETURN =
        "Value-returning function should use `return undefined;`, not just `return;`.";
    public static FAILURE_STRING_VOID_RETURN =
        "`void` function should use `return;`, not `return undefined;`.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, (ctx) => walk(ctx, program.getTypeChecker()));
    }
}

function walk(ctx: Lint.WalkContext<void>, checker: ts.TypeChecker) {
    return ts.forEachChild(ctx.sourceFile, cb);
    function cb(node: ts.Node): void {
        check(node);
        return ts.forEachChild(node, cb);
    }

    function check(node: ts.Node): void {
        if (!u.isReturnStatement(node)) {
            return;
        }

        const actualReturnKind = returnKindFromReturn(node);
        if (actualReturnKind === undefined) {
            return;
        }

        const functionReturningFrom = Lint.ancestorWhere(node, isFunctionLike) as FunctionLike | undefined;
        if (!functionReturningFrom) {
            // Return outside of function is invalid
            return;
        }

        const returnKindFromType = getReturnKind(functionReturningFrom, checker);
        if (returnKindFromType !== undefined && returnKindFromType !== actualReturnKind) {
            ctx.addFailureAtNode(node,
                returnKindFromType === ReturnKind.Void ? Rule.FAILURE_STRING_VOID_RETURN : Rule.FAILURE_STRING_VALUE_RETURN);
        }
    }
}

function returnKindFromReturn(node: ts.ReturnStatement): ReturnKind | undefined {
    if (!node.expression) {
        return ReturnKind.Void;
    } else if (u.isIdentifier(node.expression) && node.expression.text === "undefined") {
        return ReturnKind.Value;
    } else {
        return undefined;
    }
}

enum ReturnKind {
    Void,
    Value,
}

type FunctionLike =
    | ts.FunctionDeclaration
    | ts.FunctionExpression
    | ts.ArrowFunction
    | ts.MethodDeclaration
    | ts.ConstructorDeclaration
    | ts.GetAccessorDeclaration
    | ts.SetAccessorDeclaration;

function getReturnKind(node: FunctionLike, checker: ts.TypeChecker): ReturnKind | undefined {
    switch (node.kind) {
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.SetAccessor:
            return ReturnKind.Void;
        case ts.SyntaxKind.GetAccessor:
            return ReturnKind.Value;
        default:
    }

    // Go with an explicit type declaration if possible.
    if (node.type) {
        return node.type.kind === ts.SyntaxKind.VoidKeyword ? ReturnKind.Void : ReturnKind.Value;
    }

    const contextualType = node.kind === ts.SyntaxKind.FunctionExpression || node.kind === ts.SyntaxKind.ArrowFunction
        ? checker.getContextualType(node)
        : undefined;

    const ty = contextualType || checker.getTypeAtLocation(node);
    if (!ty) {
        // Type error somewhere. Bail.
        return undefined;
    }

    const sig = checker.getSignaturesOfType(ty, ts.SignatureKind.Call)[0];
    const returnType = checker.getReturnTypeOfSignature(sig);
    return Lint.isTypeFlagSet(returnType, ts.TypeFlags.Void) ? ReturnKind.Void : ReturnKind.Value;
}

function isFunctionLike(node: ts.Node): node is FunctionLike {
    switch (node.kind) {
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
            return true;
        default:
            return false;
    }
}
