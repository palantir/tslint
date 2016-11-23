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
import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unsafe-finally",
        description: Lint.Utils.dedent`
            Disallows control flow statements, such as \`return\`, \`continue\`,
            \`break\` and \`throws\` in finally blocks.`,
        descriptionDetails: "",
        rationale: Lint.Utils.dedent`
            When used inside \`finally\` blocks, control flow statements,
            such as \`return\`, \`continue\`, \`break\` and \`throws\`
            override any other control flow statements in the same try/catch scope.
            This is confusing and unexpected behavior.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_TYPE_BREAK = "break";
    public static FAILURE_TYPE_CONTINUE = "continue";
    public static FAILURE_TYPE_RETURN = "return";
    public static FAILURE_TYPE_THROW = "throw";
    public static FAILURE_STRING_FACTORY = (name: string) => {
        return `${name} statements in finally blocks are forbidden.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoReturnInFinallyScopeAwareWalker(sourceFile, this.getOptions()));
    }
}

/**
 * Represents details associated with tracking finally scope.
 */
interface IFinallyScope {
    /**
     * A value indicating whether the current scope is a `break` boundary.
     */
    isBreakBoundary: boolean;

    /**
     * A value indicating whether the current scope is a `continue` boundary.
     */
    isContinueBoundary: boolean;

    /**
     * A value indicating whether the current scope is within a finally block.
     */
    isFinallyBlock: boolean;

    /**
     * A value indication whether the current scope is a `return` and `throw` boundary.
     */
    isReturnsThrowsBoundary: boolean;

    /**
     * A collection of `break` or `continue` labels in this scope.
     */
    labels: string[];
}

/**
 * Represents a block walker that identifies finally blocks and walks
 * only the blocks that do not change scope for return statements.
 */
class NoReturnInFinallyScopeAwareWalker extends Lint.ScopeAwareRuleWalker<IFinallyScope> {

    protected visitBreakStatement(node: ts.BreakOrContinueStatement) {
        if (!this.isControlFlowWithinFinallyBlock(isBreakBoundary, node)) {
            super.visitBreakStatement(node);
            return;
        }

        this.addFailure(
            this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_FACTORY(Rule.FAILURE_TYPE_BREAK)));
    }

    protected visitContinueStatement(node: ts.BreakOrContinueStatement) {
        if (!this.isControlFlowWithinFinallyBlock(isContinueBoundary, node)) {
            super.visitContinueStatement(node);
            return;
        }

        this.addFailure(
            this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_FACTORY(Rule.FAILURE_TYPE_CONTINUE)));
    }

    protected visitLabeledStatement(node: ts.LabeledStatement) {
        this.getCurrentScope().labels.push(node.label.text);

        super.visitLabeledStatement(node);
    }

    protected visitReturnStatement(node: ts.ReturnStatement): void {
        if (!this.isControlFlowWithinFinallyBlock(isReturnsOrThrowsBoundary)) {
            super.visitReturnStatement(node);
            return;
        }

        this.addFailure(
            this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_FACTORY(Rule.FAILURE_TYPE_RETURN)));
    }

    protected visitThrowStatement(node: ts.ThrowStatement): void {
        if (!this.isControlFlowWithinFinallyBlock(isReturnsOrThrowsBoundary)) {
            super.visitThrowStatement(node);
            return;
        }

        this.addFailure(
            this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_FACTORY(Rule.FAILURE_TYPE_THROW)));
    }

    public createScope(node: ts.Node): IFinallyScope {
        const isScopeBoundary = super.isScopeBoundary(node);

        return {
            isBreakBoundary: isScopeBoundary || isLoopBlock(node) || isCaseBlock(node),
            isContinueBoundary: isScopeBoundary || isLoopBlock(node),
            isFinallyBlock: isFinallyBlock(node),
            isReturnsThrowsBoundary: isScopeBoundary,
            labels: [],
        };
    }

    protected isScopeBoundary(node: ts.Node): boolean {
        return super.isScopeBoundary(node) ||
                isFinallyBlock(node) ||
                isLoopBlock(node) ||
                isCaseBlock(node);
    }

    private isControlFlowWithinFinallyBlock<TNode>(
        isControlFlowBoundary: (scope: IFinallyScope, node?: TNode) => boolean, node?: TNode): boolean {
        const scopes = this.getAllScopes();

        let currentScope = this.getCurrentScope();
        let depth = this.getCurrentDepth();

        while (currentScope) {
            if (isControlFlowBoundary(currentScope, node)) {
                return false;
            }

            if (currentScope.isFinallyBlock) {
                return true;
            }

            currentScope = scopes[--depth];
        }
    }
}

function isLoopBlock(node: ts.Node): boolean {
    const parent = node.parent;

    return parent &&
        node.kind === ts.SyntaxKind.Block &&
        (parent.kind === ts.SyntaxKind.ForInStatement ||
        parent.kind === ts.SyntaxKind.ForOfStatement ||
        parent.kind === ts.SyntaxKind.ForStatement ||
        parent.kind === ts.SyntaxKind.WhileStatement ||
        parent.kind === ts.SyntaxKind.DoStatement);
}

function isCaseBlock(node: ts.Node): boolean {
    return node.kind === ts.SyntaxKind.CaseBlock;
}

function isFinallyBlock(node: ts.Node): boolean {
    const parent = node.parent;

    return parent &&
        node.kind === ts.SyntaxKind.Block &&
        isTryStatement(parent) &&
        parent.finallyBlock === node;
}

function isTryStatement(node: ts.Node): node is ts.TryStatement {
    return node.kind === ts.SyntaxKind.TryStatement;
}

function isReturnsOrThrowsBoundary(scope: IFinallyScope) {
    return scope.isReturnsThrowsBoundary;
}

function isContinueBoundary(scope: IFinallyScope, node: ts.ContinueStatement): boolean {
    return node.label ? scope.labels.indexOf(node.label.text) >= 0 : scope.isContinueBoundary;
}

function isBreakBoundary(scope: IFinallyScope, node: ts.BreakStatement): boolean {
    return node.label ? scope.labels.indexOf(node.label.text) >= 0 : scope.isBreakBoundary;
}
