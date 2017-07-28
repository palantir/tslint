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

    public static GROUPED_IMPORTS =
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
    statement: ts.ImportDeclaration;
    type: ImportStatementType;
    lineStart: number;
    lineEnd: number;
}

class Walker extends Lint.AbstractWalker<Lint.IOptions> {
    private previousImportStatement: ImportStatement | undefined;

    public walk(sourceFile: ts.SourceFile): void {
        const importsStatements = sourceFile.statements
            .filter(isImportDeclaration)
            .map(this.toImportStatement);
        const firstFailure = importsStatements.find(this.isBadlyPositioned);
        if (firstFailure != null) {
            const fix = this.createFix(importsStatements);
            this.addFailureAtNode(firstFailure.statement, Rule.GROUPED_IMPORTS, fix);
        }
    }

    private isBadlyPositioned = (importStatement: ImportStatement): boolean => {
        if (this.previousImportStatement != null) {
            if (importStatement.type === this.previousImportStatement.type) {
                if (importStatement.lineStart !== this.previousImportStatement.lineEnd + 1) {
                    return true;
                }
            } else {
                if (importStatement.type < this.previousImportStatement.type) {
                    return true;
                } else if (importStatement.lineStart !== this.previousImportStatement.lineEnd + 2) {
                    return true;
                }
            }
        }
        this.previousImportStatement = importStatement;
        return false;
    }

    private toImportStatement = (statement: ts.ImportDeclaration): ImportStatement => {
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

    private createFix(importStatements: ImportStatement[]): Lint.Fix {
        const newLine = this.getEofChar(this.sourceFile);
        const imports = this.getOrderedImports(importStatements);
        const addition = Lint.Replacement.appendText(0, imports.join(newLine));
        const deletions = importStatements.map((imp) => {
            const [start, end] = this.getRangeIncludingWhitespace(imp.statement);
            return Lint.Replacement.deleteFromTo(start, end);
        });
        return [...deletions, addition];
    }

    private getOrderedImports(importStatements: ImportStatement[]): string[] {
        const libs = importStatements.filter((imp) => imp.type === ImportStatementType.LIBRARY_IMPORT);
        const parent = importStatements.filter((imp) => imp.type === ImportStatementType.PARENT_DIRECTORY_IMPORT);
        const current = importStatements.filter((imp) => imp.type === ImportStatementType.CURRENT_DIRECTORY_IMPORT);
        return [libs, parent, current].reduce((arr, imps) => {
            if (imps.length == 0) {
                return arr;
            }
            return arr.concat(imps.map((imp) => imp.statement.getText()), "");
        }, [] as string[]).concat("");
    }

    private getRangeIncludingWhitespace(statement: ts.ImportDeclaration): [number, number] {
        const text = this.sourceFile.text;
        let start = statement.getStart();
        while (this.isWhiteSpaceChar(text[start - 1])) {
            start--;
        }
        let end = statement.getEnd();
        while (this.isWhiteSpaceChar(text[end + 1])) {
            end++;
        }
        return [start, end];
    }

    private isWhiteSpaceChar(char: string | undefined): boolean {
        return char === undefined ? false : Lint.isWhiteSpace(char.charCodeAt(0));
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
}
