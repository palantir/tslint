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

import * as ts from "typescript";
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unreachable",
        description: "Disallows unreachable code after `break`, `catch`, `throw`, and `return` statements.",
        rationale: "Unreachable code is often indication of a logic error.",
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "unreachable code";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnreachableWalker(sourceFile, this.getOptions()));
    }
}

class NoUnreachableWalker extends Lint.RuleWalker {
    private hasReturned: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.hasReturned = false;
    }

    public visitNode(node: ts.Node) {
        const previousReturned = this.hasReturned;
        // function declarations and type alias declarations can be hoisted
        // -- so set hasReturned to false until we're done with the function
        if (node.kind === ts.SyntaxKind.FunctionDeclaration || node.kind === ts.SyntaxKind.TypeAliasDeclaration) {
            this.hasReturned = false;
        }

        if (this.hasReturned) {
            this.hasReturned = false;
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }

        super.visitNode(node);

        // if there is further code after the hoisted function and we returned before that code is unreachable
        // so reset hasReturned to its previous state to check for that
        if (node.kind === ts.SyntaxKind.FunctionDeclaration || node.kind === ts.SyntaxKind.TypeAliasDeclaration) {
            this.hasReturned = previousReturned;
        }
    }

    public visitBlock(node: ts.Block) {
        super.visitBlock(node);
        this.hasReturned = false;
    }

    public visitCaseClause(node: ts.CaseClause) {
        super.visitCaseClause(node);
        this.hasReturned = false;
    }

    public visitDefaultClause(node: ts.DefaultClause) {
        super.visitDefaultClause(node);
        this.hasReturned = false;
    }

    public visitIfStatement(node: ts.IfStatement) {
        this.visitNode(node.expression);
        this.visitNode(node.thenStatement);
        this.hasReturned = false;
        if (node.elseStatement != null) {
            this.visitNode(node.elseStatement);
            this.hasReturned = false;
        }
    }

    public visitBreakStatement(node: ts.BreakOrContinueStatement) {
        super.visitBreakStatement(node);
        this.hasReturned = true;
    }

    public visitContinueStatement(node: ts.BreakOrContinueStatement) {
        super.visitContinueStatement(node);
        this.hasReturned = true;
    }

    public visitReturnStatement(node: ts.ReturnStatement) {
        super.visitReturnStatement(node);
        this.hasReturned = true;
    }

    public visitThrowStatement(node: ts.ThrowStatement) {
        super.visitThrowStatement(node);
        this.hasReturned = true;
    }
}
