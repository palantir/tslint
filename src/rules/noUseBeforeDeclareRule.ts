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

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-use-before-declare",
        description: "Disallows usage of variables before their declaration.",
        descriptionDetails: Lint.Utils.dedent`
            This rule is primarily useful when using the \`var\` keyword -
            the compiler will detect if a \`let\` and \`const\` variable is used before it is declared.`,
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_PREFIX = "variable '";
    public static FAILURE_STRING_POSTFIX = "' used before declaration";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const languageService = Lint.createLanguageService(sourceFile.fileName, sourceFile.getFullText());
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

    public visitBindingElement(node: ts.BindingElement) {
        const isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;
        const isBlockScoped = Lint.isBlockScopedBindingElement(node);

        // use-before-declare errors for block-scoped vars are caught by tsc
        if (isSingleVariable && !isBlockScoped) {
            const variableName = (<ts.Identifier> node.name).text;
            this.validateUsageForVariable(variableName, node.name.getStart());
        }

        super.visitBindingElement(node);
    }

    public visitImportDeclaration(node: ts.ImportDeclaration) {
        const importClause = node.importClause;

        // named imports & namespace imports handled by other walker methods
        // importClause will be null for bare imports
        if (importClause != null && importClause.name != null) {
            const variableIdentifier = importClause.name;
            this.validateUsageForVariable(variableIdentifier.text, variableIdentifier.getStart());
        }

        super.visitImportDeclaration(node);
    }

    public visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        const name = <ts.Identifier> node.name;
        this.validateUsageForVariable(name.text, name.getStart());

        super.visitImportEqualsDeclaration(node);
    }

    public visitNamedImports(node: ts.NamedImports) {
        for (let namedImport of node.elements) {
            this.validateUsageForVariable(namedImport.name.text, namedImport.name.getStart());
        }
        super.visitNamedImports(node);
    }

    public visitNamespaceImport(node: ts.NamespaceImport) {
        this.validateUsageForVariable(node.name.text, node.name.getStart());
        super.visitNamespaceImport(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        const isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;
        const variableName = (<ts.Identifier> node.name).text;
        const currentScope = this.getCurrentScope();

        // only validate on the first variable declaration within the current scope
        if (isSingleVariable && currentScope[variableName] == null) {
            this.validateUsageForVariable(variableName, node.getStart());
        }

        currentScope[variableName] = true;
        super.visitVariableDeclaration(node);
    }

    private validateUsageForVariable(name: string, position: number) {
        const fileName = this.getSourceFile().fileName;
        const highlights = this.languageService.getDocumentHighlights(fileName, position, [fileName]);
        if (highlights != null) {
            for (let highlight of highlights) {
                for (let highlightSpan of highlight.highlightSpans) {
                    const referencePosition = highlightSpan.textSpan.start;
                    if (referencePosition < position) {
                        const failureString = Rule.FAILURE_STRING_PREFIX + name + Rule.FAILURE_STRING_POSTFIX;
                        this.addFailure(this.createFailure(referencePosition, name.length, failureString));
                    }
                }
            }
        }
    }
}
