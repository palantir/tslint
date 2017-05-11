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

// tslint:disable deprecation
// (https://github.com/palantir/tslint/pull/2598)

import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-shadowed-variable",
        description: "Disallows shadowing variable declarations.",
        rationale: "Shadowing a variable masks access to it and obscures to what value an identifier actually refers.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(name: string) {
        return `Shadowed variable: '${name}'`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoShadowedVariableWalker(sourceFile, this.getOptions()));
    }
}

class NoShadowedVariableWalker extends Lint.BlockScopeAwareRuleWalker<Set<string>, Set<string>> {
    public createScope() {
        return new Set();
    }

    public createBlockScope() {
        return new Set();
    }

    public visitBindingElement(node: ts.BindingElement) {
        const isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;
        if (isSingleVariable) {
            const name = node.name as ts.Identifier;
            const variableDeclaration = Lint.getBindingElementVariableDeclaration(node);
            const isBlockScopedVariable = variableDeclaration !== null && Lint.isBlockScopedVariable(variableDeclaration);
            this.handleSingleVariableIdentifier(name, isBlockScopedVariable);
        }

        super.visitBindingElement(node);
    }

    public visitCatchClause(node: ts.CatchClause) {
        // don't visit the catch clause variable declaration, just visit the block
        // the catch clause variable declaration has its own special scoping rules
        this.visitBlock(node.block);
    }

    public visitCallSignature(_node: ts.SignatureDeclaration) {
        // don't call super, we don't need to check parameter names in call signatures
    }

    public visitFunctionType(_node: ts.FunctionOrConstructorTypeNode) {
        // don't call super, we don't need to check names in function types
    }

    public visitConstructorType(_node: ts.FunctionOrConstructorTypeNode) {
        // don't call super, we don't need to check names in constructor types
    }

    public visitIndexSignatureDeclaration(_node: ts.SignatureDeclaration) {
        // don't call super, we don't want to walk index signatures
    }

    public visitMethodSignature(_node: ts.SignatureDeclaration) {
        // don't call super, we don't want to walk method signatures either
    }

    public visitParameterDeclaration(node: ts.ParameterDeclaration) {
        const isSingleParameter = node.name.kind === ts.SyntaxKind.Identifier;

        if (isSingleParameter) {
            this.handleSingleVariableIdentifier(node.name as ts.Identifier, false);
        }

        super.visitParameterDeclaration(node);
    }

    public visitTypeLiteral(_node: ts.TypeLiteralNode) {
        // don't call super, we don't want to walk the inside of type nodes
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        const isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;

        if (isSingleVariable) {
            this.handleSingleVariableIdentifier(node.name as ts.Identifier, Lint.isBlockScopedVariable(node));
        }

        super.visitVariableDeclaration(node);
    }

    private handleSingleVariableIdentifier(variableIdentifier: ts.Identifier, isBlockScoped: boolean) {
        const variableName = variableIdentifier.text;

        if (this.isVarInCurrentScope(variableName) && !this.inCurrentBlockScope(variableName)) {
            // shadowing if there's already a `var` of the same name in the scope AND
            // it's not in the current block (handled by the 'no-duplicate-variable' rule)
            this.addFailureOnIdentifier(variableIdentifier);
        } else if (this.inPreviousBlockScope(variableName)) {
            // shadowing if there is a `var`, `let`, 'const`, or parameter in a previous block scope
            this.addFailureOnIdentifier(variableIdentifier);
        }

        if (!isBlockScoped) {
            // `var` variables go on the scope
            this.getCurrentScope().add(variableName);
        }
        // all variables go on block scope, including `var`
        this.getCurrentBlockScope().add(variableName);
    }

    private isVarInCurrentScope(varName: string) {
        return this.getCurrentScope().has(varName);
    }

    private inCurrentBlockScope(varName: string) {
        return this.getCurrentBlockScope().has(varName);
    }

    private inPreviousBlockScope(varName: string) {
        return this.getAllBlockScopes().some((scopeInfo) => {
            return scopeInfo !== this.getCurrentBlockScope() && scopeInfo.has(varName);
        });
    }

    private addFailureOnIdentifier(ident: ts.Identifier) {
        const failureString = Rule.FAILURE_STRING_FACTORY(ident.text);
        this.addFailureAtNode(ident, failureString);
    }
}
