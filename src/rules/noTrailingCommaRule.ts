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

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "trailing comma";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoTrailingCommaWalker(syntaxTree, this.getOptions()));
    }
}

class NoTrailingCommaWalker extends Lint.RuleWalker {
    public visitObjectLiteralExpression(node: TypeScript.ObjectLiteralExpressionSyntax): void {
        var propertyAssignments = node.propertyAssignments;
        var lastPosition = this.positionAfter(node.openBraceToken, propertyAssignments);
        lastPosition -= TypeScript.trailingTriviaWidth(propertyAssignments) + 1;

        if (propertyAssignments.separatorCount() === propertyAssignments.length
            && propertyAssignments.length > 0) {

            this.addFailure(this.createFailure(lastPosition, 1, Rule.FAILURE_STRING));
        }
        super.visitObjectLiteralExpression(node);
    }
}
