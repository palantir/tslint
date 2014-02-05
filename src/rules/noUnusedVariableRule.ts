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

/// <reference path='../../lib/tslint.d.ts' />

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "unused variable: ";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        var languageServiceHost = new LanguageServiceHost(syntaxTree, this.getOptions().source);
        var languageServices = new TypeScript.Services.LanguageService(languageServiceHost);

        return this.applyWithWalker(new NoUnusedVariablesWalker(syntaxTree, this.getOptions(), languageServices));
    }
}

class NoUnusedVariablesWalker extends Lint.ScopeAwareRuleWalker<ScopeInfo> {
    private fileName: string;
    private skipVariableDeclaration: boolean;
    private languageServices: TypeScript.Services.LanguageService;

    constructor(syntaxTree: TypeScript.SyntaxTree, options: Lint.IOptions, languageServices: TypeScript.Services.LanguageService) {
        super(syntaxTree, options);
        this.fileName = syntaxTree.fileName();
        this.skipVariableDeclaration = false;
        this.languageServices = languageServices;
    }

    public createScope(): ScopeInfo {
        return new ScopeInfo();
    }

    public visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): void {
        var position = this.positionAfter(node.importKeyword);
        this.validateReferencesForVariable(node.identifier.text(), position);
        super.visitImportDeclaration(node);
    }

    // check variable declarations
    public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
        var propertyName = node.propertyName,
            variableName = propertyName.text(),
            position = this.position() + propertyName.leadingTriviaWidth(),
            currentScope = this.getCurrentScope();

        if (!this.skipVariableDeclaration) {
            currentScope.variables[variableName] = position;
        }

        super.visitVariableDeclarator(node);
    }

    // skip exported variables
    public visitVariableStatement(node: TypeScript.VariableStatementSyntax): void {
        if (this.hasModifier(node.modifiers, "export")) {
            this.skipVariableDeclaration = true;
        }

        super.visitVariableStatement(node);
        this.skipVariableDeclaration = false;
    }

    // check function declarations (skipping exports)
    public visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): void {
        var currentScope = this.getCurrentScope();
        var variableName = node.identifier.text();
        var position = this.positionAfter(node.modifiers, node.functionKeyword);

        if (!this.hasModifier(node.modifiers, "export")) {
            currentScope.variables[variableName] = position;
        }

        super.visitFunctionDeclaration(node);
    }

    // check private member variables
    public visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): void {
        var modifiers = node.modifiers;

        // if no modifier is specified, the default is public, so skip the current declaration
        if (modifiers.childCount() === 0) {
            this.skipVariableDeclaration = true;
        }

        // if an explicit 'public' modifier is specified, skip the current declaration
        if (this.hasModifier(modifiers, "public")) {
            this.skipVariableDeclaration = true;
        }

        super.visitMemberVariableDeclaration(node);
        this.skipVariableDeclaration = false;
    }

    // check private member functions
    public visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): void {
        var modifiers = node.modifiers;
        var currentScope = this.getCurrentScope();
        var position = this.positionAfter(node.modifiers);

        if (this.hasModifier(modifiers, "private")) {
            currentScope.variables[node.propertyName.text()] = position;
        }

        super.visitMemberFunctionDeclaration(node);
    }

    public onScopeEnd() {
        var variables = this.getCurrentScope().variables;
        for (var variableName in variables) {
            if (variables.hasOwnProperty(variableName)) {
                var position = variables[variableName];
                this.validateReferencesForVariable(variableName, position);
            }
        }
    }

    private hasModifier(modifiers: TypeScript.ISyntaxElement, text: string) {
        for (var i = 0, n = modifiers.childCount(); i < n; i++) {
            var modifier = modifiers.childAt(i);
            if (modifier.isToken()) {
                var modifierText = (<TypeScript.ISyntaxToken> modifier).text();
                if (modifierText === text) {
                    return true;
                }
            }
        }

        return false;
    }

    private validateReferencesForVariable(name: string, position: number) {
        var references = this.languageServices.getReferencesAtPosition(this.fileName, position);
        if (references.length <= 1) {
            var failureString = Rule.FAILURE_STRING + "'" + name + "'";
            var failure = this.createFailure(position, name.length, failureString);
            this.addFailure(failure);
        }
    }
}

class ScopeInfo {
    public variables: { [name: string]: number; } = {};
}

class LanguageServiceHost extends TypeScript.NullLogger implements TypeScript.Services.ILanguageServiceHost {
    private syntaxTree: TypeScript.SyntaxTree;
    private source: string;

    constructor(syntaxTree: TypeScript.SyntaxTree, source: string) {
        super();
        this.syntaxTree = syntaxTree;
        this.source = source;
    }

    public getCompilationSettings() {
        return Lint.createCompilationSettings();
    }

    public getScriptFileNames() {
        return [ this.syntaxTree.fileName() ];
    }

    public getScriptVersion(fileName: string) {
        return 1;
    }

    public getScriptIsOpen(fileName: string) {
        return false;
    }

    public getScriptByteOrderMark(fileName: string) {
        return TypeScript.ByteOrderMark.None;
    }

    public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot {
        return TypeScript.ScriptSnapshot.fromString(this.source);
    }

    public getDiagnosticsObject() {
        return new LanguageServicesDiagnostics();
    }

    public getLocalizedDiagnosticMessages() {
        return "";
    }

    public resolveRelativePath(path: string, directory: string) {
        return path;
    }
    
    public fileExists(path: string) {
        return true;
    }

    public directoryExists(path: string) {
        return true;
    }
    
    public getParentDirectory(path: string) {
        return path;
    }
}

class LanguageServicesDiagnostics implements TypeScript.Services.ILanguageServicesDiagnostics {
    public log(content: string) {
        // do nothing
    }
}
