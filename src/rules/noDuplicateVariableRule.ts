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
    public static FAILURE_STRING = "duplicate variable: '";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDuplicateVariableWalker(syntaxTree, this.getOptions()));
    }
}

class NoDuplicateVariableWalker extends Lint.ScopeAwareRuleWalker<ScopeInfo> {
    public createScope(): ScopeInfo {
        return new ScopeInfo();
    }

    public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
        var propertyName = node.propertyName,
            variableName = propertyName.text(),
            position = this.getPosition() + TypeScript.leadingTriviaWidth(propertyName),
            currentScope = this.getCurrentScope();

        if (currentScope.variableNames.indexOf(variableName) >= 0) {
            var failureString = Rule.FAILURE_STRING + variableName + "'";
            this.addFailure(this.createFailure(position, TypeScript.width(propertyName), failureString));
        } else {
            currentScope.variableNames.push(variableName);
        }

        super.visitVariableDeclarator(node);
    }
}

class ScopeInfo {
    public variableNames: string[] = [];
}
