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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { hasCommentAfterPosition } from "../language/utils";

import { codeExamples } from "./code-examples/arrowReturnShorthand.examples";

const OPTION_MULTILINE = "multiline";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "arrow-return-shorthand",
        description: "Suggests to convert `() => { return x; }` to `() => x`.",
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
            If \`${OPTION_MULTILINE}\` is specified, then this will warn even if the function spans multiple lines.`,
        options: {
            type: "string",
            enum: [OPTION_MULTILINE],
        },
        optionExamples: [true, [true, OPTION_MULTILINE]],
        rationale: Lint.Utils.dedent`
            It's unnecessary to include \`return\` and \`{}\` brackets in arrow lambdas.
            Leaving them out results in simpler and easier to read code.
        `,
        type: "style",
        typescriptOnly: false,
        codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(isObjectLiteral: boolean): string {
        const start =
            "This arrow function body can be simplified by omitting the curly braces and the keyword 'return'";
        return (
            start + (isObjectLiteral ? ", and wrapping the object literal in parentheses." : ".")
        );
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            multiline: this.ruleArguments.indexOf(OPTION_MULTILINE) !== -1,
        });
    }
}

interface Options {
    multiline: boolean;
}

function walk(ctx: Lint.WalkContext<Options>): void {
    const {
        sourceFile,
        options: { multiline },
    } = ctx;
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (utils.isArrowFunction(node) && utils.isBlock(node.body)) {
            const expr = getSimpleReturnExpression(node.body);
            if (
                expr !== undefined &&
                (multiline ||
                    utils.isSameLine(sourceFile, node.body.getStart(sourceFile), node.body.end))
            ) {
                const isObjectLiteral = expr.kind === ts.SyntaxKind.ObjectLiteralExpression;
                ctx.addFailureAtNode(
                    node.body,
                    Rule.FAILURE_STRING(isObjectLiteral),
                    createFix(node, node.body, expr, sourceFile.text),
                );
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function createFix(
    arrowFunction: ts.FunctionLikeDeclaration,
    body: ts.Block,
    expr: ts.Expression,
    text: string,
): Lint.Fix | undefined {
    const statement = expr.parent;
    const returnKeyword = utils.getChildOfKind(statement, ts.SyntaxKind.ReturnKeyword)!;
    const arrow = utils.getChildOfKind(arrowFunction, ts.SyntaxKind.EqualsGreaterThanToken)!;
    const openBrace = utils.getChildOfKind(body, ts.SyntaxKind.OpenBraceToken)!;
    const closeBrace = utils.getChildOfKind(body, ts.SyntaxKind.CloseBraceToken)!;
    const semicolon = utils.getChildOfKind(statement, ts.SyntaxKind.SemicolonToken);

    const anyComments =
        hasComments(arrow) ||
        hasComments(openBrace) ||
        hasComments(statement) ||
        hasComments(returnKeyword) ||
        hasComments(expr) ||
        (semicolon !== undefined && hasComments(semicolon)) ||
        hasComments(closeBrace);
    return anyComments
        ? undefined
        : [
              // Object literal must be wrapped in `()`
              ...(expr.kind === ts.SyntaxKind.ObjectLiteralExpression
                  ? [
                        Lint.Replacement.appendText(expr.getStart(), "("),
                        Lint.Replacement.appendText(expr.getEnd(), ")"),
                    ]
                  : []),
              // " {"
              Lint.Replacement.deleteFromTo(arrow.end, openBrace.end),
              // "return "
              Lint.Replacement.deleteFromTo(statement.getStart(), expr.getStart()),
              // " }" (may include semicolon)
              Lint.Replacement.deleteFromTo(expr.end, closeBrace.end),
          ];

    function hasComments(node: ts.Node): boolean {
        return hasCommentAfterPosition(text, node.getEnd());
    }
}

/** Given `{ return x; }`, return `x`. */
function getSimpleReturnExpression(block: ts.Block): ts.Expression | undefined {
    return block.statements.length === 1 &&
        block.statements[0].kind === ts.SyntaxKind.ReturnStatement
        ? (block.statements[0] as ts.ReturnStatement).expression
        : undefined;
}
