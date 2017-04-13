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

import { getChildOfKind } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

interface Options {
    multiline?: "always" | "never";
    singleline?: "always" | "never";
}

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
            Both should be set to either \`"always"\` or \`"never"\`.

            * \`"multiline"\` checks multi-line object literals.
            * \`"singleline"\` checks single-line object literals.

            A array is considered "multiline" if its closing bracket is on a line
            after the last array element. The same general logic is followed for
            object literals, function typings, named import statements
            and function parameters.`,
        options: {
            type: "object",
            properties: {
                multiline: {
                    type: "string",
                    enum: ["always", "never"],
                },
                singleline: {
                    type: "string",
                    enum: ["always", "never"],
                },
            },
            additionalProperties: false,
        },
        optionExamples: [[true, {multiline: "always", singleline: "never"}]],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_NEVER = "Unnecessary trailing comma";
    public static FAILURE_STRING_ALWAYS = "Missing trailing comma";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new TrailingCommaWalker(sourceFile, this.ruleName, this.ruleArguments[0] as Options));
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
                case ts.SyntaxKind.ArrayBindingPattern:
                case ts.SyntaxKind.ObjectBindingPattern:
                case ts.SyntaxKind.NamedImports:
                case ts.SyntaxKind.NamedExports:
                    this.checkList((node as ts.ArrayLiteralExpression | ts.BindingPattern | ts.NamedImportsOrExports).elements,
                                   node.end);
                    break;
                case ts.SyntaxKind.ObjectLiteralExpression:
                    this.checkList((node as ts.ObjectLiteralExpression).properties, node.end);
                    break;
                case ts.SyntaxKind.EnumDeclaration:
                    this.checkList((node as ts.EnumDeclaration).members, node.end);
                    break;
                case ts.SyntaxKind.NewExpression:
                    if ((node as ts.NewExpression).arguments === undefined) {
                        break;
                    }
                    // falls through
                case ts.SyntaxKind.CallExpression:
                    this.checkList((node as ts.CallExpression | ts.NewExpression).arguments!, node.end);
                    break;
                case ts.SyntaxKind.ArrowFunction:
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
                    this.checkListWithEndToken(node, (node as ts.SignatureDeclaration).parameters, ts.SyntaxKind.CloseParenToken);
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
        return this.checkComma(hasTrailingComma, members, node.end);
    }

    private checkListWithEndToken(node: ts.Node, list: ts.NodeArray<ts.Node>, closeTokenKind: ts.SyntaxKind) {
        if (list.length === 0) {
            return;
        }
        const token = getChildOfKind(node, closeTokenKind, this.sourceFile);
        if (token !== undefined) {
            return this.checkComma(list.hasTrailingComma, list, token.end);
        }
    }

    private checkList(list: ts.NodeArray<ts.Node>, closeElementPos: number) {
        if (list.length === 0) {
            return;
        }
        return this.checkComma(list.hasTrailingComma, list, closeElementPos);
    }

    /* Expects `list.length !== 0` */
    private checkComma(hasTrailingComma: boolean | undefined, list: ts.NodeArray<ts.Node>, closeTokenPos: number) {
        const lastElementLine = ts.getLineAndCharacterOfPosition(this.sourceFile, list[list.length - 1].end).line;
        const closeTokenLine = ts.getLineAndCharacterOfPosition(this.sourceFile, closeTokenPos).line;
        const option = lastElementLine === closeTokenLine ? this.options.singleline : this.options.multiline;
        if (hasTrailingComma && option === "never") {
            this.addFailureAt(list.end - 1, 1, Rule.FAILURE_STRING_NEVER, Lint.Replacement.deleteText(list.end - 1, 1));
        } else if (!hasTrailingComma && option === "always") {
            this.addFailureAt(list.end, 0, Rule.FAILURE_STRING_ALWAYS, Lint.Replacement.appendText(list.end, ","));
        }
    }
}
