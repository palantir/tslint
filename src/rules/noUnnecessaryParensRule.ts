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

import { isLiteralExpression, isParenthesizedExpression } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

interface Options {
    withChild?: string[];
    asChildOf?: string[];
    default?: boolean;
}

const syntaxKindMapping = ts.SyntaxKind as {} as { [k: string]: ts.SyntaxKind };

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unnecessary-parens",
        description: Lint.Utils.dedent`
            Warns when parentheses are used that are unnecessary`,
        options: {
            type: "object",
            properties: {
                withChild: {
                    type: "list",
                    listType: "string",
                },
                asChildOf: {
                    type: "list",
                    listType: "string",
                },
                default: { type: "boolean" },
            },
            additionalProperties: false,
        },
        optionsDescription: Lint.Utils.dedent`
            withChild: A list of token kinds around which to flag parentheses.
                For example, \`{"withChild": ["Identifier"]}\` would flag
                \`(foo)\` as having unnecessary parentheses around it.

            asChildOf: A list of token kinds and properties on those tokens
                such that if the parenthesized expression is the appropriate
                child of a token of that kind, it will be flagged. For example,
                \`{"asChildOf": ["VariableDeclaration.initializer"]}\` would
                flag the parentheses in \`let x = (1 + 2)\`, regardless of the
                kind of the parenthesized expression.

            default: Whether to default the set of bans to a set of hopefully
                uncontroversial bans picked by tslint.
            `,
        optionExamples: [
            [{
                withChild: [
                    "Identifier",
                    "LiteralExpression",
                ],
                asChildOf: [
                    "VariableDeclaration.initializer",
                    "ParenthesizedExpression.expression",
                    "CallExpression.arguments",
                    "ExpressionStatement.expression",
                ],
            }],
            [{ default: true }],
        ],
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(expressionTypeName: string) {
        return `Don't include unnecessary parentheses around ${expressionTypeName}`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.ruleArguments[0] as Options);
    }
}

function isNodeOfKind(node: ts.Node, kindName: string) {
    switch (kindName) {
        case "LiteralExpression":
            return isLiteralExpression(node);
        case "Keyword":
            return node.kind > ts.SyntaxKind.FirstKeyword && node.kind < ts.SyntaxKind.LastKeyword;
        default:
            return node.kind === syntaxKindMapping[kindName];
    }
}

function isParenthesizedType(node: ts.Node): node is ts.ParenthesizedTypeNode {
    return node.kind === ts.SyntaxKind.ParenthesizedType;
}

function walk(ctx: Lint.WalkContext<Options>) {
    if (ctx.options.withChild == undefined) {
        ctx.options.withChild = [];
    }
    if (ctx.options.asChildOf == undefined) {
        ctx.options.asChildOf = [];
    }
    const withChild = ctx.options.default ? [
        ...ctx.options.withChild,
        // ex: (foo).bar()
        "Identifier",
        // ex: ("abc") + "def"
        "LiteralExpression",
        // ex: let x: ('a') = 'a';
        "LiteralType",
        // ex: let x: (string) = 'b'; let x = (undefined);
        "Keyword",
        // ex: (new Foo())
        "NewExpression",
    ] : ctx.options.withChild;
    const asChildOf = ctx.options.default ? [
        // ex: let x = (1 + foo());
        "VariableDeclaration.initializer",
        // ex: type x = (string|number);
        "TypeAliasDeclaration.type",
        // ex: ((1 + 1)) + 2
        "ParenthesizedExpression.expression",
        // ex: foo((a), b)
        "CallExpression.arguments",
        // ex: Foo<(string|number), string>
        "TypeReference.typeArguments",
        // ex: (foo.bar());
        "ExpressionStatement.expression",
        // ex: function foo((a: string), b: number) {}
        "SignatureDeclaration.parameters",
        ...ctx.options.asChildOf,
    ] : ctx.options.asChildOf;

    const restrictions = withChild.map((name: string) => ({
        message: `an expression of type ${name}`,
        test(node: ts.ParenthesizedExpression | ts.ParenthesizedTypeNode) {
            return isNodeOfKind(isParenthesizedExpression(node) ? node.expression : node.type, name);
        },
    })).concat(
        asChildOf.map((name: string) => {
            const [parentKind, whichChild] = name.split(".");
            return {
                message: `the ${whichChild} child of an expression of type ${parentKind}`,
                test(node: ts.ParenthesizedExpression | ts.ParenthesizedTypeNode) {
                    if (node.parent == undefined) {
                        return false;
                    }
                    if (!isNodeOfKind(node.parent, parentKind)) {
                        return false;
                    }
                    const parentMapping = node.parent as {} as { [k: string]: ts.Node | ts.Node[] };
                    const childOrChildren = parentMapping[whichChild];
                    return Array.isArray(childOrChildren) ?
                        childOrChildren.indexOf(node) !== -1 :
                        childOrChildren === node;
                },
            };
        }));

    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isParenthesizedExpression(node) || isParenthesizedType(node)) {
            const restriction = restrictions.find((r) => r.test(node));
            if (restriction != undefined) {
                ctx.addFailureAtNode(
                    node,
                    Rule.FAILURE_STRING_FACTORY(restriction.message),
                    [
                        Lint.Replacement.deleteFromTo(node.getStart(), node.getStart() + 1),
                        Lint.Replacement.deleteFromTo(node.getEnd() - 1, node.getEnd()),
                    ]);
            }
        }
        return ts.forEachChild(node, cb);
    });
}
