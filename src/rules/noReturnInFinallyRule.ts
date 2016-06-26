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
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-return-in-finally",
        description: "Disallows return statements in finally blocks.",
        descriptionDetails: "",
        rationale: "Return statements inside finally blocks have confusing semantics.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "finally block contains return statement";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new FinallyBlockWalker(sourceFile, this.getOptions()));
    }
}

/**
 * Represents a block walker that identifies finally blocks and walks
 * only the blocks that do not change scope for return statements.
 */
class FinallyBlockWalker extends Lint.RuleWalker {
    private internalWalker: NoReturnInFinallyBlockWalker;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        this.internalWalker = new NoReturnInFinallyBlockWalker(sourceFile, options);
    }

    public getFailures(): Lint.RuleFailure[] {
        return this.internalWalker.getFailures();
    }

    protected visitTryStatement(node: ts.TryStatement) {
        if (!node.finallyBlock) {
            return;
        }

        ts.forEachChild(node, this.internalWalker.walk.bind(this.internalWalker));
    }
}

/**
 * Represents a block walker that only explores blocks that do not change scope
 * for return statements.
 */
class NoReturnInFinallyBlockWalker extends Lint.RuleWalker {
    protected visitReturnStatement(node: ts.ReturnStatement): void {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
    }

    protected visitNode(node: ts.Node) {
        if (!this.canBlockContainReturnInCurrentScope(node.kind)) {
            return;
        }

        super.visitNode(node);
    }

    private canBlockContainReturnInCurrentScope(kind: ts.SyntaxKind): boolean {
        return kind === ts.SyntaxKind.Block ||
            kind === ts.SyntaxKind.BreakStatement ||
            kind === ts.SyntaxKind.CaseClause ||
            kind === ts.SyntaxKind.CatchClause ||
            kind === ts.SyntaxKind.ConditionalExpression ||
            kind === ts.SyntaxKind.DefaultClause ||
            kind === ts.SyntaxKind.DoStatement ||
            kind === ts.SyntaxKind.ForStatement ||
            kind === ts.SyntaxKind.ForInStatement ||
            kind === ts.SyntaxKind.ForOfStatement ||
            kind === ts.SyntaxKind.IfStatement ||
            kind === ts.SyntaxKind.LabeledStatement ||
            kind === ts.SyntaxKind.ReturnStatement ||
            kind === ts.SyntaxKind.SwitchStatement ||
            kind === ts.SyntaxKind.TryStatement ||
            kind === ts.SyntaxKind.WhileStatement ||
            kind === ts.SyntaxKind.WithStatement;
    }
}
