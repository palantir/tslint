/*
 * Copyright 2015 Palantir Technologies, Inc.
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
    public static FAILURE_STRING = "assignment in conditional: ";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const walker = new NoConditionalAssignmentWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(walker);
    }
}

class NoConditionalAssignmentWalker extends Lint.RuleWalker {
    private isInConditional = false;

    protected visitIfStatement(node: ts.IfStatement) {
        this.validateConditionalExpression(node.expression);
        super.visitIfStatement(node);
    }

    protected visitWhileStatement(node: ts.WhileStatement) {
        this.validateConditionalExpression(node.expression);
        super.visitWhileStatement(node);
    }

    protected visitDoStatement(node: ts.DoStatement) {
        this.validateConditionalExpression(node.expression);
        super.visitWhileStatement(node);
    }

    protected visitForStatement(node: ts.ForStatement) {
        if (node.condition != null) {
            this.validateConditionalExpression(node.condition);
        }
        super.visitForStatement(node);
    }

    protected visitBinaryExpression(expression: ts.BinaryExpression) {
        if (this.isInConditional) {
            this.checkForAssignment(expression);
        }
        super.visitBinaryExpression(expression);
    }

    private validateConditionalExpression(expression: ts.Expression) {
        this.isInConditional = true;
        if (expression.kind === ts.SyntaxKind.BinaryExpression) {
            // check for simple assignment in a conditional, like `if (a = 1) {`
            this.checkForAssignment(<ts.BinaryExpression> expression);
        }
        // walk the children of the conditional expression for nested assignments, like `if ((a = 1) && (b == 1)) {`
        this.walkChildren(expression);
        this.isInConditional = false;
    }

    private checkForAssignment(expression: ts.BinaryExpression) {
        if (this.isAssignmentToken(expression.operatorToken)) {
            this.addFailure(this.createFailure(expression.getStart(), expression.getWidth(), Rule.FAILURE_STRING));
        }
    }

    private isAssignmentToken(token: ts.Node) {
        return token.kind >= ts.SyntaxKind.FirstAssignment && token.kind <= ts.SyntaxKind.LastAssignment;
    }
}
