/**
 * @license Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 */

import * as Lint from "tslint";
import { isTypeReference, isUnionType } from "tsutils";
import * as ts from "typescript";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-null-undefined-union",
        description: "Disallows union types with both `null` and `undefined` as members.",
        rationale: Lint.Utils.dedent`
            A union type that includes both \`null\` and \`undefined\` is either redundant or fragile.
            Enforcing the choice between the two allows the \`triple-equals\` rule to exist without
            exceptions, and is essentially a more flexible version of the \`no-null-keyword\` rule.
        `,
        optionsDescription: "True if the rule should be enabled.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Union type cannot include both 'null' and 'undefined'.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(ctx: Lint.WalkContext<void>, tc: ts.TypeChecker): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isFunctionLikeDeclaration(node) && checkFunctionLikeDeclaration(node, tc)) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        } else if (isVariableLikeDeclaration(node) && checkVariableLikeDeclaration(node, tc)) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });
}

function isFunctionLikeDeclaration(node: ts.Node): node is ts.FunctionLikeDeclaration {
    return (
        ts.isFunctionDeclaration(node) ||
        ts.isMethodDeclaration(node) ||
        ts.isGetAccessor(node) ||
        ts.isSetAccessor(node) ||
        ts.isConstructorDeclaration(node) ||
        ts.isFunctionExpression(node) ||
        ts.isArrowFunction(node)
    );
}

function isVariableLikeDeclaration(node: ts.Node): node is ts.VariableLikeDeclaration {
    return (
        ts.isVariableDeclaration(node) ||
        ts.isParameter(node) ||
        ts.isBindingElement(node) ||
        ts.isPropertyDeclaration(node) ||
        ts.isPropertyAssignment(node) ||
        ts.isPropertySignature(node) ||
        ts.isJsxAttribute(node) ||
        ts.isShorthandPropertyAssignment(node) ||
        ts.isEnumMember(node) ||
        ts.isJSDocPropertyTag(node) ||
        ts.isJSDocParameterTag(node)
    );
}

function checkFunctionLikeDeclaration(node: ts.FunctionLikeDeclaration, tc: ts.TypeChecker): boolean {
    const signature = tc.getSignatureFromDeclaration(node);
    return signature !== undefined ? isNullUndefinedUnion(signature.getReturnType()) : false;
}

function checkVariableLikeDeclaration(node: ts.VariableLikeDeclaration, tc: ts.TypeChecker): boolean {
    return isNullUndefinedUnion(tc.getTypeAtLocation(node));
}

function isNullUndefinedUnion(type: ts.Type): boolean {
    if (isTypeReference(type) && type.typeArguments !== undefined) {
        return type.typeArguments.some(isNullUndefinedUnion);
    }

    if (isUnionType(type)) {
        let hasNull = false;
        let hasUndefined = false;
        for (const subType of type.types) {
            hasNull = hasNull || subType.getFlags() === ts.TypeFlags.Null;
            hasUndefined = hasUndefined || subType.getFlags() === ts.TypeFlags.Undefined;
            if (hasNull && hasUndefined) {
                return true;
            }
        }
    }
    return false;
}
