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

import {
    forEachComment,
    isCallExpression,
    isElementAccessExpression,
    isIdentifier,
    isSameLine } from "tsutils";
import * as Lint from "../index";
import { isNegativeNumberLiteral } from "../language/utils";

interface Options {
    allowedNumbers: number[] | Set<string>;
    allowElementAccess: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-magic-numbers",
        description: Lint.Utils.dedent`
            Disallows the use constant number values outside of variable assignments.
            When no list of allowed values is specified, -1, 0 and 1 are allowed by default.`,
        rationale: Lint.Utils.dedent`
            Magic numbers should be avoided as they often lack documentation, forcing
            them to be stored in variables gives them implicit documentation.`,
        optionsDescription: Lint.Utils.dedent`
            An optional config object may be provided with one or both of the following properties:
                * \`"ignore-element-access": boolean\`
                    * Ignores cases such as \`argv[4]\`
                * \`"allowed-numbers": number[]\`
                    * List of numbers the rule should ignore
            `,
        options: {
            type: "object",
            properties: {
                "allowed-numbers": {
                    type: "array",
                    items: {
                        type: "number",
                    },
                    minLength: 1,
                },
                "allow-element-access": {
                    type: "boolean",
                },
            },
        },
        optionExamples: [true, [true, 1, 2, 3], [true, {
            "allow-element-access": true,
            "allowed-numbers": [4, 5, 6],
        }]],
        type: "typescript",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "'magic numbers' are not allowed";

    public static ALLOWED_NODES = new Set<ts.SyntaxKind>([
        ts.SyntaxKind.ExportAssignment,
        ts.SyntaxKind.FirstAssignment,
        ts.SyntaxKind.LastAssignment,
        ts.SyntaxKind.PropertyAssignment,
        ts.SyntaxKind.ShorthandPropertyAssignment,
        ts.SyntaxKind.VariableDeclaration,
        ts.SyntaxKind.VariableDeclarationList,
        ts.SyntaxKind.EnumMember,
        ts.SyntaxKind.PropertyDeclaration,
        ts.SyntaxKind.Parameter,
    ]);

    public static DEFAULT_ALLOWED = [ -1, 0, 1 ];

    /* tslint:disable no-unsafe-any */
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new NoMagicNumbersWalker(
                sourceFile, this.ruleName,
                this.parseOptions(this.ruleArguments[0]),
            ),
        );
    }

    private parseOptions(args: any): Options {
        /* For legacy config support */
        if (args !== undefined && args.length && typeof args[0] === "number") {
            return {
                allowElementAccess: false,
                allowedNumbers: new Set((args as number[]).map(String)),
            };
        }

        const options: Options =
            args !== undefined
                ? {
                    allowElementAccess:
                        typeof (args as {[key: string]: boolean})["allow-element-access"] === "boolean"
                            ? args["allow-element-access"]
                            : false,
                    allowedNumbers:
                        (args as {[key: string]: Set<string>})["allowed-numbers"] !== undefined
                            ? args["allowed-numbers"]
                            : Rule.DEFAULT_ALLOWED,
                }
                : {
                    allowElementAccess: false,
                    allowedNumbers: Rule.DEFAULT_ALLOWED,
                };
        options.allowedNumbers =
            new Set((options.allowedNumbers as number[]).map(String));

        return options;
    }
    /* tslint:enable no-unsafe-any */
}

class NoMagicNumbersWalker extends Lint.AbstractWalker<Options> {
    /**
     * Used for checking when a magic number is on the same line as
     * a comment. In such a case, the magic number should be ignored.
     */
    private readonly commentPositions: number[] = [];

    private generateCommentPositions(): void {
        for (const statement of this.sourceFile.statements) {
            forEachComment(
                statement,
                (_fullText: string, comment: ts.CommentRange) => {
                    this.commentPositions.push(comment.pos);
                },
                this.sourceFile,
            );
        }
    }

    /* tslint:disable-next-line: member-ordering */
    public walk(sourceFile: ts.SourceFile) {
        this.generateCommentPositions();
        const cb = (node: ts.Node): void => {
            if (
                this.commentPositions.some(
                    (pos: number) => isSameLine(this.sourceFile, node.pos, pos),
                )
            ) {
                /* This node is documented so let's ignore it */
                return;
            }
            if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === "parseInt") {
                return node.arguments.length === 0 ? undefined : cb(node.arguments[0]);
            }

            if (node.kind === ts.SyntaxKind.NumericLiteral) {
                return this.checkNumericLiteral(node, (node as ts.NumericLiteral).text);
            }
            if (isNegativeNumberLiteral(node)) {
                return this.checkNumericLiteral(node, `-${(node.operand as ts.NumericLiteral).text}`);
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private checkNumericLiteral(node: ts.Node, num: string) {
        if (
            /* "allow-element-access" logic */
            !(
                node.parent !== undefined &&
                isElementAccessExpression(node.parent) &&
                this.options.allowElementAccess
            ) &&
            !Rule.ALLOWED_NODES.has(node.parent!.kind) &&
            !(this.options.allowedNumbers as Set<string>).has(num)
        ) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
    }
}
