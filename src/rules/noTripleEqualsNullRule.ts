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

const OPTION_ALLOW_NULL_CHECK = "no-triple-equals-null";

export class Rule extends Lint.Rules.AbstractRule {
    public static EQ_FAILURE_STRING = "Did you mean == null instead?";
    public static NEQ_FAILURE_STRING = "Did you mean != null instead?";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const noTripleEqualsNullWalker = new NoTripleEqualsNullWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(noTripleEqualsNullWalker);
    }
}

class NoTripleEqualsNullWalker extends Lint.RuleWalker {
    public visitBinaryExpression(node: ts.BinaryExpression) {
        if (!this.isExpressionAllowed(node)) {
            const position = node.getChildAt(1).getStart();
            const expressionWidth = node.right.getFullWidth() + 3;
            this.handleBinaryComparison(position, expressionWidth, node.operatorToken.kind, node.right.kind);
        }

        super.visitBinaryExpression(node);
    }

    private handleBinaryComparison(position: number, expressionWidth: number, operator: ts.SyntaxKind, right: ts.SyntaxKind) {
        switch (operator) {
            case ts.SyntaxKind.EqualsEqualsEqualsToken:
                if (right === ts.SyntaxKind.NullKeyword) {
                    this.addFailure(this.createFailure(position, expressionWidth, Rule.EQ_FAILURE_STRING));
                }
                break;
            case ts.SyntaxKind.ExclamationEqualsEqualsToken:
                if (right === ts.SyntaxKind.NullKeyword) {
                    this.addFailure(this.createFailure(position, expressionWidth, Rule.NEQ_FAILURE_STRING));
                }
                break;
            default:
                break;
        }
    }

    private isExpressionAllowed(node: ts.BinaryExpression) {
        const nullKeyword = ts.SyntaxKind.NullKeyword;

        return this.hasOption(OPTION_ALLOW_NULL_CHECK)
            && (node.left.kind ===  nullKeyword || node.right.kind === nullKeyword);
    }
}
