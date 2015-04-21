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
    public static FAILURE_STRING = "duplicate block-scoped variable: '";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDuplicateLetWalker(sourceFile, this.getOptions()));
    }
}

class NoDuplicateLetWalker extends Lint.BlockScopeAwareRuleWalker<ScopeInfo> {
    public createScope(): ScopeInfo {
        return new ScopeInfo();
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration): void {
        var propertyName = <ts.Identifier> node.name;
        var variableName = propertyName.text;
        var currentScope = this.getCurrentScope();
        // determine if the appropriate bit in the parent (VariableDeclarationList) is set, which indicates this is a "let"
        var declarationIsLet = (Math.floor(node.parent.flags / ts.NodeFlags.Let) % 2) === 1;

        if (declarationIsLet) {
            if (currentScope.letNames.indexOf(variableName) >= 0) {
                this.addFailureOnIdentifier(propertyName);
            } else {
                currentScope.letNames.push(variableName);
            }
        }

        super.visitVariableDeclaration(node);
    }

    private addFailureOnIdentifier(ident: ts.Identifier): void {
        var failureString = Rule.FAILURE_STRING + ident.text + "'";
        this.addFailure(this.createFailure(ident.getStart(), ident.getWidth(), failureString));
    }
}

class ScopeInfo {
    public letNames: string[] = [];
}
