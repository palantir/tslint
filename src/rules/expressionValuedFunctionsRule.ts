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

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "expression-valued-functions",
        description: "Suggests to convert `() => { return x; }` to `() => x`.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Arrow function body may be converted just this expression, with no `{ return ... }`.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {
    public visitArrowFunction(node: ts.FunctionLikeDeclaration) {
        if (node.body && node.body.kind === ts.SyntaxKind.Block) {
            const expr = getSimpleReturnExpression(node.body as ts.Block);
            if (expr !== undefined) {
                this.addFailureAtNode(expr, Rule.FAILURE_STRING, this.fix(node, node.body as ts.Block, expr));
            }
        }

        super.visitArrowFunction(node);
    }

    private fix(arrowFunction: ts.FunctionLikeDeclaration, body: ts.Block, expr: ts.Expression): Lint.Fix | undefined {
        const text = this.getSourceFile().text;
        const statement = expr.parent!;
        const arrow = Lint.childOfKind(arrowFunction, ts.SyntaxKind.EqualsGreaterThanToken)!;
        const openBrace = Lint.childOfKind(body, ts.SyntaxKind.OpenBraceToken)!;
        const closeBrace = Lint.childOfKind(body, ts.SyntaxKind.CloseBraceToken)!;
        const semicolon = Lint.childOfKind(statement, ts.SyntaxKind.SemicolonToken);

        const anyComments = hasComments(arrow.end, openBrace.getStart()) ||
            hasComments(statement.pos, statement.getStart()) ||
            hasComments(expr.pos, expr.getStart()) ||
            (semicolon
                ? hasComments(semicolon.pos, semicolon.getStart()) || hasComments(semicolon.end, closeBrace.getStart())
                : hasComments(expr.end, closeBrace.getStart()));
        return anyComments ? undefined : this.createFix([
            // " {"
            deleteFromTo(arrow.end, openBrace.end),
            // "return "
            deleteFromTo(statement.getStart(), expr.getStart()),
            // " }" (may include semicolon)
            deleteFromTo(expr.end, closeBrace.end),
        ]);

        function hasComments(start: number, end: number): boolean {
            return !isAllWhitespace(text, start, end);
        }
    }
}

/** Given `{ return x; }`, return `x`. */
function getSimpleReturnExpression(block: ts.Block): ts.Expression | undefined {
    return block.statements.length === 1 && block.statements[0].kind === ts.SyntaxKind.ReturnStatement
        ? (block.statements[0] as ts.ReturnStatement).expression
        : undefined;
}

function deleteFromTo(start: number, end: number): Lint.Replacement {
    return new Lint.Replacement(start, end - start, "");
}

function isAllWhitespace(text: string, start: number, end: number): boolean {
    for (let i = start; i < end; i++) {
        if (!ts.isWhiteSpace(text.charCodeAt(i))) {
            return false;
        }
    }
    return true;
}
