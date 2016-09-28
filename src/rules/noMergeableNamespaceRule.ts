/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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
        ruleName: "no-mergeable-namespace",
        description: "Disallows mergeable namespaces in the same file.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "maintainability",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static failureStringFactory(identifier: string, locationToMerge: ts.LineAndCharacter): string {
        return `Mergeable namespace ${identifier} found. Merge its contents with the namespace on line ${locationToMerge.line}.`;
    }

    public apply(sourceFile: ts.SourceFile, languageService: ts.LanguageService): Lint.RuleFailure[] {
        const noMergeableNamespaceWalker = new NoMergeableNamespaceWalker(sourceFile, this.getOptions(), languageService);
        return this.applyWithWalker(noMergeableNamespaceWalker);
    }
}

class NoMergeableNamespaceWalker extends Lint.RuleWalker {
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, private languageService: ts.LanguageService) {
        super(sourceFile, options);
    }

    public visitModuleDeclaration(node: ts.ModuleDeclaration) {
        if (Lint.isNodeFlagSet(node, ts.NodeFlags.Namespace)
            && node.name.kind === ts.SyntaxKind.Identifier) {
            this.validateReferencesForNamespace((<ts.Identifier> node.name).text, node.name.getStart());
        }
        super.visitModuleDeclaration(node);
    }

    private validateReferencesForNamespace(name: string, position: number) {
        const { fileName } = this.getSourceFile();
        const highlights = this.languageService.getDocumentHighlights(fileName, position, [fileName]);

        if (highlights == null || highlights[0].highlightSpans.length > 1) {
            const failureString = Rule.failureStringFactory(name, this.findLocationToMerge(position, highlights[0].highlightSpans));
            this.addFailure(this.createFailure(position, name.length, failureString));
        }
    }

    private findLocationToMerge(currentPosition: number, highlightSpans: ts.HighlightSpan[]): ts.LineAndCharacter {
        const { line } = ts.getLineAndCharacterOfPosition(this.getSourceFile(), currentPosition);

        for (const span of highlightSpans) {
            const lineAndCharacter = ts.getLineAndCharacterOfPosition(this.getSourceFile(), span.textSpan.start);
            if (lineAndCharacter.line !== line) {
                return lineAndCharacter;
            }
        }
    }
}
