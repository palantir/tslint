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
import { isImportDeclaration } from "tsutils";
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
    PARENT_DIRECTORY_IMPORT = 2,
    CURRENT_DIRECTORY_IMPORT = 3,
}

interface ImportStatement {
    statement: ts.Statement;
    type: ImportStatementType;
    lineStart: number;
    lineEnd: number;
}

class Walker extends Lint.AbstractWalker<Lint.IOptions> {
    private lastImportStatement: ImportStatement;

    private static getImportStatementType(statement: ts.Statement): ImportStatementType {
        const path = Walker.getImportPath(statement);
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

    private static getImportPath(statement: ts.Statement): string {
        const str = statement.getText();
        let index;
        let lastIndex;
        index = str.indexOf("'");
        if (index > 0) {
            lastIndex = str.lastIndexOf("'");
        } else {
            index = str.indexOf("\"");
            lastIndex = str.lastIndexOf("\"");
        }
        if (index < 0 || lastIndex < 0) {
            throw new Error(`Unable to extract path from import statement \`${statement.getText()}\``);
        }
        return str.substring(index + 1, lastIndex);
    }

    public walk(sourceFile: ts.SourceFile): void {
        sourceFile.statements
            .filter(isImportDeclaration)
            .forEach((st) => this.checkStatement(st));
    }

    private toImportStatement(statement: ts.Statement): ImportStatement {
        return {
            lineEnd: this.sourceFile.getLineAndCharacterOfPosition(statement.getEnd()).line,
            lineStart: this.sourceFile.getLineAndCharacterOfPosition(statement.getStart()).line,
            statement,
            type: Walker.getImportStatementType(statement),
        };
    }

    private checkStatement(statement: ts.Statement): void {
        const importStatement = this.toImportStatement(statement);
        if (this.lastImportStatement) {
            this.checkImportStatement(importStatement);
        }
        this.lastImportStatement = importStatement;
    }

    private checkImportStatement(importStatement: ImportStatement) {
        if (importStatement.type === this.lastImportStatement.type) {
            if (importStatement.lineStart !== this.lastImportStatement.lineEnd + 1) {
                const replacement = Lint.Replacement.deleteFromTo(
                    this.lastImportStatement.statement.getEnd() + 1, importStatement.statement.getStart());
                this.addFailureAtNode(importStatement.statement, Rule.IMPORT_SOURCES_SEPARATED, replacement);
            }
        } else if (importStatement.type.valueOf() < this.lastImportStatement.type.valueOf()) {
            this.addFailureAtNode(importStatement.statement, Rule.IMPORT_SOURCES_ORDER, this.getAllImportsFix());
        } else {
            if (importStatement.lineStart !== this.lastImportStatement.lineEnd + 2) {
                const replacement = Lint.Replacement.appendText(importStatement.statement.getStart(), ts.sys.newLine);
                this.addFailureAtNode(importStatement.statement, Rule.IMPORT_SOURCES_NOT_SEPARATED, replacement);
            }
        }
    }

    private getAllImportsFix(): Lint.Fix {
        const importStatements = this.sourceFile.statements.filter(isImportDeclaration);
        const libs = importStatements.filter((st) => Walker.getImportStatementType(st) === ImportStatementType.LIBRARY_IMPORT);
        const parent = importStatements.filter((st) => Walker.getImportStatementType(st) === ImportStatementType.PARENT_DIRECTORY_IMPORT);
        const current = importStatements.filter((st) => Walker.getImportStatementType(st) === ImportStatementType.CURRENT_DIRECTORY_IMPORT);
        let imports: string[] = [];
        [libs, parent, current].forEach((statements) => {
            if (statements.length) {
                imports = imports.concat(statements.map((st) => st.getText()));
                imports.push("");
            }
        });
        return Lint.Replacement.replaceFromTo(
            importStatements[0].getStart(),
            importStatements[importStatements.length - 1].getEnd(),
            imports.join(ts.sys.newLine),
        );
    }
}
