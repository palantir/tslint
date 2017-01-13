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

import * as Lint from "../index";

const OPTION_REACT = "react";
const OPTION_CHECK_PARAMETERS = "check-parameters";

const REACT_MODULES = ["react", "react/addons"];
const REACT_NAMESPACE_IMPORT_NAME = "React";

const MODULE_SPECIFIER_MATCH = /^["'](.+)['"]$/;

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unused-variable",
        deprecationMessage: "Use the tsc compiler options --noUnusedParameters and --noUnusedLocals instead.",
        description: "Disallows unused imports, variables, functions and private class members.",
        hasFix: true,
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
            items: {
                oneOf: [{
                    type: "string",
                    enum: ["check-parameters", "react"],
                }, {
                    type: "object",
                    properties: {
                        "ignore-pattern": {type: "string"},
                    },
                    additionalProperties: false,
                }],
            },
            minLength: 0,
            maxLength: 3,
        },
        optionExamples: ['[true, "react"]', '[true, {"ignore-pattern": "^_"}]'],
        type: "functionality",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_TYPE_FUNC = "function";
    public static FAILURE_TYPE_IMPORT = "import";
    public static FAILURE_TYPE_METHOD = "method";
    public static FAILURE_TYPE_PARAM = "parameter";
    public static FAILURE_TYPE_PROP = "property";
    public static FAILURE_TYPE_VAR = "variable";
    public static FAILURE_STRING_FACTORY = (type: string, name: string) => {
        return `Unused ${type}: '${name}'`;
    }

    public apply(sourceFile: ts.SourceFile, languageService: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnusedVariablesWalker(sourceFile, this.getOptions(), languageService));
    }
}

interface Failure {
    start: number;
    width: number;
    message: string;
    fix?: Lint.Fix;
}

class NoUnusedVariablesWalker extends Lint.RuleWalker {
    private skipBindingElement: boolean;
    private skipParameterDeclaration: boolean;
    private skipVariableDeclaration: boolean;

