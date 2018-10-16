/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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

import { getChildOfKind, isImportDeclaration, isNamespaceImport } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const LINE_BREAK_REGEX = /\r?\n/;

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "import-spacing",
        description: "Ensures proper spacing between import statement keywords",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "style",
        typescriptOnly: false
    };

    public static ADD_SPACE_AFTER_IMPORT = "Add space after 'import'";
    public static TOO_MANY_SPACES_AFTER_IMPORT = "Too many spaces after 'import'";
    public static ADD_SPACE_AFTER_STAR = "Add space after '*'";
    public static TOO_MANY_SPACES_AFTER_STAR = "Too many spaces after '*'";
    public static ADD_SPACE_AFTER_FROM = "Add space after 'from'";
    public static TOO_MANY_SPACES_AFTER_FROM = "Too many spaces after 'from'";
    public static ADD_SPACE_BEFORE_FROM = "Add space before 'from'";
    public static TOO_MANY_SPACES_BEFORE_FROM = "Too many spaces before 'from'";
    public static NO_LINE_BREAKS = "Line breaks are not allowed in import declaration";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.ruleName, undefined));
    }
}

class Walker extends Lint.AbstractWalker<void> {
    public walk({ statements }: ts.SourceFile): void {
        for (const statement of statements) {
            if (!isImportDeclaration(statement)) {
                continue;
            }

            const { importClause } = statement;
            if (importClause === undefined) {
                this.checkModuleWithSideEffect(statement);
            } else {
                this.checkImportClause(statement, importClause);
                const { namedBindings } = importClause;
                if (namedBindings !== undefined && isNamespaceImport(namedBindings)) {
                    this.checkNamespaceImport(namedBindings);
                }
            }
        }
    }

    private checkImportClause(node: ts.ImportDeclaration, importClause: ts.ImportClause): void {
        const text = node.getText(this.sourceFile);
        const nodeStart = node.getStart(this.sourceFile);
        const importKeywordEnd = nodeStart + "import".length;
        const moduleSpecifierStart = node.moduleSpecifier.getStart(this.sourceFile);
        const importClauseEnd = importClause.getEnd();
        const importClauseStart = importClause.getStart(this.sourceFile);

        if (importKeywordEnd === importClauseStart) {
            this.addFailureAt(nodeStart, "import".length, Rule.ADD_SPACE_AFTER_IMPORT);
        } else if (importClauseStart > importKeywordEnd + 1) {
            this.addFailure(nodeStart, importClauseStart, Rule.TOO_MANY_SPACES_AFTER_IMPORT);
        }

        const fromString = text.substring(
            importClauseEnd - nodeStart,
            moduleSpecifierStart - nodeStart
        );

        if (/from$/.test(fromString)) {
            this.addFailureAt(importClauseEnd, fromString.length, Rule.ADD_SPACE_AFTER_FROM);
        } else if (/from\s{2,}$/.test(fromString)) {
            this.addFailureAt(importClauseEnd, fromString.length, Rule.TOO_MANY_SPACES_AFTER_FROM);
        }

        if (/^\s{2,}from/.test(fromString)) {
            this.addFailureAt(importClauseEnd, fromString.length, Rule.TOO_MANY_SPACES_BEFORE_FROM);
        } else if (/^from/.test(fromString)) {
            this.addFailureAt(importClauseEnd, fromString.length, Rule.ADD_SPACE_BEFORE_FROM);
        }

        const beforeImportClauseText = text.substring(0, importClauseStart - nodeStart);
        const afterImportClauseText = text.substring(importClauseEnd - nodeStart);
        if (LINE_BREAK_REGEX.test(beforeImportClauseText)) {
            this.addFailure(nodeStart, importClauseStart - 1, Rule.NO_LINE_BREAKS);
        }
        if (LINE_BREAK_REGEX.test(afterImportClauseText)) {
            this.addFailure(importClauseEnd, node.getEnd(), Rule.NO_LINE_BREAKS);
        }
    }

    private checkNamespaceImport(node: ts.NamespaceImport): void {
        const text = node.getText(this.sourceFile);
        if (text.indexOf("*as") > -1) {
            this.addFailureAtNode(node, Rule.ADD_SPACE_AFTER_STAR);
        } else if (/\*\s{2,}as/.test(text)) {
            this.addFailureAtNode(node, Rule.TOO_MANY_SPACES_AFTER_STAR);
        } else if (LINE_BREAK_REGEX.test(text)) {
            this.addFailureAtNode(node, Rule.NO_LINE_BREAKS);
        }
    }

    private checkModuleWithSideEffect(node: ts.ImportDeclaration): void {
        const nodeStart = node.getStart(this.sourceFile);
        const moduleSpecifierStart = node.moduleSpecifier.getStart(this.sourceFile);

        if (nodeStart + "import".length + 1 < moduleSpecifierStart) {
            this.addFailure(nodeStart, moduleSpecifierStart, Rule.TOO_MANY_SPACES_AFTER_IMPORT);
        } else if (nodeStart + "import".length === moduleSpecifierStart) {
            this.addFailureAtNode(
                getChildOfKind(node, ts.SyntaxKind.ImportKeyword, this.sourceFile)!,
                Rule.ADD_SPACE_AFTER_IMPORT
            );
        }

        if (LINE_BREAK_REGEX.test(node.getText())) {
            this.addFailureAtNode(node, Rule.NO_LINE_BREAKS);
        }
    }
}
