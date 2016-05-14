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
    public static FAILURE_STRING = "mergeable namespace: ";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const languageService = Lint.createLanguageService(sourceFile.fileName, sourceFile.getFullText());
        const mergeableNamespaceWalker = new MergeableNamespaceWalker(sourceFile, this.getOptions(), languageService);
        return this.applyWithWalker(mergeableNamespaceWalker);
    }
}

class MergeableNamespaceWalker extends Lint.RuleWalker {
   private languageService: ts.LanguageService;

   constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, languageService: ts.LanguageService) {
        super(sourceFile, options);
        this.languageService = languageService;
    }

   public visitModuleDeclaration(node: ts.ModuleDeclaration) {
        if (Lint.isNodeFlagSet(node, ts.NodeFlags.Namespace)
            && node.name.kind === ts.SyntaxKind.Identifier) {
            this.validateReferencesForNamespace((<ts.Identifier> node.name).text, node.name.getStart());
        }
        super.visitModuleDeclaration(node);
    }

    private validateReferencesForNamespace(name: string, position: number) {
        const fileName = this.getSourceFile().fileName;
        const highlights = this.languageService.getDocumentHighlights(fileName, position, [fileName]);
        if ((highlights == null || highlights[0].highlightSpans.length > 1)) {
            this.addFailure(this.createFailure(position, name.length, `${Rule.FAILURE_STRING}'${name}'`));
        }
    }
}
