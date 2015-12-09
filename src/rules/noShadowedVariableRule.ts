/**
 * @license
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

import * as ts from "typescript";
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-shadowed-variable",
        description: "Disallows shadowing variable declarations.",
        rationale: "Shadowing a variable masks access to it and obscures to what value an identifier actually refers.",
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "shadowed variable: '";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoShadowedVariableWalker(sourceFile, this.getOptions()));
    }
}

class NoShadowedVariableWalker extends Lint.BlockScopeAwareRuleWalker<ScopeInfo, ScopeInfo> {
    public createScope() {
        return new ScopeInfo();
    }

    public createBlockScope() {
        return new ScopeInfo();
    }

    public visitBindingElement(node: ts.BindingElement) {
        const isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;
        const variableDeclaration = Lint.getBindingElementVariableDeclaration(node);

        if (isSingleVariable) {
            if (variableDeclaration) {
                const isBlockScopedVariable = Lint.isBlockScopedVariable(variableDeclaration);
                this.handleSingleVariableIdentifier(<ts.Identifier> node.name, isBlockScopedVariable);
            } else {
                this.handleSingleParameterIdentifier(<ts.Identifier> node.name);
            }
        }

        super.visitBindingElement(node);
    }

    public visitCatchClause(node: ts.CatchClause) {
        // don't visit the catch clause variable declaration, just visit the block
        // the catch clause variable declaration has its own special scoping rules
        this.visitBlock(node.block);
    }

    public visitCallSignature(node: ts.SignatureDeclaration) {
        // don't call super, we don't need to check parameter names in call signatures
    }

    public visitFunctionType(node: ts.FunctionOrConstructorTypeNode) {
        // don't call super, we don't need to check names in function types
    }

    public visitMethodSignature(node: ts.SignatureDeclaration) {
        // don't call super, we don't want to walk method signatures either
    }

    public visitParameterDeclaration(node: ts.ParameterDeclaration) {
        const isSingleParameter = node.name.kind === ts.SyntaxKind.Identifier;

        if (isSingleParameter) {
            this.handleSingleParameterIdentifier(<ts.Identifier> node.name);
        }

        super.visitParameterDeclaration(node);
    }

    public visitTypeLiteral(node: ts.TypeLiteralNode) {
        // don't call super, we don't want to walk the inside of type nodes
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        const isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;

        if (isSingleVariable) {
            this.handleSingleVariableIdentifier(<ts.Identifier> node.name, Lint.isBlockScopedVariable(node));
        }

        super.visitVariableDeclaration(node);
    }

    private handleSingleVariableIdentifier(variableIdentifier: ts.Identifier, isBlockScoped: boolean) {
        const variableName = variableIdentifier.text;
        const currentScope = this.getCurrentScope();
        const currentBlockScope = this.getCurrentBlockScope();

        // this var is shadowing if there's already a var of the same name in any available scope AND
        // it is not in the current block (those are handled by the 'no-duplicate-variable' rule)
        if (this.isVarInAnyScope(variableName) && currentBlockScope.varNames.indexOf(variableName) < 0) {
            this.addFailureOnIdentifier(variableIdentifier);
        }

        // regular vars should always be added to the scope; block-scoped vars should be added iff
        // the current scope is same as current block scope
        if (!isBlockScoped
                || this.getCurrentBlockDepth() === 1
                || this.getCurrentBlockDepth() === this.getCurrentDepth()) {
            currentScope.varNames.push(variableName);
        }
        currentBlockScope.varNames.push(variableName);
    }

    private handleSingleParameterIdentifier(variableIdentifier: ts.Identifier) {
        // treat parameters as block-scoped variables
        const variableName = variableIdentifier.text;
        const currentScope = this.getCurrentScope();

        if (this.isVarInAnyScope(variableName)) {
            this.addFailureOnIdentifier(variableIdentifier);
        }
        currentScope.varNames.push(variableName);
    }

    private isVarInAnyScope(varName: string) {
        return this.getAllScopes().some((scopeInfo) => scopeInfo.varNames.indexOf(varName) >= 0);
    }

    private addFailureOnIdentifier(ident: ts.Identifier) {
        const failureString = Rule.FAILURE_STRING + ident.text + "'";
        this.addFailure(this.createFailure(ident.getStart(), ident.getWidth(), failureString));
    }
}

class ScopeInfo {
    public varNames: string[] = [];
}
