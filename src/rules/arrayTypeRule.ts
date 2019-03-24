/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

type Option = "array" | "generic" | "array-simple";
const OPTION_ARRAY = "array";
const OPTION_GENERIC = "generic";
const OPTION_ARRAY_SIMPLE = "array-simple";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "array-type",
        description: "Requires using either 'T[]' or 'Array<T>' for arrays.",
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
            One of the following arguments must be provided:

            * \`"${OPTION_ARRAY}"\` enforces use of \`T[]\` for all types T.
            * \`"${OPTION_GENERIC}"\` enforces use of \`Array<T>\` for all types T.
            * \`"${OPTION_ARRAY_SIMPLE}"\` enforces use of \`T[]\` if \`T\` is a simple type (primitive or type reference).`,
        options: {
            type: "string",
            enum: [OPTION_ARRAY, OPTION_GENERIC, OPTION_ARRAY_SIMPLE],
        },
        optionExamples: [[true, OPTION_ARRAY], [true, OPTION_GENERIC], [true, OPTION_ARRAY_SIMPLE]],
        type: "style",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_ARRAY =
        "Array type using 'Array<T>' is forbidden. Use 'T[]' instead.";
    public static FAILURE_STRING_GENERIC =
        "Array type using 'T[]' is forbidden. Use 'Array<T>' instead.";
    public static FAILURE_STRING_ARRAY_SIMPLE =
        "Array type using 'Array<T>' is forbidden for simple types. Use 'T[]' instead.";
    public static FAILURE_STRING_GENERIC_SIMPLE =
        "Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.ruleArguments[0] as Option);
    }
}

function walk(ctx: Lint.WalkContext<Option>): void {
    const { sourceFile, options: option } = ctx;
    return ts.forEachChild(sourceFile, function cb(node): void {
        switch (node.kind) {
            case ts.SyntaxKind.ArrayType:
                checkArrayType(node as ts.ArrayTypeNode);
                break;
            case ts.SyntaxKind.TypeReference:
                checkTypeReference(node as ts.TypeReferenceNode);
        }
        return ts.forEachChild(node, cb);
    });

    function checkArrayType(node: ts.ArrayTypeNode): void {
        const { elementType, parent } = node;
        if (option === "array" || (option === "array-simple" && isSimpleType(elementType))) {
            return;
        }

        const failureString =
            option === "generic" ? Rule.FAILURE_STRING_GENERIC : Rule.FAILURE_STRING_GENERIC_SIMPLE;
        const parens = elementType.kind === ts.SyntaxKind.ParenthesizedType ? 1 : 0;
        // Add a space if the type is preceded by 'as' and the node has no leading whitespace
        const space =
            parens === 0 &&
            parent.kind === ts.SyntaxKind.AsExpression &&
            node.getStart() === node.getFullStart();
        const fix = [
            new Lint.Replacement(elementType.getStart(), parens, `${space ? " " : ""}Array<`),
            // Delete the square brackets and replace with an angle bracket
            Lint.Replacement.replaceFromTo(elementType.getEnd() - parens, node.getEnd(), ">"),
        ];
        ctx.addFailureAtNode(node, failureString, fix);
    }

    function checkTypeReference(node: ts.TypeReferenceNode): void {
        const { typeName, typeArguments } = node;

        if (option === "generic" || !isArrayIdentifier(typeName)) {
            return;
        }

        const failureString =
            option === "array" ? Rule.FAILURE_STRING_ARRAY : Rule.FAILURE_STRING_ARRAY_SIMPLE;
        if (typeArguments === undefined || typeArguments.length === 0) {
            // Create an 'any' array
            ctx.addFailureAtNode(
                node,
                failureString,
                Lint.Replacement.replaceFromTo(node.getStart(), node.getEnd(), "any[]"),
            );
            return;
        }

        if (
            typeArguments.length !== 1 ||
            (option === "array-simple" && !isSimpleType(typeArguments[0]))
        ) {
            return;
        }

        const type = typeArguments[0];
        const parens = typeNeedsParentheses(type);
        ctx.addFailureAtNode(node, failureString, [
            // Delete 'Array<'
            Lint.Replacement.replaceFromTo(node.getStart(), type.getStart(), parens ? "(" : ""),
            // Delete '>' and replace with '[]
            Lint.Replacement.replaceFromTo(type.getEnd(), node.getEnd(), parens ? ")[]" : "[]"),
        ]);
    }
}

function typeNeedsParentheses(type: ts.TypeNode): boolean {
    switch (type.kind) {
        case ts.SyntaxKind.UnionType:
        case ts.SyntaxKind.FunctionType:
        case ts.SyntaxKind.IntersectionType:
        case ts.SyntaxKind.TypeOperator:
            return true;
        default:
            return false;
    }
}

function isArrayIdentifier(name: ts.EntityName) {
    return name.kind === ts.SyntaxKind.Identifier && name.text === "Array";
}

function isSimpleType(nodeType: ts.TypeNode): boolean {
    switch (nodeType.kind) {
        case ts.SyntaxKind.AnyKeyword:
        case ts.SyntaxKind.ArrayType:
        case ts.SyntaxKind.BooleanKeyword:
        case ts.SyntaxKind.NullKeyword:
        case ts.SyntaxKind.ObjectKeyword:
        case ts.SyntaxKind.UndefinedKeyword:
        case ts.SyntaxKind.NumberKeyword:
        case ts.SyntaxKind.StringKeyword:
        case ts.SyntaxKind.SymbolKeyword:
        case ts.SyntaxKind.VoidKeyword:
        case ts.SyntaxKind.NeverKeyword:
        case ts.SyntaxKind.ThisType:
        case ts.SyntaxKind.UnknownKeyword:
            return true;
        case ts.SyntaxKind.TypeReference:
            // TypeReferences must be non-generic or be another Array with a simple type
            const { typeName, typeArguments } = nodeType as ts.TypeReferenceNode;
            if (typeArguments === undefined) {
                return true;
            }
            switch (typeArguments.length) {
                case 0:
                    return true;
                case 1:
                    return (
                        typeName.kind === ts.SyntaxKind.Identifier &&
                        typeName.text === "Array" &&
                        isSimpleType(typeArguments[0])
                    );
                default:
                    return false;
            }
        default:
            return false;
    }
}
