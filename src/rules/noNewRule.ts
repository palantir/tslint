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
import * as NoUnusedExpression from "./noUnusedExpressionRule";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "do not use 'new' for side effects";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoNewWalker(sourceFile, this.getOptions()));
    }
}

class NoNewWalker extends NoUnusedExpression.NoUnusedExpressionWalker {
    private expressionContainsNew: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.expressionContainsNew = false;
    }

    public visitExpressionStatement(node: ts.ExpressionStatement) {
        this.expressionContainsNew = false;
        super.visitExpressionStatement(node);
    }

    protected visitNewExpression(node: ts.NewExpression) {
        super.visitNewExpression(node);
        this.expressionIsUnused = true;
        this.expressionContainsNew = true;
    }

    protected checkExpressionUsage(node: ts.ExpressionStatement) {
        if (this.expressionIsUnused && this.expressionContainsNew) {
            const { expression } = node;
            const { kind } = expression;
            const isValidStandaloneExpression = kind === ts.SyntaxKind.DeleteExpression
                || kind === ts.SyntaxKind.YieldExpression
                || kind === ts.SyntaxKind.AwaitExpression;

            if (!isValidStandaloneExpression && !NoUnusedExpression.NoUnusedExpressionWalker.isDirective(node)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
    }
}
