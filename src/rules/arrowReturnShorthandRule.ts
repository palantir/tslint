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

import * as ts from "typescript";

import * as Lint from "../index";

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
        optionExamples: [
            `[true]`,
            `[true, "${OPTION_MULTILINE}"]`,
        ],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "This arrow function body can be simplified by omitting the curly braces and the keyword 'return'.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {
    public visitArrowFunction(node: ts.ArrowFunction) {
        if (node.body && node.body.kind === ts.SyntaxKind.Block) {
            const expr = getSimpleReturnExpression(node.body as ts.Block);
            if (expr !== undefined && (this.hasOption(OPTION_MULTILINE) || !this.isMultiline(node.body))) {
                this.addFailureAtNode(node.body, Rule.FAILURE_STRING, this.createArrowFunctionFix(node, node.body as ts.Block, expr));
            }
        }

        super.visitArrowFunction(node);
    }

    private isMultiline(node: ts.Node): boolean {
        const getLine = (position: number) => this.getLineAndCharacterOfPosition(position).line;
        return getLine(node.getEnd()) > getLine(node.getStart());
    }

    private createArrowFunctionFix(arrowFunction: ts.FunctionLikeDeclaration, body: ts.Block, expr: ts.Expression): Lint.Fix | undefined {
        const text = this.getSourceFile().text;
        const statement = expr.parent!;
        const returnKeyword = Lint.childOfKind(statement, ts.SyntaxKind.ReturnKeyword)!;
        const arrow = Lint.childOfKind(arrowFunction, ts.SyntaxKind.EqualsGreaterThanToken)!;
        const openBrace = Lint.childOfKind(body, ts.SyntaxKind.OpenBraceToken)!;
        const closeBrace = Lint.childOfKind(body, ts.SyntaxKind.CloseBraceToken)!;
        const semicolon = Lint.childOfKind(statement, ts.SyntaxKind.SemicolonToken);

        const anyComments = hasComments(arrow) || hasComments(openBrace) || hasComments(statement) || hasComments(returnKeyword) ||
            hasComments(expr) || (semicolon && hasComments(semicolon)) || hasComments(closeBrace);
        return anyComments ? undefined : this.createFix(
            // Object literal must be wrapped in `()`
            ...(expr.kind === ts.SyntaxKind.ObjectLiteralExpression ? [
                this.appendText(expr.getStart(), "("),
                this.appendText(expr.getEnd(), ")"),
            ] : []),
            // " {"
            this.deleteFromTo(arrow.end, openBrace.end),
            // "return "
            this.deleteFromTo(statement.getStart(), expr.getStart()),
            // " }" (may include semicolon)
            this.deleteFromTo(expr.end, closeBrace.end),
        );

        function hasComments(node: ts.Node): boolean {
            return ts.getTrailingCommentRanges(text, node.getEnd()) !== undefined;
        }
    }
}

/** Given `{ return x; }`, return `x`. */
function getSimpleReturnExpression(block: ts.Block): ts.Expression | undefined {
    return block.statements.length === 1 && block.statements[0].kind === ts.SyntaxKind.ReturnStatement
        ? (block.statements[0] as ts.ReturnStatement).expression
        : undefined;
}
