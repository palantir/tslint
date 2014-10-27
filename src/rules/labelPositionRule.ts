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
    public static FAILURE_STRING = "unexpected label on statement";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new LabelPosWalker(syntaxTree, this.getOptions()));
    }
}

class LabelPosWalker extends Lint.RuleWalker {
    private isValidLabel: boolean;

    public visitLabeledStatement(node: TypeScript.LabeledStatementSyntax): void {
        var width = TypeScript.width(node.identifier);
        var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);

        // set the validity flag to false, visit the labeled statement,
        // and check whether the flag is still set to false.
        this.isValidLabel = false;
        super.visitLabeledStatement(node);
        if (!this.isValidLabel) {
            var failure = this.createFailure(position, width, Rule.FAILURE_STRING);
            this.addFailure(failure);
        }
    }

    public visitDoStatement(node: TypeScript.DoStatementSyntax): void {
        this.isValidLabel = true;
        super.visitDoStatement(node);
    }

    public visitForStatement(node: TypeScript.ForStatementSyntax): void {
        this.isValidLabel = true;
        super.visitForStatement(node);
    }

    public visitForInStatement(node: TypeScript.ForInStatementSyntax): void {
        this.isValidLabel = true;
        super.visitForInStatement(node);
    }

    public visitWhileStatement(node: TypeScript.WhileStatementSyntax): void {
        this.isValidLabel = true;
        super.visitWhileStatement(node);
    }

    public visitSwitchStatement(node: TypeScript.SwitchStatementSyntax): void {
        this.isValidLabel = true;
        super.visitSwitchStatement(node);
    }
}
