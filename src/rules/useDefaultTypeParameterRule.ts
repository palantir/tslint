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
        ruleName: "use-default-type-parameter",
        description: "Warns if an explicitly specified type argument is the default for that type parameter.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "This is the default value for this type parameter.";

    public applyWithProgram(sourceFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, (ctx) => walk(ctx, langSvc.getProgram().getTypeChecker()));
    }
}

function walk(ctx: Lint.WalkContext<void>, checker: ts.TypeChecker): void {
    return ts.forEachChild(ctx.sourceFile, recur);
    function recur(node: ts.Node): void {
        const argsAndParams = getArgsAndParameters(node, checker);
        if (argsAndParams) {
            checkArgsAndParameters(node, argsAndParams);
        }
        return ts.forEachChild(node, recur);
    }

    function checkArgsAndParameters(node: ts.Node, { typeArguments, typeParameters }: ArgsAndParams): void {
        // Just check the last one. Must specify previous type parameters if the last one is specified.
        const i = typeArguments.length - 1;
        const arg = typeArguments[i];
        const param = typeParameters[i];
        // TODO: would like checker.areTypesEquivalent. https://github.com/Microsoft/TypeScript/issues/13502
        if (param.default && param.default.getText() === arg.getText()) {
            ctx.addFailureAtNode(arg, Rule.FAILURE_STRING, ctx.createFix(replacement()));
        }

        function replacement(): Lint.Replacement {
            if (i === 0) {
                const lt = Lint.childOfKind(node, ts.SyntaxKind.LessThanToken)!;
                const gt = Lint.childOfKind(node, ts.SyntaxKind.GreaterThanToken)!;
                return Lint.Replacement.deleteFromTo(lt.getStart(), gt.getEnd());
            } else {
                return Lint.Replacement.deleteFromTo(typeArguments[i - 1].getEnd(), arg.getEnd());
            }
        }
    }
}

interface ArgsAndParams {
    typeArguments: ts.TypeNode[];
    typeParameters: ts.TypeParameterDeclaration[];
}

function getArgsAndParameters(node: ts.Node, checker: ts.TypeChecker): ArgsAndParams | undefined {
    switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
        case ts.SyntaxKind.NewExpression:
        case ts.SyntaxKind.TypeReference:
        case ts.SyntaxKind.ExpressionWithTypeArguments:
            const decl = node as ts.CallExpression | ts.NewExpression | ts.TypeReferenceNode | ts.ExpressionWithTypeArguments;
            const { typeArguments } = decl;
            if (!typeArguments) {
                return undefined;
            }
            const typeParameters = decl.kind === ts.SyntaxKind.TypeReference
                ? typeParamsFromType(decl.typeName, checker)
                : decl.kind === ts.SyntaxKind.ExpressionWithTypeArguments
                ? typeParamsFromType(decl.expression, checker)
                : typeParamsFromCall(node as ts.CallExpression | ts.NewExpression, checker);
            return typeParameters && { typeArguments, typeParameters };
        default:
            return undefined;
    }
}

function typeParamsFromCall(node: ts.CallLikeExpression, checker: ts.TypeChecker): ts.TypeParameterDeclaration[] | undefined {
    const sig = checker.getResolvedSignature(node);
    const sigDecl = sig && sig.getDeclaration();
    if (!sigDecl && node.kind === ts.SyntaxKind.NewExpression) {
        return typeParamsFromType(node.expression, checker);
    }

    if (!sigDecl || !sigDecl.typeParameters) {
        return; // Error
    }

    return sigDecl.typeParameters;
}

function typeParamsFromType(type: ts.EntityName | ts.Expression, checker: ts.TypeChecker): ts.TypeParameterDeclaration[] | undefined {
    const sym = getAliasedSymbol(checker.getSymbolAtLocation(type), checker);
    if (!sym || !sym.declarations) {
        return undefined;
    }

    for (const decl of sym.declarations) {
        switch (decl.kind) {
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.ClassExpression:
            case ts.SyntaxKind.TypeAliasDeclaration:
                const { typeParameters } = (decl as ts.ClassLikeDeclaration | ts.TypeAliasDeclaration);
                return typeParameters;
            default:
        }
    }
    return undefined;
}

function getAliasedSymbol(symbol: ts.Symbol, checker: ts.TypeChecker): ts.Symbol {
    return Lint.isSymbolFlagSet(symbol, ts.SymbolFlags.Alias) ? checker.getAliasedSymbol(symbol) : symbol;
}
