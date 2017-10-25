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

import {
    isArrowFunction,
    isBinaryExpression,
    isExpressionStatement,
    isLiteralExpression,
    isNumericLiteral,
    isObjectLiteralExpression,
    isParenthesizedExpression,
    isPropertyAccessExpression,
    isReturnStatement,
    isSameLine,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

interface Options {
    withChild?: string[];
    asChildOf?: string[];
    exceptions?: string[];
    default?: boolean;
}

const syntaxKindMapping = ts.SyntaxKind as {} as { [k: string]: ts.SyntaxKind };

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "ban-parens",
        description: Lint.Utils.dedent`
            Warns when parentheses are used around or as a child of certain
            expression types. Tip: Use astexplorer.net with the TypeScript
            parser to determine the token types you want to ban parentheses
            around.`,
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
                exceptions: {
                    type: "list",
                    listType: "string",
                },
                default: { type: "boolean" },
            },
            additionalProperties: false,
        },
        optionsDescription: Lint.Utils.dedent`
            withChild: A list of token kinds around which to ban parentheses.
                For example, \`{"withChild": ["Identifier"]}\` would ban
                \`(foo)\`.

                Some token types shouldn't be used here, since the fixer (which)
                just removes the parens) would break the code. For example,
                BinaryExpression and ConditionalExpression both have many cases
                where removing the parens can break code.

            asChildOf: A list of token kinds and properties on those tokens
                such that if the parenthesized expression is the appropriate
                child of a token of that kind, it will be banned. For example,
                \`{"asChildOf": ["VariableDeclaration.initializer"]}\` would
                ban the parentheses in \`let x = (1 + 2)\`, regardless of the
                kind of the parenthesized expression.

            exceptions: A whitelist of types around which parens are never
                banned, even if they match one of the other rules.

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
                    "*.type",
                ],
            }],
            [{ default: true }],
        ],
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(expressionTypeName: string) {
        return `Don't include parentheses around ${expressionTypeName}`;
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
        case "*":
            return true;
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
    if (ctx.options.exceptions == undefined) {
        ctx.options.exceptions = [];
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
        // ex (options[0]).foo
        "ElementAccessExpression",
        // ex (x.a).b
        "PropertyAccessExpression",
        // ex (f());
        "CallExpression",
        // ex <button onclick={(x => foo(x))}/>
        "JsxExpression.expression",
    ] : ctx.options.withChild;
    const asChildOf = ctx.options.default ? [
        // ex: let x = (1 + foo());
        "VariableDeclaration.initializer",
        // ex: type x = (string|number);
        "TypeAliasDeclaration.type",
        // ex: ((1 + 1)) + 2
        "ParenthesizedExpression.expression",
        // ex: foo((a), b); new Foo((a));
        "CallExpression.arguments",
        "NewExpression.arguments",
        // ex: Foo<(a|b), c>; foo<(a)>();
        "*.typeArguments",
        // ex: (foo.bar());
        "ExpressionStatement.expression",
        // ex: let x: (string|number) = 3;
        "VariableDeclaration.type",
        // ex: function(foo: (number|string)) {}
        "*.type",
        // foo[(bar + "baz")]
        "ElementAccessExpression.argumentExpression",
        // `${(foo)}`
        "TemplateSpan.expression",
        ...ctx.options.asChildOf,
    ] : ctx.options.asChildOf;
    const exceptions = ctx.options.default ? [
        "JsxElement",
        "JsxFragment",
        ...ctx.options.exceptions,
    ] : ctx.options.exceptions;

    const restrictions = withChild.map((name: string) => ({
        message: `an expression of type ${name}`,
        test(node: ts.ParenthesizedExpression | ts.ParenthesizedTypeNode) {
            const child = isParenthesizedExpression(node) ? node.expression : node.type;
            if (exceptions.some((exception) => isNodeOfKind(child, exception))) {
                return false;
            }
            return isNodeOfKind(child, name);
        },
    })).concat(
        asChildOf.map((name: string) => {
            const [parentKind, whichChild] = name.split(".");
            return {
                message: `the ${whichChild} child of an expression${parentKind === "*" ? "" : ` of type ${parentKind}`}`,
                test(node: ts.ParenthesizedExpression | ts.ParenthesizedTypeNode) {
                    if (!isNodeOfKind(node.parent!, parentKind)) {
                        return false;
                    }
                    const child = isParenthesizedExpression(node) ? node.expression : node.type;
                    if (exceptions.some((exception) => isNodeOfKind(child, exception))) {
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
        if ((isParenthesizedExpression(node) && !parensAreNecessary(node, ctx.sourceFile)) || isParenthesizedType(node)) {
            const restriction = restrictions.find((r) => r.test(node));
            if (restriction != undefined) {
                let replacement = [
                    Lint.Replacement.deleteFromTo(node.getStart(), node.getStart() + 1),
                    Lint.Replacement.deleteFromTo(node.getEnd() - 1, node.getEnd()),
                ];
                const charBeforeParens = ctx.sourceFile.text[node.getStart() - 1];
                // Prevent correcting typeof(x) to typeofx, throw(err) to throwerr
                if (charBeforeParens.match(/\w/) !== null) {
                    replacement.push(Lint.Replacement.appendText(node.getStart(), " "));
                }
                // Don't suggest a fix for a (hopefully rare) pattern where
                // removing the parentheses would almost always be bad, e.g.
                // let x = (y = 1, z = 2);
                if (isParenthesizedExpression(node) &&
                    isBinaryExpression(node.expression) &&
                    node.expression.operatorToken.kind === ts.SyntaxKind.CommaToken) {
                    replacement = [];
                }
                ctx.addFailureAtNode(
                    node,
                    Rule.FAILURE_STRING_FACTORY(restriction.message),
                    replacement);
            }
        }
        return ts.forEachChild(node, cb);
    });
}

/**
 * Checks some exceptional cases where the parentheses likely are still required.
 */
function parensAreNecessary(node: ts.ParenthesizedExpression, sourceFile: ts.SourceFile) {
    return (
        // Don't flag `(0).foo()`, because `0.foo()` doesn't work.
        (isNumericLiteral(node.expression) &&
            isPropertyAccessExpression(node.parent!)) ||
        // Don't flag `return (\nfoo)`, since the parens are necessary.
        (isReturnStatement(node.parent!) &&
            !isSameLine(sourceFile, node.expression.pos, node.expression.getStart(sourceFile))) ||
        // Don't flag parens around destructuring assignment
        (isBinaryExpression(node.expression) &&
            node.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
            isObjectLiteralExpression(node.expression.left) &&
            isExpressionStatement(node.parent!)) ||
        // Don't flag parentheses in an arrow function's body
        isArrowFunction(node.parent!));
}
