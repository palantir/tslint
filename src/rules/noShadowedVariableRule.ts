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
    public static FAILURE_STRING = "shadowed variable: '";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoShadowedVariableWalker(sourceFile, this.getOptions()));
    }
}

class NoShadowedVariableWalker extends Lint.BlockScopeAwareRuleWalker<ScopeInfo, ScopeInfo> {
    public createScope(): ScopeInfo {
        return new ScopeInfo();
    }

    public createBlockScope(): ScopeInfo {
        return new ScopeInfo();
    }

    public visitParameterDeclaration(node: ts.ParameterDeclaration): void {
        // Treat parameters as block-scoped variables
        var propertyName = <ts.Identifier> node.name;
        var variableName = propertyName.text;
        var currentScope = this.getCurrentScope();
        var currentBlockScope = this.getCurrentBlockScope();

        if (this.isVarInAnyScope(variableName)) {
            this.addFailureOnIdentifier(propertyName);
        }
        currentScope.varNames.push(variableName);

        super.visitParameterDeclaration(node);
    }

    public visitTypeLiteral(node: ts.TypeLiteralNode): void {
        // don't call super, we don't want to walk the inside of type nodes
    }

    public visitMethodSignature(node: ts.SignatureDeclaration): void {
        // don't call super, we don't want to walk method signatures either
    }

    public visitCatchClause(node: ts.CatchClause): void {
        // don't visit the catch clause variable declaration, just visit the block
        // the catch clause variable declaration has its own special scoping rules
        this.visitBlock(node.block);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration): void {
        var propertyName = <ts.Identifier> node.name;
        var variableName = propertyName.text;
        var currentScope = this.getCurrentScope();
        var currentBlockScope = this.getCurrentBlockScope();

        // this var is shadowing if there's already a var of the same name in any available scope AND
        // it is not in the current block (those are handled by the 'no-duplicate-variable' rule)
        if (this.isVarInAnyScope(variableName) && currentBlockScope.varNames.indexOf(variableName) < 0) {
            this.addFailureOnIdentifier(propertyName);
        }

        // regular vars should always be added to the scope; block-scoped vars should be added iff
        // the current scope is same as current block scope
        if (!Lint.isBlockScopedVariable(node)
                || this.getCurrentBlockDepth() === 1
                || this.getCurrentBlockDepth() === this.getCurrentDepth()) {
            currentScope.varNames.push(variableName);
        }
        currentBlockScope.varNames.push(variableName);

        super.visitVariableDeclaration(node);
    }

    private isVarInAnyScope(varName: string): boolean {
        return this.getAllScopes().some((scopeInfo) => scopeInfo.varNames.indexOf(varName) >= 0);
    }

    private addFailureOnIdentifier(ident: ts.Identifier): void {
        var failureString = Rule.FAILURE_STRING + ident.text + "'";
        this.addFailure(this.createFailure(ident.getStart(), ident.getWidth(), failureString));
    }
}

class ScopeInfo {
    public varNames: string[] = [];
}

