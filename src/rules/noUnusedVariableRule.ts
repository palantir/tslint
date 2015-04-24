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
    private skipBindingElement: boolean;
    private skipParameterDeclaration: boolean;
    private skipVariableDeclaration: boolean;
    private languageService: ts.LanguageService;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, languageService: ts.LanguageService) {
        super(sourceFile, options);
        this.skipVariableDeclaration = false;
        this.skipParameterDeclaration = false;
        this.languageService = languageService;
    }

    public visitBindingElement(node: ts.BindingElement) {
        var isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;

        if (isSingleVariable && !this.skipBindingElement) {
            var variableIdentifier = <ts.Identifier> node.name;
            this.validateReferencesForVariable(variableIdentifier.text, variableIdentifier.getStart());
        }

        super.visitBindingElement(node);
    }

    public visitImportDeclaration(node: ts.ImportDeclaration): void {
        if (!this.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)) {
            var importClause = node.importClause;
            if (importClause != null) {
                var name = <ts.Identifier> importClause.name;
                this.validateReferencesForVariable(name.text, name.getStart());
            }
        }
        super.visitImportDeclaration(node);
    }

    public visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration): void {
        if (!this.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)) {
            var name = node.name;
            this.validateReferencesForVariable(name.text, name.getStart());
        }
        super.visitImportEqualsDeclaration(node);
    }

    public visitCatchClause(node: ts.CatchClause): void {
        // don't visit the catch clause variable declaration, just visit the block
        // the catch clause variable declaration needs to be there but doesn't need to be used
        this.visitBlock(node.block);
    }

    // check variable declarations
    public visitVariableDeclaration(node: ts.VariableDeclaration): void {
        var isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;

        if (isSingleVariable && !this.skipVariableDeclaration) {
            var variableIdentifier = <ts.Identifier> node.name;
            this.validateReferencesForVariable(variableIdentifier.text, variableIdentifier.getStart());
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

    // skip exported and declared variables
    public visitVariableStatement(node: ts.VariableStatement): void {
        if (this.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)
            || this.hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword)) {
            this.skipBindingElement = true;
            this.skipVariableDeclaration = true;
        }

        super.visitVariableStatement(node);
        this.skipBindingElement = false;
        this.skipVariableDeclaration = false;
    }

    public visitFunctionType(node: ts.Node): void {
        this.skipParameterDeclaration = true;
        super.visitFunctionType(node);
        this.skipParameterDeclaration = false;
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
        var nameNode = <ts.Identifier> node.name;
        var variableName = nameNode.text;

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
        var highlights = this.languageService.getDocumentHighlights("file.ts", position, ["file.ts"]);
        if (highlights[0].highlightSpans.length <= 1) {
            var failureString = Rule.FAILURE_STRING + "'" + name + "'";
            var failure = this.createFailure(position, name.length, failureString);
            this.addFailure(failure);
        }
    }
}
