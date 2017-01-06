/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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
        optionExamples: [`[true, "${OPTION_ARRAY}"]`, `[true, "${OPTION_GENERIC}"]`, `[true, "${OPTION_ARRAY_SIMPLE}"]`],
        type: "style",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_ARRAY = "Array type using 'Array<T>' is forbidden. Use 'T[]' instead.";
    public static FAILURE_STRING_GENERIC = "Array type using 'T[]' is forbidden. Use 'Array<T>' instead.";
    public static FAILURE_STRING_ARRAY_SIMPLE = "Array type using 'Array<T>' is forbidden for simple types. Use 'T[]' instead.";
    public static FAILURE_STRING_GENERIC_SIMPLE = "Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const alignWalker = new ArrayTypeWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(alignWalker);
    }
}

class ArrayTypeWalker extends Lint.RuleWalker {
    public visitArrayType(node: ts.ArrayTypeNode) {
        const typeName = node.elementType;
        if (this.hasOption(OPTION_GENERIC) || this.hasOption(OPTION_ARRAY_SIMPLE) && !this.isSimpleType(typeName)) {
            const failureString = this.hasOption(OPTION_GENERIC) ? Rule.FAILURE_STRING_GENERIC : Rule.FAILURE_STRING_GENERIC_SIMPLE;
            const parens = typeName.kind === ts.SyntaxKind.ParenthesizedType ? 1 : 0;
            // Add a space if the type is preceded by 'as' and the node has no leading whitespace
            const space = !parens && node.parent!.kind === ts.SyntaxKind.AsExpression &&
                node.getStart() === node.getFullStart() ? " " : "";
            const fix = this.createFix(
                this.createReplacement(typeName.getStart(), parens, space + "Array<"),
                // Delete the square brackets and replace with an angle bracket
                this.createReplacement(typeName.getEnd() - parens, node.getEnd() - typeName.getEnd() + parens, ">"),
            );
            this.addFailureAtNode(node, failureString, fix);
        }

        super.visitArrayType(node);
    }

    public visitTypeReference(node: ts.TypeReferenceNode) {
        const typeName = node.typeName.getText();
        if (typeName === "Array" && (this.hasOption(OPTION_ARRAY) || this.hasOption(OPTION_ARRAY_SIMPLE))) {
            const failureString = this.hasOption(OPTION_ARRAY) ? Rule.FAILURE_STRING_ARRAY : Rule.FAILURE_STRING_ARRAY_SIMPLE;
            const typeArgs = node.typeArguments;
            if (!typeArgs || typeArgs.length === 0) {
                // Create an 'any' array
                const fix = this.createFix(this.createReplacement(node.getStart(), node.getWidth(), "any[]"));
                this.addFailureAtNode(node, failureString, fix);
            } else if (typeArgs && typeArgs.length === 1 && (!this.hasOption(OPTION_ARRAY_SIMPLE) || this.isSimpleType(typeArgs[0]))) {
                const type = typeArgs[0];
                const typeStart = type.getStart();
                const typeEnd = type.getEnd();
                const parens = type.kind === ts.SyntaxKind.UnionType ||
                    type.kind === ts.SyntaxKind.FunctionType || type.kind === ts.SyntaxKind.IntersectionType;
                const fix = this.createFix(
                    // Delete Array and the first angle bracket
                    this.createReplacement(node.getStart(), typeStart - node.getStart(), parens ? "(" : ""),
                    // Delete the last angle bracket and replace with square brackets
                    this.createReplacement(typeEnd, node.getEnd() - typeEnd, (parens ? ")" : "") + "[]"),
                );
                this.addFailureAtNode(node, failureString, fix);
            }
        }

        super.visitTypeReference(node);
    }

    private isSimpleType(nodeType: ts.TypeNode) {
        switch (nodeType.kind) {
            case ts.SyntaxKind.AnyKeyword:
            case ts.SyntaxKind.ArrayType:
            case ts.SyntaxKind.BooleanKeyword:
            case ts.SyntaxKind.NullKeyword:
            case ts.SyntaxKind.NumberKeyword:
            case ts.SyntaxKind.StringKeyword:
            case ts.SyntaxKind.SymbolKeyword:
            case ts.SyntaxKind.VoidKeyword:
                return true;
            case ts.SyntaxKind.TypeReference:
                // TypeReferences must be non-generic or be another Array with a simple type
                const node = nodeType as ts.TypeReferenceNode;
                const typeArgs = node.typeArguments;
                if (!typeArgs || typeArgs.length === 0 || node.typeName.getText() === "Array" && this.isSimpleType(typeArgs[0])) {
                    return true;
                } else {
                    return false;
                }
            default:
                return false;
        }
    }
}
