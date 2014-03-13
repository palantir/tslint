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
    public static FAILURE_STRING_PREFIX = "variable '";
    public static FAILURE_STRING_POSTFIX = "' used before declaration";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        var languageServiceHost = new Lint.LanguageServiceHost(syntaxTree, syntaxTree.sourceUnit().fullText());
        var languageServices = new TypeScript.Services.LanguageService(languageServiceHost);

        return this.applyWithWalker(new NoUseBeforeDeclareWalker(syntaxTree, this.getOptions(), languageServices));
    }
}

class NoUseBeforeDeclareWalker extends Lint.RuleWalker {
    private fileName: string;
    private languageServices: TypeScript.Services.LanguageService;
    private classStartPosition: number;

    constructor(syntaxTree: TypeScript.SyntaxTree, options: Lint.IOptions, languageServices: TypeScript.Services.LanguageService) {
        super(syntaxTree, options);
        this.fileName = syntaxTree.fileName();
        this.languageServices = languageServices;
        this.classStartPosition = 0;
    }

    public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): void {
        this.classStartPosition = this.position(); // class variables used before the class is declared are fine
        super.visitClassDeclaration(node);
        this.classStartPosition = 0; // reset to beginning of file
    }

    public visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): void {
        var position = this.positionAfter(node.importKeyword);
        this.validateUsageForVariable(node.identifier.text(), position);
        super.visitImportDeclaration(node);
    }

    public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
        var position = this.position() + node.propertyName.leadingTriviaWidth();
        this.validateUsageForVariable(node.propertyName.text(), position);
        super.visitVariableDeclarator(node);
    }

    private validateUsageForVariable(name: string, position: number) {
        var references = this.languageServices.getReferencesAtPosition(this.fileName, position);
        references.forEach((reference) => {
            var referencePosition = reference.minChar;
            if (this.classStartPosition <= referencePosition && referencePosition < position) {
                var failureString = Rule.FAILURE_STRING_PREFIX + name + Rule.FAILURE_STRING_POSTFIX;
                var failure = this.createFailure(referencePosition, name.length, failureString);
                this.addFailure(failure);
            }
        });
    }
}
