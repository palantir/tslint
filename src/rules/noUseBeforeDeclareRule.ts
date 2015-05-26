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

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING_PREFIX = "variable '";
    public static FAILURE_STRING_POSTFIX = "' used before declaration";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost("file.ts", sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);

        return this.applyWithWalker(new NoUseBeforeDeclareWalker(sourceFile, this.getOptions(), languageService));
    }
}

type VisitedVariables = {[varName: string]: boolean};

class NoUseBeforeDeclareWalker extends Lint.ScopeAwareRuleWalker<VisitedVariables> {
    private languageService: ts.LanguageService;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, languageService: ts.LanguageService) {
        super(sourceFile, options);
        this.languageService = languageService;
    }

    public createScope(): VisitedVariables {
        return {};
    }

    public visitImportDeclaration(node: ts.ImportDeclaration): void {
        if (node.importClause != null) {
            var importClause = node.importClause;

            // named imports & namespace imports handled by other walker methods
            if (importClause.name != null) {
                var variableIdentifier = importClause.name;
                this.validateUsageForVariable(variableIdentifier.text, variableIdentifier.getStart());
            }
        }

        super.visitImportDeclaration(node);
    }

    public visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration): void {
        var name = <ts.Identifier> node.name;
        this.validateUsageForVariable(name.text, name.getStart());

        super.visitImportEqualsDeclaration(node);
    }

    public visitNamedImports(node: ts.NamedImports): void {
        node.elements.forEach((namedImport: ts.ImportSpecifier) => {
            this.validateUsageForVariable(namedImport.name.text, namedImport.name.getStart());
        });
        super.visitNamedImports(node);
    }

    public visitNamespaceImport(node: ts.NamespaceImport): void {
        this.validateUsageForVariable(node.name.text, node.name.getStart());
        super.visitNamespaceImport(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration): void {
        var isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;
        var nameNode = <ts.Identifier> node.name;
        var variableName = nameNode.text;
        var currentScope = this.getCurrentScope();

        // only validate on the first variable declaration within the current scope
        if (currentScope[variableName] == null) {
            this.validateUsageForVariable(variableName, node.getStart());
        }

        currentScope[variableName] = true;
        super.visitVariableDeclaration(node);
    }

    private validateUsageForVariable(name: string, position: number) {
        var highlights = this.languageService.getDocumentHighlights("file.ts", position, ["file.ts"]);
        if (highlights) {
            highlights.forEach((highlight) => {
                highlight.highlightSpans.forEach((highlightSpan) => {
                    var referencePosition = highlightSpan.textSpan.start;
                    if (referencePosition < position) {
                        var failureString = Rule.FAILURE_STRING_PREFIX + name + Rule.FAILURE_STRING_POSTFIX;
                        this.addFailure(this.createFailure(referencePosition, name.length, failureString));
                    }
                });
            });
        }
    }
}
