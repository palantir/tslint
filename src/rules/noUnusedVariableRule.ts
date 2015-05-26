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
            var importClause = node.importClause;

            // named imports & namespace imports handled by other walker methods
            if (importClause.name != null) {
                var variableIdentifier = importClause.name;
                this.validateReferencesForVariable(variableIdentifier.text, variableIdentifier.getStart());
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

    public visitNamedImports(node: ts.NamedImports): void {
        node.elements.forEach((namedImport: ts.ImportSpecifier) => {
            this.validateReferencesForVariable(namedImport.name.text, namedImport.name.getStart());
        });
        super.visitNamedImports(node);
    }

    public visitNamespaceImport(node: ts.NamespaceImport): void {
        this.validateReferencesForVariable(node.name.text, node.name.getStart());
        super.visitNamespaceImport(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration): void {
        var propertyName = <ts.Identifier> node.name;
        var variableName = propertyName.text;

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

    // skip exported and declared variables
    public visitVariableStatement(node: ts.VariableStatement): void {
        if (this.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)
            || this.hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword)) {
            this.skipVariableDeclaration = true;
        }

        super.visitVariableStatement(node);
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
            this.addFailure(this.createFailure(position, name.length, `${Rule.FAILURE_STRING}'${name}'`));
        }
    }
}
