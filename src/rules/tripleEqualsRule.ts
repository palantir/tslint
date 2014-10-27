/*
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

/// <reference path='../../lib/tslint.d.ts' />

var OPTION_ALLOW_NULL_CHECK = "allow-null-check";

export class Rule extends Lint.Rules.AbstractRule {
    public static EQ_FAILURE_STRING = "== should be ===";
    public static NEQ_FAILURE_STRING = "!= should be !==";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new ComparisonWalker(syntaxTree, this.getOptions()));
    }
}

class ComparisonWalker extends Lint.RuleWalker {
    public visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): void {
        var position = this.positionAfter(node.left);

        if (!this.isExpressionAllowed(node)) {
            this.handleOperatorToken(position, node.operatorToken);
        }
        super.visitBinaryExpression(node);
    }

    private isExpressionAllowed(node: TypeScript.BinaryExpressionSyntax): boolean {
        var nullKeyword = TypeScript.SyntaxKind.NullKeyword;

        if (this.hasOption(OPTION_ALLOW_NULL_CHECK) &&
            (node.left.kind() ===  nullKeyword || node.right.kind() === nullKeyword)) {
            return true;
        }

        return false;
    }

    private handleOperatorToken(position: number, operatorToken: TypeScript.ISyntaxToken) {
        var failure: Lint.RuleFailure = null;
        var operatorKind: TypeScript.SyntaxKind = operatorToken.kind();

        if (operatorKind === TypeScript.SyntaxKind.EqualsEqualsToken) {
            failure = this.createFailure(position, TypeScript.width(operatorToken), Rule.EQ_FAILURE_STRING);
        } else if (operatorKind === TypeScript.SyntaxKind.ExclamationEqualsToken) {
            failure = this.createFailure(position, TypeScript.width(operatorToken), Rule.NEQ_FAILURE_STRING);
        }

        if (failure) {
            this.addFailure(failure);
        }
    }
}
