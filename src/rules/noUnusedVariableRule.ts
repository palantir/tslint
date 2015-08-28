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

const OPTION_CHECK_PARAMETERS = "check-parameters";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "unused variable: ";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const languageService = Lint.createLanguageService(sourceFile.fileName, sourceFile.getFullText());
        return this.applyWithWalker(new NoUnusedVariablesWalker(sourceFile, this.getOptions(), languageService));
    }
}

class NoUnusedVariablesWalker extends Lint.RuleWalker {
    private languageService: ts.LanguageService;
    private skipBindingElement: boolean;
    private skipParameterDeclaration: boolean;
    private skipVariableDeclaration: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, languageService: ts.LanguageService) {
        super(sourceFile, options);
        this.languageService = languageService;
        this.skipVariableDeclaration = false;
        this.skipParameterDeclaration = false;
    }

    public visitBindingElement(node: ts.BindingElement) {
        const isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;

        if (isSingleVariable && !this.skipBindingElement) {
            const variableIdentifier = <ts.Identifier> node.name;
            this.validateReferencesForVariable(variableIdentifier.text, variableIdentifier.getStart());
        }

        super.visitBindingElement(node);
    }

    public visitImportDeclaration(node: ts.ImportDeclaration) {
        if (!Lint.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)) {
            const importClause = node.importClause;

            // named imports & namespace imports handled by other walker methods
            // importClause will be null for bare imports
            if (importClause != null && importClause.name != null) {
                const variableIdentifier = importClause.name;
                this.validateReferencesForVariable(variableIdentifier.text, variableIdentifier.getStart());
            }
        }

        super.visitImportDeclaration(node);
    }

    public visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        if (!Lint.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)) {
            const name = node.name;
            this.validateReferencesForVariable(name.text, name.getStart());
        }
        super.visitImportEqualsDeclaration(node);
    }

    public visitCatchClause(node: ts.CatchClause) {
        // don't visit the catch clause variable declaration, just visit the block
        // the catch clause variable declaration needs to be there but doesn't need to be used
        this.visitBlock(node.block);
    }

    public visitNamedImports(node: ts.NamedImports) {
        node.elements.forEach((namedImport: ts.ImportSpecifier) => {
            this.validateReferencesForVariable(namedImport.name.text, namedImport.name.getStart());
        });
        super.visitNamedImports(node);
    }

    public visitNamespaceImport(node: ts.NamespaceImport) {
        this.validateReferencesForVariable(node.name.text, node.name.getStart());
        super.visitNamespaceImport(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        const isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;

        if (isSingleVariable && !this.skipVariableDeclaration) {
            const variableIdentifier = <ts.Identifier> node.name;
            this.validateReferencesForVariable(variableIdentifier.text, variableIdentifier.getStart());
        }

        super.visitVariableDeclaration(node);
    }

    // skip parameters in interfaces
    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        this.skipParameterDeclaration = true;
        super.visitInterfaceDeclaration(node);
        this.skipParameterDeclaration = false;
    }

    // skip parameters in index signatures (stuff like [key: string]: string)
    public visitIndexSignatureDeclaration(node: ts.IndexSignatureDeclaration) {
        this.skipParameterDeclaration = true;
        super.visitIndexSignatureDeclaration(node);
        this.skipParameterDeclaration = false;
    }

    // skip exported and declared variables
    public visitVariableStatement(node: ts.VariableStatement) {
        if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword, ts.SyntaxKind.DeclareKeyword)) {
            this.skipBindingElement = true;
            this.skipVariableDeclaration = true;
        }

        super.visitVariableStatement(node);
        this.skipBindingElement = false;
        this.skipVariableDeclaration = false;
    }

    public visitFunctionType(node: ts.FunctionOrConstructorTypeNode) {
        this.skipParameterDeclaration = true;
        super.visitFunctionType(node);
        this.skipParameterDeclaration = false;
    }

    // skip exported and declared functions
    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        if (!Lint.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword, ts.SyntaxKind.DeclareKeyword)) {
            const variableName = node.name.text;
            this.validateReferencesForVariable(variableName, node.name.getStart());
        }

        super.visitFunctionDeclaration(node);
    }

    public visitParameterDeclaration(node: ts.ParameterDeclaration) {
        const isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;
        const isPropertyParameter = Lint.hasModifier(node.modifiers,
                                                     ts.SyntaxKind.PublicKeyword,
                                                     ts.SyntaxKind.PrivateKeyword,
                                                     ts.SyntaxKind.ProtectedKeyword);

        if (!isSingleVariable && isPropertyParameter) {
            // tsc error: a parameter property may not be a binding pattern
            this.skipBindingElement = true;
        }

        if (this.hasOption(OPTION_CHECK_PARAMETERS)
            && isSingleVariable
            && !this.skipParameterDeclaration
            && !Lint.hasModifier(node.modifiers, ts.SyntaxKind.PublicKeyword)) {
            const nameNode = <ts.Identifier> node.name;
            this.validateReferencesForVariable(nameNode.text, node.name.getStart());
        }

        super.visitParameterDeclaration(node);
        this.skipBindingElement = false;
    }

    // check private member variables
    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        if (node.name != null && node.name.kind === ts.SyntaxKind.Identifier) {
            const modifiers = node.modifiers;
            const variableName = (<ts.Identifier> node.name).text;

            // check only if an explicit 'private' modifier is specified
            if (Lint.hasModifier(modifiers, ts.SyntaxKind.PrivateKeyword)) {
                this.validateReferencesForVariable(variableName, node.name.getStart());
            }
        }

        super.visitPropertyDeclaration(node);
    }

    // check private member functions
    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        if (node.name != null && node.name.kind === ts.SyntaxKind.Identifier) {
            const modifiers = node.modifiers;
            const variableName = (<ts.Identifier> node.name).text;

            if (Lint.hasModifier(modifiers, ts.SyntaxKind.PrivateKeyword)) {
                this.validateReferencesForVariable(variableName, node.name.getStart());
            }
        }

        super.visitMethodDeclaration(node);
    }

    private validateReferencesForVariable(name: string, position: number) {
        const fileName = this.getSourceFile().fileName;
        const highlights = this.languageService.getDocumentHighlights(fileName, position, [fileName]);
        if (highlights == null || highlights[0].highlightSpans.length <= 1) {
            this.addFailure(this.createFailure(position, name.length, `${Rule.FAILURE_STRING}'${name}'`));
        }
    }
}
