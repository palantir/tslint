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
    public static FAILURE_STRING = "unexpected label on statement";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new LabelPosWalker(sourceFile, this.getOptions()));
    }
}

class LabelPosWalker extends Lint.RuleWalker {
    private isValidLabel: boolean;

    public visitLabeledStatement(node: ts.LabeledStatement) {
        const statement = node.statement;
        if (statement.kind !== ts.SyntaxKind.DoStatement
                && statement.kind !== ts.SyntaxKind.ForStatement
                && statement.kind !== ts.SyntaxKind.ForInStatement
                && statement.kind !== ts.SyntaxKind.WhileStatement
                && statement.kind !== ts.SyntaxKind.SwitchStatement) {
            const failure = this.createFailure(node.label.getStart(), node.label.getWidth(), Rule.FAILURE_STRING);
            this.addFailure(failure);
        }
        super.visitLabeledStatement(node);
    }
}
