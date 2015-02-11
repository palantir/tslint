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

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost("file.ts", sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);

        return this.applyWithWalker(new NoUnusedVariablesWalker(sourceFile, this.getOptions(), languageService));
    }
}

class NoUnusedVariablesWalker extends Lint.RuleWalker {
    private skipVariableDeclaration: boolean;
    private skipParameterDeclaration: boolean;
    private languageService: ts.LanguageService;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, languageService: ts.LanguageService) {
        super(sourceFile, options);
        this.skipVariableDeclaration = false;
        this.skipParameterDeclaration = false;
        this.languageService = languageService;
    }

    public visitImportDeclaration(node: ts.ImportDeclaration): void {
        if (!this.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)) {
            this.validateReferencesForVariable(node.name.text, node.name.getStart());
        }
        super.visitImportDeclaration(node);
    }

    // check variable declarations
    public visitVariableDeclaration(node: ts.VariableDeclaration): void {
        var propertyName = node.name,
            variableName = propertyName.text;

        if (!this.skipVariableDeclaration) {
            this.validateReferencesForVariable(variableName, propertyName.getStart());
        }

        super.visitVariableDeclaration(node);
    }

    // skip parameters in interfaces
    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void {
        this.skipParameterDeclaration = true;
        super.visitInterfaceDeclaration(node);
        this.skipParameterDeclaration = false;
    }

    // skip parameters in index signatures (stuff like [key: string]: string)
    public visitIndexSignatureDeclaration(node: ts.IndexSignatureDeclaration): void {
        this.skipParameterDeclaration = true;
        super.visitIndexSignatureDeclaration(node);
        this.skipParameterDeclaration = false;
    }

    // skip exported variables
    public visitVariableStatement(node: ts.VariableStatement): void {
        if (this.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)) {
            this.skipVariableDeclaration = true;
        }

        super.visitVariableStatement(node);
        this.skipVariableDeclaration = false;
    }

    // check function declarations (skipping exports)
    public visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        var variableName = node.name.text;

        if (!this.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)) {
            this.validateReferencesForVariable(variableName, node.name.getStart());
        }

        super.visitFunctionDeclaration(node);
    }

    public visitParameterDeclaration(node: ts.ParameterDeclaration): void {
        var variableName = node.name.text;

        // Skip parameters in type literals. We don't want to generate
        // warnings about unused variables in those.
        if (node.parent && node.parent.symbol) {

            // Similar code which checks presence of a bit is also present in
            // noDuplicateVariableRule.ts. Does TypeScript or tslint provide
            // any helpers to test presence of bits?
            var symbolFlags = node.parent.symbol.flags;
            if ((Math.floor(symbolFlags / ts.SymbolFlags.TypeLiteral) % 2) === 1) {
                return;
            }
        }

        if (!this.hasModifier(node.modifiers, ts.SyntaxKind.PublicKeyword)
            && !this.skipParameterDeclaration && this.hasOption(OPTION_CHECK_PARAMETERS)) {
            this.validateReferencesForVariable(variableName, node.name.getStart());
        }

        super.visitParameterDeclaration(node);
    }

    // check private member variables
    public visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
        if (node.name != null && node.name.kind === ts.SyntaxKind.Identifier) {
            var modifiers = node.modifiers;
            var variableName = (<ts.Identifier> node.name).text;

            // check only if an explicit 'private' modifier is specified
            if (this.hasModifier(modifiers, ts.SyntaxKind.PrivateKeyword)) {
                this.validateReferencesForVariable(variableName, node.name.getStart());
            }
        }

        super.visitPropertyDeclaration(node);
    }

    // check private member functions
    public visitMethodDeclaration(node: ts.MethodDeclaration): void {
        if (node.name != null && node.name.kind === ts.SyntaxKind.Identifier) {
            var modifiers = node.modifiers;
            var variableName = (<ts.Identifier> node.name).text;

            if (this.hasModifier(modifiers, ts.SyntaxKind.PrivateKeyword)) {
                this.validateReferencesForVariable(variableName, node.name.getStart());
            }
        }

        super.visitMethodDeclaration(node);
    }

    private hasModifier(modifiers: ts.ModifiersArray, modifierKind: ts.SyntaxKind) {
        if (modifiers == null) {
            return false;
        }
        for (var i = 0, n = modifiers.length; i < n; i++) {
            var modifier = modifiers[i];
            if (modifier.kind === modifierKind) {
                return true;
            }
        }

        return false;
    }

    private validateReferencesForVariable(name: string, position: number) {
        var references = this.languageService.getReferencesAtPosition("file.ts", position);
        if (references.length <= 1) {
            var failureString = Rule.FAILURE_STRING + "'" + name + "'";
            var failure = this.createFailure(position, name.length, failureString);
            this.addFailure(failure);
        }
    }
}
