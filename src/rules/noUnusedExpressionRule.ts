/**
 * @license
 * Copyright 2014 Palantir Technologies, Inc.
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

import * as Lint from "../lint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unused-expression",
        description: "Disallows unused expression statements.",
        descriptionDetails: Lint.Utils.dedent`
            Unused expressions are expression statements which are not assignments or function calls
            (and thus usually no-ops).`,
        rationale: Lint.Utils.dedent`
            Detects potential errors where an assignment or function call was intended. Also detects constructs such as
            \`new SomeClass()\`, where a constructor is used solely for its side effects, which is considered poor style.`,
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "expected an assignment or function call";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnusedExpressionWalker(sourceFile, this.getOptions()));
    }
}

class NoUnusedExpressionWalker extends Lint.RuleWalker {
    private expressionIsUnused: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.expressionIsUnused = true;
    }

    public visitExpressionStatement(node: ts.ExpressionStatement) {
        this.expressionIsUnused = true;
        super.visitExpressionStatement(node);
        if (this.expressionIsUnused) {
            const { expression } = node;
            const { kind } = expression;
            const isValidStandaloneExpression = kind === ts.SyntaxKind.DeleteExpression
                || kind === ts.SyntaxKind.YieldExpression
                || kind === ts.SyntaxKind.AwaitExpression;

            if (!isValidStandaloneExpression && !isDirective(node)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
    }

    public visitBinaryExpression(node: ts.BinaryExpression) {
        super.visitBinaryExpression(node);
        switch (node.operatorToken.kind) {
            case ts.SyntaxKind.EqualsToken:
            case ts.SyntaxKind.PlusEqualsToken:
            case ts.SyntaxKind.MinusEqualsToken:
            case ts.SyntaxKind.AsteriskEqualsToken:
            case ts.SyntaxKind.SlashEqualsToken:
            case ts.SyntaxKind.PercentEqualsToken:
            case ts.SyntaxKind.AmpersandEqualsToken:
            case ts.SyntaxKind.CaretEqualsToken:
            case ts.SyntaxKind.BarEqualsToken:
            case ts.SyntaxKind.LessThanLessThanEqualsToken:
            case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken:
            case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
                this.expressionIsUnused = false;
                break;
            default:
                this.expressionIsUnused = true;
        }
    }

    public visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression) {
        super.visitPrefixUnaryExpression(node);
        switch (node.operator) {
            case ts.SyntaxKind.PlusPlusToken:
            case ts.SyntaxKind.MinusMinusToken:
                this.expressionIsUnused = false;
                break;
            default:
                this.expressionIsUnused = true;
        }
    }

    public visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression) {
        super.visitPostfixUnaryExpression(node);
        this.expressionIsUnused = false; // the only kinds of postfix expressions are postincrement and postdecrement
    }

    public visitBlock(node: ts.Block) {
        super.visitBlock(node);
        this.expressionIsUnused = true;
    }

    public visitArrowFunction(node: ts.FunctionLikeDeclaration) {
        super.visitArrowFunction(node);
        this.expressionIsUnused = true;
    }

    public visitCallExpression(node: ts.CallExpression) {
        super.visitCallExpression(node);
        this.expressionIsUnused = false;
    }

    public visitConditionalExpression(node: ts.ConditionalExpression) {
        this.visitNode(node.condition);
        this.expressionIsUnused = true;
        this.visitNode(node.whenTrue);
        const firstExpressionIsUnused = this.expressionIsUnused;
        this.expressionIsUnused = true;
        this.visitNode(node.whenFalse);
        const secondExpressionIsUnused = this.expressionIsUnused;
        // if either expression is unused, then that expression's branch is a no-op unless it's
        // being assigned to something or passed to a function, so consider the entire expression unused
        this.expressionIsUnused = firstExpressionIsUnused || secondExpressionIsUnused;
    }
}

function isDirective(node: ts.Node, checkPreviousSiblings = true): boolean {
    const { parent } = node;
    const grandParentKind = parent.parent == null ? null : parent.parent.kind;
    const isStringExpression = node.kind === ts.SyntaxKind.ExpressionStatement
        && (node as ts.ExpressionStatement).expression.kind === ts.SyntaxKind.StringLiteral;
    const parentIsSourceFile = parent.kind === ts.SyntaxKind.SourceFile;
    const parentIsNSBody = parent.kind === ts.SyntaxKind.ModuleBlock;
    const parentIsFunctionBody = parent.kind === ts.SyntaxKind.Block && [
        ts.SyntaxKind.ArrowFunction,
        ts.SyntaxKind.FunctionExpression,
        ts.SyntaxKind.FunctionDeclaration,
        ts.SyntaxKind.MethodDeclaration,
        ts.SyntaxKind.Constructor,
        ts.SyntaxKind.GetAccessor,
        ts.SyntaxKind.SetAccessor,
    ].indexOf(grandParentKind) > -1;

    if (!(parentIsSourceFile || parentIsFunctionBody || parentIsNSBody) || !isStringExpression) {
        return false;
    }

    if (checkPreviousSiblings) {
        const siblings: ts.Node[] = [];
        ts.forEachChild(node.parent, child => { siblings.push(child); });
        return siblings.slice(0, siblings.indexOf(node)).every((n) => isDirective(n, false));
    } else {
        return true;
    }
}
