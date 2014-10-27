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
    public static FAILURE_STRING = "access forbidden to arguments property";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoArgWalker(syntaxTree, this.getOptions()));
    }
  }

class NoArgWalker extends Lint.RuleWalker {
    public visitMemberAccessExpression(node: TypeScript.MemberAccessExpressionSyntax): void {
        var expression = node.expression;
        var name = node.name;
        var position = this.getPosition() + TypeScript.leadingTriviaWidth(node.expression);

        if (TypeScript.isToken(expression) && name.text() === "callee") {
            var tokenExpression = <TypeScript.ISyntaxToken> expression;
            if (tokenExpression.text() === "arguments") {
                this.addFailure(this.createFailure(position, TypeScript.width(expression), Rule.FAILURE_STRING));
            }
          }

        super.visitMemberAccessExpression(node);
    }
}
