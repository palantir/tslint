/**
 * @license
 * Copyright 2019 Palantir Technologies, Inc.
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

import * as tsutils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_ALLOW_GENERICS = "allow-generics";

interface Options {
    allowGenerics: boolean | Set<string>;
}

type RawOptions = undefined | {
    [OPTION_ALLOW_GENERICS]?: boolean | Set<string>;
}

type GenericReference = ts.NewExpression | ts.TypeReferenceNode;

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "invalid-void",
        description: Lint.Utils.dedent`
            Disallows usage of \`void\` type outside of generic or return types.
            If \`void\` is used as return type, it shouldn't be a part of intersection/union type.`,
        rationale: Lint.Utils.dedent`
            The \`void\` type means "nothing" or that a function does not return any value,
            in contra with implicit \`undefined\` type which means that a function returns a value \`undefined\`.
            So "nothing" cannot be mixed with any other types.
            If you need this - use \`undefined\` type instead.`,
        hasFix: false,
        optionsDescription: Lint.Utils.dedent`
            If \`${OPTION_ALLOW_GENERICS}\` is specified as \`false\`, then generic types will no longer be allowed to to be \`void\`.
            Alternately, provide an array of strings for \`${OPTION_ALLOW_GENERICS}\` to exclusively allow generic types by those names.`,
        options: {
            type: "object",
            properties: {
                [OPTION_ALLOW_GENERICS]: {
                    oneOf: [
                        { type: "boolean" },
                        { type: "array", items: { type: "string" }, minLength: 1 },
                    ],
                },
            },
            additionalProperties: false,
        },
        optionExamples: [
            true,
            [true, { [OPTION_ALLOW_GENERICS]: false }],
            [true, { [OPTION_ALLOW_GENERICS]: ["Promise", "PromiseLike"] }],
        ],
        type: "maintainability",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_ALLOW_GENERICS =
        "void is not a valid type other than generic or return types";
    public static FAILURE_STRING_NO_GENERICS = "void is not a valid type other than return types";
    public static FAILURE_WRONG_GENERIC = (genericName: string) =>
        `${genericName} may not have void as a generic type`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            // tslint:disable-next-line:no-object-literal-type-assertion
            allowGenerics: this.getAllowGenerics(this.ruleArguments[0] as RawOptions),
        });
    }

    private getAllowGenerics(rawArgument: RawOptions) {
        if (!rawArgument) {
            return true;
        }

        const allowGenerics = rawArgument[OPTION_ALLOW_GENERICS];

        return allowGenerics instanceof Array ? new Set(allowGenerics) : Boolean(allowGenerics);
    }
}

const failedKinds = new Set([
    ts.SyntaxKind.PropertySignature,
    ts.SyntaxKind.PropertyDeclaration,

    ts.SyntaxKind.VariableDeclaration,
    ts.SyntaxKind.TypeAliasDeclaration,

    ts.SyntaxKind.IntersectionType,
    ts.SyntaxKind.UnionType,

    ts.SyntaxKind.Parameter,
    ts.SyntaxKind.TypeParameter,

    ts.SyntaxKind.AsExpression,
    ts.SyntaxKind.TypeAssertionExpression,

    ts.SyntaxKind.TypeOperator,
    ts.SyntaxKind.ArrayType,

    ts.SyntaxKind.MappedType,
    ts.SyntaxKind.ConditionalType,

    ts.SyntaxKind.TypeReference,

    ts.SyntaxKind.NewExpression,
    ts.SyntaxKind.CallExpression,
]);

function walk(ctx: Lint.WalkContext<Options>): void {
    const defaultFailureString = ctx.options.allowGenerics
        ? Rule.FAILURE_STRING_ALLOW_GENERICS
        : Rule.FAILURE_STRING_NO_GENERICS;

    const getGenericReferenceName = (node: GenericReference) => {
        const rawName = ts.isNewExpression(node) ? node.expression : node.typeName;

        return ts.isIdentifier(rawName) ? rawName.text : rawName.getText(ctx.sourceFile);
    };

    const getTypeReferenceFailure = (node: GenericReference) => {
        if (!(ctx.options.allowGenerics instanceof Set)) {
            return ctx.options.allowGenerics ? undefined : defaultFailureString;
        }

        const genericName = getGenericReferenceName(node);

        return ctx.options.allowGenerics.has(genericName)
            ? undefined
            : Rule.FAILURE_WRONG_GENERIC(genericName);
    };

    const checkTypeReference = (parent: GenericReference, node: ts.Node) => {
        const failure = getTypeReferenceFailure(parent);

        if (failure !== undefined) {
            ctx.addFailureAtNode(node, failure);
        }
    };

    const isParentGenericReference = (
        parent: ts.Node,
        node: ts.Node,
    ): parent is GenericReference => {
        if (tsutils.isTypeReferenceNode(parent)) {
            return true;
        }

        return (
            ts.isNewExpression(parent) &&
            parent.typeArguments !== undefined &&
            ts.isTypeNode(node) &&
            parent.typeArguments.indexOf(node) !== -1
        );
    };

    ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.VoidKeyword && failedKinds.has(node.parent.kind)) {
            if (isParentGenericReference(node.parent, node)) {
                checkTypeReference(node.parent, node);
            } else {
                ctx.addFailureAtNode(node, defaultFailureString);
            }
        }

        ts.forEachChild(node, cb);
    });
}