    private hasSeenJsxElement: boolean;
    private ignorePattern: RegExp;
    private isReactUsed: boolean;
    private reactImport: ts.NamespaceImport;
    private possibleFailures: Failure[] = [];

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions,
                private languageService: ts.LanguageService) {
        super(sourceFile, options);
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
                const msg = Rule.FAILURE_STRING_FACTORY(Rule.FAILURE_TYPE_IMPORT, nameText);
                this.possibleFailures.push({ start, width: nameText.length, message: msg });
            }
        }

        let someFixBrokeIt = false;
        // Performance optimization: type-check the whole file before verifying individual fixes
        if (this.possibleFailures.some((f) => f.fix !== undefined)) {
            const newText = Lint.Fix.applyAll(this.getSourceFile().getFullText(),
                this.possibleFailures.map((f) => f.fix!).filter((f) => f !== undefined));

            // If we have the program, we can verify that the fix doesn't introduce failures
            if (Lint.checkEdit(this.languageService, this.getSourceFile(), newText).length > 0) {
                console.error(`Fixes caused errors in ${this.getSourceFile().fileName}`);
                someFixBrokeIt = true;
            }
        }

        this.possibleFailures.forEach((f) => {
            if (!someFixBrokeIt || f.fix === undefined) {
                this.addFailureAt(f.start, f.width, f.message, f.fix);
            } else {
                const newText = f.fix.apply(this.getSourceFile().getFullText());
                if (Lint.checkEdit(this.languageService, this.getSourceFile(), newText).length === 0) {
                    this.addFailureAt(f.start, f.width, f.message, f.fix);
                }
            }
        });
    }

    public visitBindingElement(node: ts.BindingElement) {
        const isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;

        if (isSingleVariable && !this.skipBindingElement) {
            const variableIdentifier = node.name as ts.Identifier;
            this.validateReferencesForVariable(Rule.FAILURE_TYPE_VAR, variableIdentifier.text, variableIdentifier.getStart());
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
        if (!Lint.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword, ts.SyntaxKind.DeclareKeyword) && node.name !== undefined) {
            const variableName = node.name.text;
            this.validateReferencesForVariable(Rule.FAILURE_TYPE_FUNC, variableName, node.name.getStart());
        }

        super.visitFunctionDeclaration(node);
    }

    public visitFunctionType(node: ts.FunctionOrConstructorTypeNode) {
        this.skipParameterDeclaration = true;
        super.visitFunctionType(node);
        this.skipParameterDeclaration = false;
    }

    public visitImportDeclaration(node: ts.ImportDeclaration) {
        const importClause = node.importClause;

        // If the imports are exported, they may be used externally
        if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword) ||
            // importClause will be null for bare imports
            importClause == null) {
            super.visitImportDeclaration(node);
            return;
        }

        // Two passes: first collect what's unused, then produce failures. This allows the fix to lookahead.
        let usesDefaultImport = false;
        let usedNamedImports: boolean[] = [];
        if (importClause.name != null) {
            const variableIdentifier = importClause.name;
            usesDefaultImport = this.isUsed(variableIdentifier.text, variableIdentifier.getStart());
        }
        if (importClause.namedBindings != null) {
            if (importClause.namedBindings.kind === ts.SyntaxKind.NamedImports && node.importClause !== undefined) {
                const imports = node.importClause.namedBindings as ts.NamedImports;
                usedNamedImports = imports.elements.map((e) => this.isUsed(e.name.text, e.name.getStart()));
            }
            // Avoid deleting the whole statement if there's an import * inside
            if (importClause.namedBindings.kind === ts.SyntaxKind.NamespaceImport) {
                usesDefaultImport = true;
            }
        }

        // Delete the entire import statement if named and default imports all unused
        if (!usesDefaultImport && usedNamedImports.every((e) => !e)) {
            this.fail(Rule.FAILURE_TYPE_IMPORT, node.getText(), node.getStart(), this.deleteImportStatement(node));
            super.visitImportDeclaration(node);
            return;
        }

        // Delete the default import and trailing comma if unused
        if (importClause.name != null && !usesDefaultImport && importClause.namedBindings !== undefined) {
            // There must be some named imports or we would have been in case 1
            const end = importClause.namedBindings.getStart();
            this.fail(Rule.FAILURE_TYPE_IMPORT, importClause.name.text, importClause.name.getStart(), [
                this.deleteText(importClause.name.getStart(), end - importClause.name.getStart()),
            ]);
        }
        if (importClause.namedBindings != null &&
            importClause.namedBindings.kind === ts.SyntaxKind.NamedImports) {
            // Delete the entire named imports if all unused, including curly braces.
            if (usedNamedImports.every((e) => !e)) {
                const start = importClause.name != null ? importClause.name.getEnd() : importClause.namedBindings.getStart();
                this.fail(Rule.FAILURE_TYPE_IMPORT, importClause.namedBindings.getText(), importClause.namedBindings.getStart(), [
                    this.deleteText(start, importClause.namedBindings.getEnd() - start),
                ]);
            } else {
                const imports = importClause.namedBindings as ts.NamedImports;
                let priorElementUsed = false;
                for (let idx = 0; idx < imports.elements.length; idx++) {
                    const namedImport = imports.elements[idx];
                    if (usedNamedImports[idx]) {
                        priorElementUsed = true;
                    } else {
                        const isLast = idx === imports.elements.length - 1;
                        // Before the first used import, consume trailing commas.
                        // Afterward, consume leading commas instead.
                        const start = priorElementUsed ? imports.elements[idx - 1].getEnd() : namedImport.getStart();
                        const end = priorElementUsed || isLast ? namedImport.getEnd() : imports.elements[idx + 1].getStart();
                        this.fail(Rule.FAILURE_TYPE_IMPORT, namedImport.name.text, namedImport.name.getStart(), [
                            this.deleteText(start, end - start),
                        ]);
                    }
                }
            }
        }

        // import x = 'y' & import * as x from 'y' handled by other walker methods
        // because they only have one identifier that might be unused
        super.visitImportDeclaration(node);
    }

    public visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        if (!Lint.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)) {
            const name = node.name;
            this.validateReferencesForVariable(Rule.FAILURE_TYPE_IMPORT, name.text, name.getStart(), this.deleteImportStatement(node));
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
            const variableName = (node.name as ts.Identifier).text;

            if (Lint.hasModifier(modifiers, ts.SyntaxKind.PrivateKeyword)) {
                this.validateReferencesForVariable(Rule.FAILURE_TYPE_METHOD, variableName, node.name.getStart());
            }
        }

        // abstract methods can't have a body so their parameters are always unused
        if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.AbstractKeyword)) {
            this.skipParameterDeclaration = true;
        }
        super.visitMethodDeclaration(node);
        this.skipParameterDeclaration = false;
    }

    public visitNamespaceImport(node: ts.NamespaceImport) {
        if (node.parent !== undefined) {
            const importDeclaration = node.parent.parent as ts.ImportDeclaration;
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
                this.validateReferencesForVariable(Rule.FAILURE_TYPE_IMPORT, node.name.text, node.name.getStart(),
                    this.deleteImportStatement(importDeclaration));
            }
        }
        super.visitNamespaceImport(node);
    }

    public visitParameterDeclaration(node: ts.ParameterDeclaration) {
        const isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;
        const isPropertyParameter = Lint.hasModifier(
            node.modifiers,
            ts.SyntaxKind.PublicKeyword,
            ts.SyntaxKind.PrivateKeyword,
            ts.SyntaxKind.ProtectedKeyword,
        );

        if (!isSingleVariable && isPropertyParameter) {
            // tsc error: a parameter property may not be a binding pattern
            this.skipBindingElement = true;
        }

        if (this.hasOption(OPTION_CHECK_PARAMETERS)
                && isSingleVariable
                && !this.skipParameterDeclaration
                && !Lint.hasModifier(node.modifiers, ts.SyntaxKind.PublicKeyword)) {
            const nameNode = node.name as ts.Identifier;
            this.validateReferencesForVariable(Rule.FAILURE_TYPE_PARAM, nameNode.text, node.name.getStart());
        }

        super.visitParameterDeclaration(node);
        this.skipBindingElement = false;
    }

    // check private member variables
    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        if (node.name != null && node.name.kind === ts.SyntaxKind.Identifier) {
            const modifiers = node.modifiers;
            const variableName = (node.name as ts.Identifier).text;

            // check only if an explicit 'private' modifier is specified
            if (Lint.hasModifier(modifiers, ts.SyntaxKind.PrivateKeyword)) {
                this.validateReferencesForVariable(Rule.FAILURE_TYPE_PROP, variableName, node.name.getStart());
            }
        }

        super.visitPropertyDeclaration(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        const isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;

        if (isSingleVariable && !this.skipVariableDeclaration) {
            const variableIdentifier = node.name as ts.Identifier;
            this.validateReferencesForVariable(Rule.FAILURE_TYPE_VAR, variableIdentifier.text, variableIdentifier.getStart());
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

    /**
     * Delete the statement along with leading trivia.
     * BUT since imports are typically at the top of the file, the leading trivia is often a license.
     * So when the leading trivia includes a block comment, delete the statement without leading trivia instead.
     */
    private deleteImportStatement(node: ts.Statement): Lint.Replacement[] {
        if (node.getFullText().substr(0, node.getLeadingTriviaWidth()).indexOf("/*") >= 0) {
            return [this.deleteText(node.getStart(), node.getWidth())];
        }
        return [this.deleteText(node.getFullStart(), node.getFullWidth())];
    }

    private validateReferencesForVariable(type: string, name: string, position: number, replacements?: Lint.Replacement[]) {
        if (!this.isUsed(name, position)) {
            this.fail(type, name, position, replacements);
        }
    }

    private isUsed(name: string, position: number): boolean {
        const fileName = this.getSourceFile().fileName;
        const highlights = this.languageService.getDocumentHighlights(fileName, position, [fileName]);
        return (highlights != null && highlights[0].highlightSpans.length > 1) || this.isIgnored(name);
    }

    private fail(type: string, name: string, position: number, replacements?: Lint.Replacement[]) {
        let fix: Lint.Fix | undefined = undefined;
        if (replacements && replacements.length) {
            fix = new Lint.Fix(Rule.metadata.ruleName, replacements);
        }
        this.possibleFailures.push({ start: position, width: name.length, message: Rule.FAILURE_STRING_FACTORY(type, name), fix });
    }

    private isIgnored(name: string) {
        return this.ignorePattern != null && this.ignorePattern.test(name);
    }
}
