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
    public static FAILURE_STRING = "undefined label: '";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new LabelUndefinedWalker(syntaxTree, this.getOptions()));
    }
}

class LabelUndefinedWalker extends Lint.ScopeAwareRuleWalker<any> {
    public createScope(): any {
        return {};
    }

    public visitLabeledStatement(node: TypeScript.LabeledStatementSyntax): void {
        var label = node.identifier.text();
        var currentScope = this.getCurrentScope();

        currentScope[label] = true;
        super.visitLabeledStatement(node);
    }

    public visitBreakStatement(node: TypeScript.BreakStatementSyntax): void {
        var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
        this.validateLabelAt(node.identifier, position, TypeScript.width(node.breakKeyword));
        super.visitBreakStatement(node);
    }

    public visitContinueStatement(node: TypeScript.ContinueStatementSyntax): void {
        var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
        this.validateLabelAt(node.identifier, position, TypeScript.width(node.continueKeyword));
        super.visitContinueStatement(node);
    }

    private validateLabelAt(label: TypeScript.ISyntaxToken, position: number, width: number): void {
        var currentScope = this.getCurrentScope();

        if (label !== null && !currentScope[label.text()]) {
            var failureString = Rule.FAILURE_STRING + label.text() + "'";
            var failure = this.createFailure(position, width, failureString);
            this.addFailure(failure);
        }
    }
}
