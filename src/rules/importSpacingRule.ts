/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "import-spacing",
        description: "Ensures proper spacing between import statement keywords",
        optionsDescription: "",
        options: {},
        optionExamples: [],
        type: "style",
        typescriptOnly: false,
    };

    public static TOO_MANY_SPACES_AFTER_IMPORT = "Too many spaces after import";
    public static ADD_SPACE_AFTER_IMPORT = "Add space after import";
    public static TOO_MANY_SPACES_AFTER_STAR = "Too many spaces after *";
    public static ADD_SPACE_AFTER_STAR = "Add space after *";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const comparisonWalker = new ImportStatementWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(comparisonWalker);
    }
}

class ImportStatementWalker extends Lint.RuleWalker {
    private static IMPORT_KEYWORD_LENGTH = "import".length;

    public visitImportDeclaration(node: ts.ImportDeclaration) {
        const importKeywordEnd = node.getStart() + ImportStatementWalker.IMPORT_KEYWORD_LENGTH;
        const importClauseStart = node.importClause.getStart();
        if (importKeywordEnd === importClauseStart) {
            this.addFailure(this.createFailure(node.getStart(), ImportStatementWalker.IMPORT_KEYWORD_LENGTH, Rule.ADD_SPACE_AFTER_IMPORT));
        } else if (importClauseStart > (importKeywordEnd + 1)) {
            this.addFailure(this.createFailure(node.getStart(), importClauseStart - node.getStart(), Rule.TOO_MANY_SPACES_AFTER_IMPORT));
        }
        super.visitImportDeclaration(node);
    }

    public visitNamespaceImport(node: ts.NamespaceImport) {
        const text = node.getText();
        if (text.indexOf("*as") > -1) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.ADD_SPACE_AFTER_STAR));
        } else if (/\*\s{2,}as/.test(text)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.TOO_MANY_SPACES_AFTER_STAR));
        }
        super.visitNamespaceImport(node);
    }
}
