/**
 * @license
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

import * as ts from "typescript";
import * as Lint from "../lint";

const OPTION_REACT = "react";
const OPTION_CHECK_PARAMETERS = "check-parameters";

const REACT_MODULES = ["react", "react/addons"];
const REACT_NAMESPACE_IMPORT_NAME = "React";

const MODULE_SPECIFIER_MATCH = /^["'](.+)['"]$/;

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unused-variable",
        description: "Disallows unused imports, variables, functions and private class members.",
        optionsDescription: Lint.Utils.dedent`
            Three optional arguments may be optionally provided:

            * \`"check-parameters"\` disallows unused function and constructor parameters.
                * NOTE: this option is experimental and does not work with classes
                that use abstract method declarations, among other things.
            * \`"react"\` relaxes the rule for a namespace import named \`React\`
            (from either the module \`"react"\` or \`"react/addons"\`).
            Any JSX expression in the file will be treated as a usage of \`React\`
            (because it expands to \`React.createElement \`).
            * \`{"ignore-pattern": "pattern"}\` where pattern is a case-sensitive regexp.
            Variable names that match the pattern will be ignored.`,
        options: {
            type: "array",
            arrayMembers: [{
                type: "list",
                listType: {
                    type: "enum",
                    enumValues: ["check-parameters", "react"],
                },
            },
            {
                type: "object",
                properties: {
                    "ignore-pattern": {type: "string"},
                },
            }, ],
        },
        optionExamples: ['[true, "react"]', '[true, {"ignore-pattern": "^_"}]'],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

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

    private hasSeenJsxElement: boolean;
    private ignorePattern: RegExp;
    private isReactUsed: boolean;
    private reactImport: ts.NamespaceImport;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, languageService: ts.LanguageService) {
        super(sourceFile, options);
        this.languageService = languageService;
        this.skipVariableDeclaration = false;
        this.skipParameterDeclaration = false;
        this.hasSeenJsxElement = false;
        this.isReactUsed = false;

        const ignorePatternOption = this.getOptions().filter((option: any) => {
            return typeof option === "object" && option["ignore-pattern"] != null;
        })[0];
        if (ignorePatternOption != null) {
            this.ignorePattern = new RegExp(ignorePatternOption["ignore-pattern"]);
        }
    }

    public visitSourceFile(node: ts.SourceFile) {
        super.visitSourceFile(node);

        /*
         * After super.visitSourceFile() is completed, this.reactImport will be set to a NamespaceImport iff:
         *
         * - a react option has been provided to the rule and
         * - an import of a module that matches one of OPTION_REACT_MODULES is found, to a
         *   NamespaceImport named OPTION_REACT_NAMESPACE_IMPORT_NAME
         *
         * e.g.
         *
         * import * as React from "react/addons";
         *
         * If reactImport is defined when a walk is completed, we need to have:
         *
         * a) seen another usage of React and/or
         * b) seen a JSX identifier
         *
         * otherwise a a variable usage failure will will be reported
         */
        if (this.hasOption(OPTION_REACT)
                && this.reactImport != null
                && !this.isReactUsed
                && !this.hasSeenJsxElement) {
            const nameText = this.reactImport.name.getText();
            if (!this.isIgnored(nameText)) {
                const start = this.reactImport.name.getStart();
                this.addFailure(this.createFailure(start, nameText.length, `${Rule.FAILURE_STRING}'${nameText}'`));
            }
        }
    }

    public visitBindingElement(node: ts.BindingElement) {
        const isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;

        if (isSingleVariable && !this.skipBindingElement) {
            const variableIdentifier = <ts.Identifier> node.name;
            this.validateReferencesForVariable(variableIdentifier.text, variableIdentifier.getStart());
        }

        super.visitBindingElement(node);
    }

    public visitCatchClause(node: ts.CatchClause) {
        // don't visit the catch clause variable declaration, just visit the block
        // the catch clause variable declaration needs to be there but doesn't need to be used
        this.visitBlock(node.block);
    }

    // skip exported and declared functions
    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        if (!Lint.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword, ts.SyntaxKind.DeclareKeyword)) {
            const variableName = node.name.text;
            this.validateReferencesForVariable(variableName, node.name.getStart());
        }

        super.visitFunctionDeclaration(node);
    }

    public visitFunctionType(node: ts.FunctionOrConstructorTypeNode) {
        this.skipParameterDeclaration = true;
        super.visitFunctionType(node);
        this.skipParameterDeclaration = false;
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

    // skip parameters in index signatures (stuff like [key: string]: string)
    public visitIndexSignatureDeclaration(node: ts.IndexSignatureDeclaration) {
        this.skipParameterDeclaration = true;
        super.visitIndexSignatureDeclaration(node);
        this.skipParameterDeclaration = false;
    }

    // skip parameters in interfaces
    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        this.skipParameterDeclaration = true;
        super.visitInterfaceDeclaration(node);
        this.skipParameterDeclaration = false;
    }

    public visitJsxElement(node: ts.JsxElement) {
        this.hasSeenJsxElement = true;
        super.visitJsxElement(node);
    }

    public visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
        this.hasSeenJsxElement = true;
        super.visitJsxSelfClosingElement(node);
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

        // abstract methods can't have a body so their parameters are always unused
        if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.AbstractKeyword)) {
            this.skipParameterDeclaration = true;
        }
        super.visitMethodDeclaration(node);
        this.skipParameterDeclaration = false;
    }

    public visitNamedImports(node: ts.NamedImports) {
        for (const namedImport of node.elements) {
            this.validateReferencesForVariable(namedImport.name.text, namedImport.name.getStart());
        }
        super.visitNamedImports(node);
    }

    public visitNamespaceImport(node: ts.NamespaceImport) {
        const importDeclaration = <ts.ImportDeclaration> node.parent.parent;
        const moduleSpecifier = importDeclaration.moduleSpecifier.getText();

        // extract the unquoted module being imported
        const moduleNameMatch = moduleSpecifier.match(MODULE_SPECIFIER_MATCH);
        const isReactImport = (moduleNameMatch != null) && (REACT_MODULES.indexOf(moduleNameMatch[1]) !== -1);

        if (this.hasOption(OPTION_REACT) && isReactImport && node.name.text === REACT_NAMESPACE_IMPORT_NAME) {
            this.reactImport = node;
            const fileName = this.getSourceFile().fileName;
            const position = node.name.getStart();
            const highlights = this.languageService.getDocumentHighlights(fileName, position, [fileName]);
            if (highlights != null && highlights[0].highlightSpans.length > 1) {
                this.isReactUsed = true;
            }
        } else {
            this.validateReferencesForVariable(node.name.text, node.name.getStart());
        }
        super.visitNamespaceImport(node);
    }

    public visitParameterDeclaration(node: ts.ParameterDeclaration) {
        const isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;
        const isPropertyParameter = Lint.hasModifier(
            node.modifiers,
            ts.SyntaxKind.PublicKeyword,
            ts.SyntaxKind.PrivateKeyword,
            ts.SyntaxKind.ProtectedKeyword
        );

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

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        const isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;

        if (isSingleVariable && !this.skipVariableDeclaration) {
            const variableIdentifier = <ts.Identifier> node.name;
            this.validateReferencesForVariable(variableIdentifier.text, variableIdentifier.getStart());
        }

        super.visitVariableDeclaration(node);
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

    private validateReferencesForVariable(name: string, position: number) {
        const fileName = this.getSourceFile().fileName;
        const highlights = this.languageService.getDocumentHighlights(fileName, position, [fileName]);
        if ((highlights == null || highlights[0].highlightSpans.length <= 1) && !this.isIgnored(name)) {
            this.addFailure(this.createFailure(position, name.length, `${Rule.FAILURE_STRING}'${name}'`));
        }
    }

    private isIgnored(name: string) {
        return this.ignorePattern != null && this.ignorePattern.test(name);
    }
}
