/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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

import { getChildOfKind, isReassignmentTarget, isSameLine } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

type OptionValue = "always" | "never" | "ignore";
type OptionName = "arrays" | "exports" | "functions" | "imports" | "objects" | "typeLiterals";
type CustomOptionValue = Record<OptionName, OptionValue>;
interface Options {
    multiline: CustomOptionValue;
    singleline: CustomOptionValue;
    specCompliant: boolean;
}

const defaultOptions: CustomOptionValue = fillOptions("ignore" as "ignore");

function fillOptions<T>(value: T): Record<OptionName, T> {
    return {
        arrays: value,
        exports: value,
        functions: value,
        imports: value,
        objects: value,
        typeLiterals: value,
    };
}

type OptionsJson = Partial<
    Record<"multiline" | "singleline", Partial<CustomOptionValue> | OptionValue> & {
        esSpecCompliant: boolean;
    }
>;
function normalizeOptions(options: OptionsJson): Options {
    return {
        multiline: normalize(options.multiline),
        singleline: normalize(options.singleline),
        specCompliant: !!options.esSpecCompliant,
    };
}
function normalize(value: OptionsJson["multiline"]): CustomOptionValue {
    return typeof value === "string" ? fillOptions(value) : { ...defaultOptions, ...value };
}

/* tslint:disable:object-literal-sort-keys */
const metadataOptionShape = {
    anyOf: [
        {
            type: "string",
            enum: ["always", "never"],
        },
        {
            type: "object",
            properties: fillOptions({
                type: "string",
                enum: ["always", "never", "ignore"],
            }),
        },
    ],
};
/* tslint:enable:object-literal-sort-keys */

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "trailing-comma",
        description: Lint.Utils.dedent`
            Requires or disallows trailing commas in array and object literals, destructuring assignments, function typings,
            named imports and exports and function parameters.`,
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
            One argument which is an object with the keys \`multiline\` and \`singleline\`.
            Both can be set to a string (\`"always"\` or \`"never"\`) or an object.

            The object can contain any of the following keys: \`"arrays"\`, \`"objects"\`, \`"functions"\`,
            \`"imports"\`, \`"exports"\`, and \`"typeLiterals"\`; each key can have one of the following
            values: \`"always"\`, \`"never"\`, and \`"ignore"\`. Any missing keys will default to \`"ignore"\`.

            * \`"multiline"\` checks multi-line object literals.
            * \`"singleline"\` checks single-line object literals.

            An array is considered "multiline" if its closing bracket is on a line
            after the last array element. The same general logic is followed for
            object literals, function typings, named import statements
            and function parameters.

            To align this rule with the ECMAScript specification that is implemented in modern JavaScript VMs,
            there is a third option \`esSpecCompliant\`. Set this option to \`true\` to disallow trailing comma on
            object and array rest and rest parameters.
        `,
        options: {
            type: "object",
            properties: {
                multiline: metadataOptionShape,
                singleline: metadataOptionShape,
                esSpecCompliant: { type: "boolean" },
            },
            additionalProperties: false,
        },
        optionExamples: [
            [true, { multiline: "always", singleline: "never" }],
            [
                true,
                {
                    multiline: {
                        objects: "always",
                        arrays: "always",
                        functions: "never",
                        typeLiterals: "ignore",
                    },
                    esSpecCompliant: true,
                },
            ],
        ],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_NEVER = "Unnecessary trailing comma";
    public static FAILURE_STRING_FORBIDDEN = "Forbidden trailing comma";
    public static FAILURE_STRING_ALWAYS = "Missing trailing comma";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = normalizeOptions(this.ruleArguments[0] as OptionsJson);
        return this.applyWithWalker(new TrailingCommaWalker(sourceFile, this.ruleName, options));
    }

    public isEnabled() {
        return super.isEnabled() && this.ruleArguments.length !== 0;
    }
}

class TrailingCommaWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            switch (node.kind) {
                case ts.SyntaxKind.ArrayLiteralExpression:
                    this.checkList(
                        (node as ts.ArrayLiteralExpression).elements,
                        node.end,
                        "arrays",
                        isArrayRest,
                    );
                    break;
                case ts.SyntaxKind.ArrayBindingPattern:
                    this.checkList(
                        (node as ts.BindingPattern).elements,
                        node.end,
                        "arrays",
                        isDestructuringRest,
                    );
                    break;
                case ts.SyntaxKind.ObjectBindingPattern:
                    this.checkList(
                        (node as ts.BindingPattern).elements,
                        node.end,
                        "objects",
                        isDestructuringRest,
                    );
                    break;
                case ts.SyntaxKind.NamedImports:
                    this.checkList((node as ts.NamedImports).elements, node.end, "imports", noRest);
                    break;
                case ts.SyntaxKind.NamedExports:
                    this.checkList((node as ts.NamedExports).elements, node.end, "exports", noRest);
                    break;
                case ts.SyntaxKind.ObjectLiteralExpression:
                    this.checkList(
                        (node as ts.ObjectLiteralExpression).properties,
                        node.end,
                        "objects",
                        isObjectRest,
                    );
                    break;
                case ts.SyntaxKind.EnumDeclaration:
                    this.checkList(
                        (node as ts.EnumDeclaration).members,
                        node.end,
                        "objects",
                        noRest,
                    );
                    break;
                case ts.SyntaxKind.NewExpression:
                    if ((node as ts.NewExpression).arguments === undefined) {
                        break;
                    }
                // falls through
                case ts.SyntaxKind.CallExpression:
                    this.checkList(
                        (node as ts.CallExpression | ts.NewExpression).arguments!,
                        node.end,
                        "functions",
                        noRest,
                    );
                    break;
                case ts.SyntaxKind.ArrowFunction:
                    // don't check arrow functions without parens around the parameter
                    if (
                        getChildOfKind(node, ts.SyntaxKind.OpenParenToken, this.sourceFile) ===
                        undefined
                    ) {
                        break;
                    }
                // falls through
                case ts.SyntaxKind.Constructor:
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.FunctionExpression:
                case ts.SyntaxKind.MethodDeclaration:
                case ts.SyntaxKind.SetAccessor:
                case ts.SyntaxKind.MethodSignature:
                case ts.SyntaxKind.ConstructSignature:
                case ts.SyntaxKind.ConstructorType:
                case ts.SyntaxKind.FunctionType:
                case ts.SyntaxKind.CallSignature:
                    const closingParen = getChildOfKind(
                        node,
                        ts.SyntaxKind.CloseParenToken,
                        this.sourceFile,
                    );
                    if (closingParen !== undefined) {
                        this.checkList(
                            (node as ts.SignatureDeclaration).parameters,
                            closingParen.end,
                            "functions",
                            isRestParameter,
                        );
                    }
                    break;
                case ts.SyntaxKind.TypeLiteral:
                    this.checkTypeLiteral(node as ts.TypeLiteralNode);
                    break;
                default:
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private checkTypeLiteral(node: ts.TypeLiteralNode) {
        const members = node.members;
        if (members.length === 0) {
            return;
        }
        const sourceText = this.sourceFile.text;
        for (const member of members) {
            // PropertySignature in TypeLiteral can end with semicolon or comma. If one ends with a semicolon don't check for trailing comma
            if (sourceText[member.end - 1] === ";") {
                return;
            }
        }
        // The trailing comma is part of the last member and therefore not present as hasTrailingComma on the NodeArray
        const hasTrailingComma = sourceText[members.end - 1] === ",";
        return this.checkComma(hasTrailingComma, members, node.end, "typeLiterals", noRest);
    }

    private checkList<T extends ts.Node>(
        list: ts.NodeArray<T>,
        closeElementPos: number,
        optionKey: OptionName,
        isRest: (n: T) => boolean,
    ) {
        if (list.length === 0) {
            return;
        }
        return this.checkComma(list.hasTrailingComma, list, closeElementPos, optionKey, isRest);
    }

    /* Expects `list.length !== 0` */
    private checkComma<T extends ts.Node>(
        hasTrailingComma: boolean | undefined,
        list: ts.NodeArray<T>,
        closeTokenPos: number,
        optionKey: OptionName,
        isRest: (node: T) => boolean,
    ) {
        const last = list[list.length - 1];
        if (this.options.specCompliant && isRest(last)) {
            if (hasTrailingComma) {
                this.addFailureAt(
                    list.end - 1,
                    1,
                    Rule.FAILURE_STRING_FORBIDDEN,
                    Lint.Replacement.deleteText(list.end - 1, 1),
                );
            }
            return;
        }

        const options = isSameLine(this.sourceFile, last.end, closeTokenPos)
            ? this.options.singleline
            : this.options.multiline;
        const option = options[optionKey];

        if (option === "always" && !hasTrailingComma) {
            this.addFailureAt(
                list.end,
                0,
                Rule.FAILURE_STRING_ALWAYS,
                Lint.Replacement.appendText(list.end, ","),
            );
        } else if (option === "never" && hasTrailingComma) {
            this.addFailureAt(
                list.end - 1,
                1,
                Rule.FAILURE_STRING_NEVER,
                Lint.Replacement.deleteText(list.end - 1, 1),
            );
        }
    }
}

function isRestParameter(node: ts.ParameterDeclaration) {
    return node.dotDotDotToken !== undefined;
}

function isDestructuringRest(node: ts.ArrayBindingElement) {
    return node.kind === ts.SyntaxKind.BindingElement && node.dotDotDotToken !== undefined;
}

function isObjectRest(node: ts.ObjectLiteralElementLike) {
    return node.kind === ts.SyntaxKind.SpreadAssignment && isReassignmentTarget(node.expression);
}

function isArrayRest(node: ts.Expression) {
    return node.kind === ts.SyntaxKind.SpreadElement && isReassignmentTarget(node);
}

function noRest() {
    return false;
}
