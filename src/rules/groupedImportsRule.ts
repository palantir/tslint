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

import * as Lint from "tslint";
import { isImportDeclaration, isTextualLiteral } from "tsutils";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "grouped-imports",
        description: "Separate import groups by blank lines.",
        rationale: "Keeps a clear overview on dependencies.",
        optionsDescription: "Not configurable.",
        hasFix: true,
        options: {},
        optionExamples: [true],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static IMPORT_SOURCES_SEPARATED = "Import sources within a group must not be separated by blank lines";
    public static IMPORT_SOURCES_NOT_SEPARATED =
        "Import sources of different groups must be separated by a single blank line";
    public static IMPORT_SOURCES_ORDER =
        "Import sources of different groups must be sorted by: libraries, parent directories, current directory";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.ruleName, this.getOptions()));
    }
}

enum ImportStatementType {
    LIBRARY_IMPORT = 1,
    PARENT_DIRECTORY_IMPORT = 2, // starts with "../"
    CURRENT_DIRECTORY_IMPORT = 3, // starts with "./"
}

interface ImportStatement {
    statement: ts.Statement;
    type: ImportStatementType;
    lineStart: number;
    lineEnd: number;
}

class Walker extends Lint.AbstractWalker<Lint.IOptions> {
    private lastImportStatement: ImportStatement;
    private newLine: string;
    private allImportsFix: boolean;

    public walk(sourceFile: ts.SourceFile): void {
        this.newLine = this.getEofChar(sourceFile);
        sourceFile.statements
            .filter(isImportDeclaration)
            .forEach(this.checkStatement);
    }

    private getEofChar(sourceFile: ts.SourceFile): string {
        const lineEnd = sourceFile.getLineEndOfPosition(0);
        let newLine;
        if (lineEnd > 0) {
            if (lineEnd > 1 && sourceFile.text[lineEnd - 1] === "\r") {
                newLine = "\r\n";
            } else if (sourceFile.text[lineEnd] === "\n") {
                newLine = "\n";
            }
        }
        return newLine == null ? ts.sys.newLine : newLine;
    }

    private checkStatement = (statement: ts.ImportDeclaration): void => {
        if (this.allImportsFix) {
            return;
        }
        const importStatement = this.toImportStatement(statement);
        if (this.lastImportStatement != null) {
            this.checkForFailure(importStatement);
        }
        this.lastImportStatement = importStatement;
    }

    private toImportStatement(statement: ts.ImportDeclaration): ImportStatement {
        return {
            lineEnd: this.sourceFile.getLineAndCharacterOfPosition(statement.getEnd()).line,
            lineStart: this.sourceFile.getLineAndCharacterOfPosition(statement.getStart()).line,
            statement,
            type: this.getImportStatementType(statement),
        };
    }

    private getImportStatementType(statement: ts.ImportDeclaration): ImportStatementType {
        const path = this.getImportPath(statement);
        if (path.charAt(0) === ".") {
            if (path.charAt(1) === ".") {
                return ImportStatementType.PARENT_DIRECTORY_IMPORT;
            } else {
                return ImportStatementType.CURRENT_DIRECTORY_IMPORT;
            }
        } else {
            return ImportStatementType.LIBRARY_IMPORT;
        }
    }

    private getImportPath(statement: ts.ImportDeclaration): string {
        if (isTextualLiteral(statement.moduleSpecifier)) {
            return statement.moduleSpecifier.text;
        }
        return "";
    }

    private checkForFailure(importStatement: ImportStatement): void {
        if (importStatement.type === this.lastImportStatement.type) {
            if (importStatement.lineStart !== this.lastImportStatement.lineEnd + 1) {
                this.addSeparatedImportsFailure(importStatement);
            }
        } else {
            if (importStatement.type < this.lastImportStatement.type) {
                this.addIncorrectlyOrderedImportsFailure(importStatement);
            } else if (importStatement.lineStart !== this.lastImportStatement.lineEnd + 2) {
                this.addNotSeparatedImportsFailure(importStatement);
            }
        }
    }

    private addSeparatedImportsFailure(importStatement: ImportStatement): void {
        const text = [this.lastImportStatement, importStatement]
            .map((st) => st.statement.getText())
            .join(this.newLine);
        const replacement = Lint.Replacement.replaceFromTo(
            this.lastImportStatement.statement.getStart(), importStatement.statement.getEnd(), text);
        this.addFailureAtNode(importStatement.statement, Rule.IMPORT_SOURCES_SEPARATED, replacement);
    }

    private addIncorrectlyOrderedImportsFailure(importStatement: ImportStatement): void {
        this.allImportsFix = true;
        this.failures.length = 0;
        this.addFailureAtNode(importStatement.statement, Rule.IMPORT_SOURCES_ORDER, this.getAllImportsFix());
    }

    private addNotSeparatedImportsFailure(importStatement: ImportStatement): void {
        const replacement = Lint.Replacement.replaceFromTo(this.lastImportStatement.statement.getEnd(),
            importStatement.statement.getStart(), this.newLine + this.newLine);
        this.addFailureAtNode(importStatement.statement, Rule.IMPORT_SOURCES_NOT_SEPARATED, replacement);
    }

    private getAllImportsFix(): Lint.Fix {
        const importStatements = this.sourceFile.statements.filter(isImportDeclaration);
        const libs = importStatements.filter(
            (st) => this.getImportStatementType(st) === ImportStatementType.LIBRARY_IMPORT);
        const parent = importStatements.filter(
            (st) => this.getImportStatementType(st) === ImportStatementType.PARENT_DIRECTORY_IMPORT);
        const current = importStatements.filter(
            (st) => this.getImportStatementType(st) === ImportStatementType.CURRENT_DIRECTORY_IMPORT);
        let imports: string[] = [];
        [libs, parent, current].forEach((statements) => {
            if (statements.length > 0) {
                imports = imports.concat(statements.map((st) => st.getText()));
                imports.push("");
            }
        });
        return Lint.Replacement.replaceFromTo(
            importStatements[0].getStart(),
            importStatements[importStatements.length - 1].getEnd(),
            imports.join(this.newLine),
        );
    }
}
