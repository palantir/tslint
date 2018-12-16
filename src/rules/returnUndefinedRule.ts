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
    isIdentifier,
    isReturnStatement,
    isTypeFlagSet,
    isTypeReference,
    isUnionType,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "return-undefined",
        description:
            "Prefer `return;` in void functions and `return undefined;` in value-returning functions.",
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
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(ctx: Lint.WalkContext<void>, checker: ts.TypeChecker) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isReturnStatement(node)) {
            check(node);
        }
        return ts.forEachChild(node, cb);
    });

    function check(node: ts.ReturnStatement): void {
        const actualReturnKind = returnKindFromReturn(node);
        if (actualReturnKind === undefined) {
            return;
        }

        const functionReturningFrom = Lint.ancestorWhere(node, isFunctionLike);
        if (functionReturningFrom === undefined) {
            // Return outside of function is invalid
            return;
        }

        const returnKindFromType = getReturnKind(functionReturningFrom, checker);
        if (returnKindFromType !== undefined && returnKindFromType !== actualReturnKind) {
            ctx.addFailureAtNode(
                node,
                returnKindFromType === ReturnKind.Void
                    ? Rule.FAILURE_STRING_VOID_RETURN
                    : Rule.FAILURE_STRING_VALUE_RETURN,
            );
        }
    }
}

function returnKindFromReturn(node: ts.ReturnStatement): ReturnKind | undefined {
    if (node.expression === undefined) {
        return ReturnKind.Void;
    } else if (isIdentifier(node.expression) && node.expression.text === "undefined") {
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
    }

    // Handle generator functions/methods:
    if (node.asteriskToken !== undefined) {
        return ReturnKind.Void;
    }

    const contextual =
        isFunctionExpressionLike(node) && node.type === undefined
            ? tryGetReturnType(checker.getContextualType(node), checker)
            : undefined;
    const returnType =
        contextual !== undefined
            ? contextual
            : tryGetReturnType(checker.getTypeAtLocation(node), checker);

    if (returnType === undefined || isTypeFlagSet(returnType, ts.TypeFlags.Any)) {
        return undefined;
    }
    if (
        (hasModifier(node.modifiers, ts.SyntaxKind.AsyncKeyword)
            ? isEffectivelyVoidPromise
            : isEffectivelyVoid)(returnType)
    ) {
        return ReturnKind.Void;
    }
    return ReturnKind.Value;
}

/** True for `void`, `undefined`, Promise<void>, or `void | undefined | Promise<void>`. */
function isEffectivelyVoidPromise(type: ts.Type): boolean {
    // Would need access to `checker.getPromisedTypeOfPromise` to do this properly.
    // Assume that the return type is the global Promise (since this is an async function) and get its type argument.

    return (
        // tslint:disable-next-line:no-bitwise
        isTypeFlagSet(type, ts.TypeFlags.Void | ts.TypeFlags.Undefined) ||
        (isUnionType(type) && type.types.every(isEffectivelyVoidPromise)) ||
        (isTypeReference(type) &&
            type.typeArguments !== undefined &&
            type.typeArguments.length === 1 &&
            isEffectivelyVoidPromise(type.typeArguments[0]))
    );
}

/** True for `void`, `undefined`, or `void | undefined`. */
function isEffectivelyVoid(type: ts.Type): boolean {
    return (
        // tslint:disable-next-line:no-bitwise
        isTypeFlagSet(type, ts.TypeFlags.Void | ts.TypeFlags.Undefined) ||
        (isUnionType(type) && type.types.every(isEffectivelyVoid))
    );
}

function tryGetReturnType(
    fnType: ts.Type | undefined,
    checker: ts.TypeChecker,
): ts.Type | undefined {
    if (fnType === undefined) {
        return undefined;
    }

    const sigs = checker.getSignaturesOfType(fnType, ts.SignatureKind.Call);
    if (sigs.length !== 1) {
        return undefined;
    }

    return checker.getReturnTypeOfSignature(sigs[0]);
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

function isFunctionExpressionLike(node: ts.Node): node is ts.FunctionExpression | ts.ArrowFunction {
    return (
        node.kind === ts.SyntaxKind.FunctionExpression || node.kind === ts.SyntaxKind.ArrowFunction
    );
}
