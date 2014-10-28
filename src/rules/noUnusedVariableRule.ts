/*
 * Copyright 2014 Palantir Technologies, Inc.
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

var OPTION_CHECK_PARAMETERS = "check-parameters";

/// <reference path='../../lib/tslint.d.ts' />

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "unused variable: ";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = new Lint.LanguageServiceHost(syntaxTree, TypeScript.fullText(syntaxTree.sourceUnit()));
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);

        return this.applyWithWalker(new NoUnusedVariablesWalker(syntaxTree, this.getOptions(), languageService));
    }
}

class NoUnusedVariablesWalker extends Lint.RuleWalker {
    private fileName: string;
    private skipVariableDeclaration: boolean;
    private skipParameterDeclaration: boolean;
    private languageService: ts.LanguageService;

    constructor(syntaxTree: TypeScript.SyntaxTree, options: Lint.IOptions, languageService: ts.LanguageService) {
        super(syntaxTree, options);
        this.fileName = syntaxTree.fileName();
        this.skipVariableDeclaration = false;
        this.skipParameterDeclaration = false;
        this.languageService = languageService;
    }

    public visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): void {
        if (!this.hasModifier(node.modifiers, TypeScript.SyntaxKind.ExportKeyword)) {
            var position = this.positionAfter(node.importKeyword);
            this.validateReferencesForVariable(node.identifier.text(), position);
        }
        super.visitImportDeclaration(node);
    }

    // check variable declarations
    public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
        var propertyName = node.propertyName,
            variableName = propertyName.text(),
            position = this.getPosition() + propertyName.leadingTriviaWidth();

        if (!this.skipVariableDeclaration) {
            this.validateReferencesForVariable(variableName, position);
        }

        super.visitVariableDeclarator(node);
    }

    // skip parameters in method signatures
    public visitMethodSignature(node: TypeScript.MethodSignatureSyntax): void {
        this.skipParameterDeclaration = true;
        super.visitMethodSignature(node);
        this.skipParameterDeclaration = false;
    }

    // skip parameters in index signatures (stuff like [key: string]: string)
    public visitIndexSignature(node: TypeScript.IndexSignatureSyntax): void {
        this.skipParameterDeclaration = true;
        super.visitIndexSignature(node);
        this.skipParameterDeclaration = false;
    }

    // skip exported variables
    public visitVariableStatement(node: TypeScript.VariableStatementSyntax): void {
        if (this.hasModifier(node.modifiers, TypeScript.SyntaxKind.ExportKeyword)) {
            this.skipVariableDeclaration = true;
        }

        super.visitVariableStatement(node);
        this.skipVariableDeclaration = false;
    }

    // check function declarations (skipping exports)
    public visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): void {
        var variableName = node.identifier.text();
        var position = this.positionAfter(node.modifiers, node.functionKeyword);

        if (!this.hasModifier(node.modifiers, TypeScript.SyntaxKind.ExportKeyword)) {
            this.validateReferencesForVariable(variableName, position);
        }

        super.visitFunctionDeclaration(node);
    }

    public visitParameter(node: TypeScript.ParameterSyntax): void {
        var variableName = node.identifier.text();
        var position = this.positionAfter(node.dotDotDotToken, node.modifiers) + TypeScript.leadingTriviaWidth(node);

        if (!this.hasModifier(node.modifiers, TypeScript.SyntaxKind.PublicKeyword)
            && !this.skipParameterDeclaration && this.hasOption(OPTION_CHECK_PARAMETERS)) {
            this.validateReferencesForVariable(variableName, position);
        }

        super.visitParameter(node);
    }

    // check private member variables
    public visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): void {
        var modifiers = node.modifiers;

        // unless an explicit 'private' modifier is specified, variable is public, so skip the current declaration
        if (!this.hasModifier(modifiers, TypeScript.SyntaxKind.PrivateKeyword)) {
            this.skipVariableDeclaration = true;
        }

        super.visitMemberVariableDeclaration(node);
        this.skipVariableDeclaration = false;
    }

    // check private member functions
    public visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): void {
        var modifiers = node.modifiers;
        var variableName = node.propertyName.text();
        var position = this.positionAfter(node.modifiers);

        if (this.hasModifier(modifiers, TypeScript.SyntaxKind.PrivateKeyword)) {
            this.validateReferencesForVariable(variableName, position);
        }

        super.visitMemberFunctionDeclaration(node);
    }

    private hasModifier(modifiers: TypeScript.ISyntaxToken[], modifierKind: TypeScript.SyntaxKind) {
        for (var i = 0, n = modifiers.length; i < n; i++) {
            var modifier = modifiers[i];
            if (modifier.kind() === modifierKind) {
                return true;
            }
        }

        return false;
    }

    private validateReferencesForVariable(name: string, position: number) {
        var references = this.languageService.getReferencesAtPosition(this.fileName, position);
        if (references.length <= 1) {
            var failureString = Rule.FAILURE_STRING + "'" + name + "'";
            var failure = this.createFailure(position, name.length, failureString);
            this.addFailure(failure);
        }
    }
}
