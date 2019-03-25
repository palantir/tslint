/**
 * @license Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 */

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

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
        const type = getType(node, tc);
        if (type !== undefined && isNullUndefinedUnion(type)) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });
}

function getType(node: ts.Node, tc: ts.TypeChecker): ts.Type | undefined {
    if (isVariableLikeDeclaration(node) && node.name.kind === ts.SyntaxKind.Identifier) {
        return tc.getTypeAtLocation(node);
    } else if (utils.isSignatureDeclaration(node)) {
        const signature = tc.getSignatureFromDeclaration(node);
        return signature === undefined ? undefined : signature.getReturnType();
    } else {
        return undefined;
    }
}

function isVariableLikeDeclaration(node: ts.Node): node is ts.VariableLikeDeclaration {
    return (
        utils.isVariableDeclaration(node) ||
        utils.isParameterDeclaration(node) ||
        utils.isPropertySignature(node) ||
        utils.isTypeAliasDeclaration(node)
    );
}

function isNullUndefinedUnion(type: ts.Type): boolean {
    if (utils.isTypeReference(type) && type.typeArguments !== undefined) {
        return type.typeArguments.some(isNullUndefinedUnion);
    }

    if (utils.isUnionType(type)) {
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
