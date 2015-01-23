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
    public static FAILURE_STRING = "trailing comma";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoTrailingCommaWalker(sourceFile, this.getOptions()));
    }
}

class NoTrailingCommaWalker extends Lint.RuleWalker {
    public visitObjectLiteralExpression(node: ts.ObjectLiteralExpression): void {
        var child = node.getChildAt(1);
        if (child != null && child.kind === ts.SyntaxKind.SyntaxList) {
            var grandChildren = child.getChildren();
            if (grandChildren.length > 0) {
                var lastGrandChild = grandChildren[grandChildren.length - 1];

                if (lastGrandChild.kind === ts.SyntaxKind.CommaToken) {
                    this.addFailure(this.createFailure(lastGrandChild.getStart(), 1, Rule.FAILURE_STRING));
                }
            }
        }
        super.visitObjectLiteralExpression(node);
    }
}
