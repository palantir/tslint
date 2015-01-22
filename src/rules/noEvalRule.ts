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

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "forbidden eval";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoEvalWalker(sourceFile, this.getOptions()));
    }
}

class NoEvalWalker extends Lint.RuleWalker {
    public visitCallExpression(node: ts.CallExpression): void {
        var expression = node.expression;
        if (expression.kind === ts.SyntaxKind.Identifier) {
            var expressionName = (<ts.Identifier> expression).text;
            if (expressionName === "eval") {
                this.addFailure(this.createFailure(expression.getStart(), expression.getWidth(), Rule.FAILURE_STRING));
            }
        }

        super.visitCallExpression(node);
    }
}
