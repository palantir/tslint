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

import { getNextToken, isBlockLike } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_STATEMENTS = "statements";
const OPTION_MEMBERS = "members";
const OPTION_ELEMENTS = "elements";
const OPTION_PARAMETERS = "parameters";
const OPTION_ARGUMENTS = "arguments";

interface Options {
    statements: boolean;
    parameters: boolean;
    arguments: boolean;
    members: boolean;
    elements: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "align",
        description: "Enforces vertical alignment.",
        hasFix: true,
        rationale: Lint.Utils.dedent`
            Helps maintain a readable, consistent style in your codebase.

            Consistent alignment for code statements helps keep code readable and clear.
            Statements misaligned from the standard can be harder to read and understand.`,
        optionsDescription: Lint.Utils.dedent`
            Five arguments may be optionally provided:

            * \`"${OPTION_PARAMETERS}"\` checks alignment of function parameters.
            * \`"${OPTION_ARGUMENTS}"\` checks alignment of function call arguments.
            * \`"${OPTION_STATEMENTS}"\` checks alignment of statements.
            * \`"${OPTION_MEMBERS}"\` checks alignment of members of classes, interfaces, type literal, object literals and
            object destructuring.
            * \`"${OPTION_ELEMENTS}"\` checks alignment of elements of array iterals, array destructuring and tuple types.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    OPTION_ARGUMENTS,
                    OPTION_ELEMENTS,
                    OPTION_MEMBERS,
                    OPTION_PARAMETERS,
                    OPTION_STATEMENTS
                ]
            },
            minLength: 1,
            maxLength: 5
        },
        optionExamples: [[true, "parameters", "statements"]],
        type: "style",
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_SUFFIX = " are not aligned";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new AlignWalker(sourceFile, this.ruleName, {
                arguments: this.ruleArguments.indexOf(OPTION_ARGUMENTS) !== -1,
                elements: this.ruleArguments.indexOf(OPTION_ELEMENTS) !== -1,
                members: this.ruleArguments.indexOf(OPTION_MEMBERS) !== -1,
                parameters: this.ruleArguments.indexOf(OPTION_PARAMETERS) !== -1,
                statements: this.ruleArguments.indexOf(OPTION_STATEMENTS) !== -1
            })
        );
    }
}

class AlignWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (this.options.statements && isBlockLike(node)) {
                this.checkAlignment(
                    node.statements.filter(s => s.kind !== ts.SyntaxKind.EmptyStatement),
                    OPTION_STATEMENTS
                );
            } else {
                switch (node.kind) {
                    case ts.SyntaxKind.NewExpression:
                        if ((node as ts.NewExpression).arguments === undefined) {
                            break;
                        }
                    // falls through
                    case ts.SyntaxKind.CallExpression:
                        if (this.options.arguments) {
                            this.checkAlignment(
                                (node as ts.CallExpression | ts.NewExpression).arguments!,
                                OPTION_ARGUMENTS
                            );
                        }
                        break;
                    case ts.SyntaxKind.FunctionDeclaration:
                    case ts.SyntaxKind.FunctionExpression:
                    case ts.SyntaxKind.Constructor:
                    case ts.SyntaxKind.MethodDeclaration:
                    case ts.SyntaxKind.ArrowFunction:
                    case ts.SyntaxKind.CallSignature:
                    case ts.SyntaxKind.ConstructSignature:
                    case ts.SyntaxKind.MethodSignature:
                    case ts.SyntaxKind.FunctionType:
                    case ts.SyntaxKind.ConstructorType:
                        if (this.options.parameters) {
                            this.checkAlignment(
                                (node as ts.SignatureDeclaration).parameters,
                                OPTION_PARAMETERS
                            );
                        }
                        break;
                    case ts.SyntaxKind.ArrayLiteralExpression:
                    case ts.SyntaxKind.ArrayBindingPattern:
                        if (this.options.elements) {
                            this.checkAlignment(
                                (node as ts.ArrayBindingOrAssignmentPattern).elements,
                                OPTION_ELEMENTS
                            );
                        }
                        break;
                    case ts.SyntaxKind.TupleType:
                        if (this.options.elements) {
                            this.checkAlignment(
                                (node as ts.TupleTypeNode).elementTypes,
                                OPTION_ELEMENTS
                            );
                        }
                        break;
                    case ts.SyntaxKind.ObjectLiteralExpression:
                        if (this.options.members) {
                            this.checkAlignment(
                                (node as ts.ObjectLiteralExpression).properties,
                                OPTION_MEMBERS
                            );
                        }
                        break;
                    case ts.SyntaxKind.ObjectBindingPattern:
                        if (this.options.members) {
                            this.checkAlignment(
                                (node as ts.ObjectBindingPattern).elements,
                                OPTION_MEMBERS
                            );
                        }
                        break;
                    case ts.SyntaxKind.ClassDeclaration:
                    case ts.SyntaxKind.ClassExpression:
                        if (this.options.members) {
                            this.checkAlignment(
                                (node as ts.ClassLikeDeclaration).members.filter(
                                    m => m.kind !== ts.SyntaxKind.SemicolonClassElement
                                ),
                                OPTION_MEMBERS
                            );
                        }
                        break;
                    case ts.SyntaxKind.InterfaceDeclaration:
                    case ts.SyntaxKind.TypeLiteral:
                        if (this.options.members) {
                            this.checkAlignment(
                                (node as ts.InterfaceDeclaration | ts.TypeLiteralNode).members,
                                OPTION_MEMBERS
                            );
                        }
                }
            }
            return ts.forEachChild(node, cb);
        };
        return cb(sourceFile);
    }

    private checkAlignment(nodes: ReadonlyArray<ts.Node>, kind: string) {
        if (nodes.length <= 1) {
            return;
        }
        const sourceFile = this.sourceFile;

        let pos = getLineAndCharacterWithoutBom(sourceFile, this.getStart(nodes[0]));
        const alignToColumn = pos.character;
        let line = pos.line;

        // skip first node in list
        for (let i = 1; i < nodes.length; ++i) {
            const node = nodes[i];
            const start = this.getStart(node);
            pos = ts.getLineAndCharacterOfPosition(sourceFile, start);
            if (line !== pos.line && pos.character !== alignToColumn) {
                const diff = alignToColumn - pos.character;
                let fix: Lint.Fix | undefined;
                if (diff >= 0) {
                    fix = Lint.Replacement.appendText(start, " ".repeat(diff));
                } else if (
                    node.pos <= start + diff &&
                    /^\s+$/.test(sourceFile.text.substring(start + diff, start))
                ) {
                    // only delete text if there is only whitespace
                    fix = Lint.Replacement.deleteText(start + diff, -diff);
                }
                this.addFailure(
                    start,
                    Math.max(node.end, start),
                    kind + Rule.FAILURE_STRING_SUFFIX,
                    fix
                );
            }
            line = pos.line;
        }
    }

    private getStart(node: ts.Node) {
        return node.kind !== ts.SyntaxKind.OmittedExpression
            ? node.getStart(this.sourceFile)
            : // find the comma token following the OmmitedExpression
              getNextToken(node, this.sourceFile)!.getStart(this.sourceFile);
    }
}

function getLineAndCharacterWithoutBom(
    sourceFile: ts.SourceFile,
    pos: number
): ts.LineAndCharacter {
    const result = ts.getLineAndCharacterOfPosition(sourceFile, pos);
    if (result.line === 0 && sourceFile.text[0] === "\uFEFF") {
        result.character -= 1;
    }
    return result;
}
