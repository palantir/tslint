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
    isClassLikeDeclaration,
    isInterfaceDeclaration,
    isSymbolFlagSet,
    isTypeAliasDeclaration,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { find } from "../utils";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "use-default-type-parameter",
        description:
            "Warns if an explicitly specified type argument is the default for that type parameter.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "This is the default value for this type parameter, so it can be omitted.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

interface ArgsAndParams {
    typeArguments: ts.NodeArray<ts.TypeNode>;
    typeParameters: ReadonlyArray<ts.TypeParameterDeclaration>;
}

function walk(ctx: Lint.WalkContext<void>, checker: ts.TypeChecker): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        const argsAndParams = getArgsAndParameters(node, checker);
        if (argsAndParams !== undefined) {
            checkArgsAndParameters(argsAndParams);
        }
        return ts.forEachChild(node, cb);
    });

    function checkArgsAndParameters({ typeArguments, typeParameters }: ArgsAndParams): void {
        // Just check the last one. Must specify previous type parameters if the last one is specified.
        const i = typeArguments.length - 1;
        const arg = typeArguments[i];
        const param = typeParameters[i];
        // TODO: would like checker.areTypesEquivalent. https://github.com/Microsoft/TypeScript/issues/13502
        if (param.default !== undefined && param.default.getText() === arg.getText()) {
            ctx.addFailureAtNode(arg, Rule.FAILURE_STRING, createFix());
        }

        function createFix(): Lint.Fix {
            if (i === 0) {
                return Lint.Replacement.deleteFromTo(typeArguments.pos - 1, typeArguments.end + 1);
            } else {
                return Lint.Replacement.deleteFromTo(typeArguments[i - 1].end, arg.end);
            }
        }
    }
}

function getArgsAndParameters(node: ts.Node, checker: ts.TypeChecker): ArgsAndParams | undefined {
    switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
        case ts.SyntaxKind.NewExpression:
        case ts.SyntaxKind.TypeReference:
        case ts.SyntaxKind.ExpressionWithTypeArguments:
            const decl = node as
                | ts.CallExpression
                | ts.NewExpression
                | ts.TypeReferenceNode
                | ts.ExpressionWithTypeArguments;
            const { typeArguments } = decl;
            if (typeArguments === undefined) {
                return undefined;
            }
            const typeParameters =
                decl.kind === ts.SyntaxKind.TypeReference
                    ? typeParamsFromType(decl.typeName, checker)
                    : decl.kind === ts.SyntaxKind.ExpressionWithTypeArguments
                        ? typeParamsFromType(decl.expression, checker)
                        : typeParamsFromCall(node as ts.CallExpression | ts.NewExpression, checker);
            return typeParameters === undefined ? undefined : { typeArguments, typeParameters };
        default:
            return undefined;
    }
}

function typeParamsFromCall(
    node: ts.CallLikeExpression,
    checker: ts.TypeChecker,
): ReadonlyArray<ts.TypeParameterDeclaration> | undefined {
    const sig = checker.getResolvedSignature(node);
    const sigDecl = sig === undefined ? undefined : sig.getDeclaration();
    if (sigDecl === undefined) {
        return node.kind === ts.SyntaxKind.NewExpression
            ? typeParamsFromType(node.expression, checker)
            : undefined;
    }

    return sigDecl.typeParameters === undefined ? undefined : sigDecl.typeParameters;
}

function typeParamsFromType(
    type: ts.EntityName | ts.Expression,
    checker: ts.TypeChecker,
): ReadonlyArray<ts.TypeParameterDeclaration> | undefined {
    const sym = getAliasedSymbol(checker.getSymbolAtLocation(type), checker);
    if (sym === undefined || sym.declarations === undefined) {
        return undefined;
    }

    return find(
        sym.declarations,
        decl =>
            isClassLikeDeclaration(decl) ||
            isTypeAliasDeclaration(decl) ||
            isInterfaceDeclaration(decl)
                ? decl.typeParameters
                : undefined,
    );
}

function getAliasedSymbol(
    symbol: ts.Symbol | undefined,
    checker: ts.TypeChecker,
): ts.Symbol | undefined {
    if (symbol === undefined) {
        return undefined;
    }
    return isSymbolFlagSet(symbol, ts.SymbolFlags.Alias)
        ? checker.getAliasedSymbol(symbol)
        : symbol;
}
