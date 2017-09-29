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

import { isImportDeclaration, isModuleDeclaration, isTextualLiteral } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-duplicate-imports",
        description: Lint.Utils.dedent`
            Disallows multiple import statements from the same module.`,
        rationale: Lint.Utils.dedent`
            Using a single import statement per module will make the code clearer because you can see everything being imported
            from that module on one line.`,
        optionsDescription: "Not configurable",
        options: null,
        optionExamples: [true],
        type: "maintainability",
        typescriptOnly: false,
    };

    public static FAILURE_STRING(module: string) {
        return `Multiple imports from '${module}' can be combined into one.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDuplicateImportsWalker(sourceFile, this.ruleName, undefined));
    }
}

class NoDuplicateImportsWalker extends Lint.AbstractWalker<void> {
    private seenImports = new Set<string>();

    public walk(sourceFile: ts.SourceFile) {
        this.checkStatements(sourceFile.statements);
    }

    private checkStatements(statements: ts.NodeArray<ts.Statement>) {
        for (const statement of statements) {
            if (isImportDeclaration(statement)) {
                this.checkImport(statement);
            } else if (this.sourceFile.isDeclarationFile && isModuleDeclaration(statement) &&
                statement.body !== undefined && statement.name.kind === ts.SyntaxKind.StringLiteral) {
                // module augmentations in declaration files can contain imports
                this.checkStatements((statement.body as ts.ModuleBlock).statements);
            }
        }
    }

    private checkImport(statement: ts.ImportDeclaration) {
        if (isTextualLiteral(statement.moduleSpecifier)) {
            if (this.seenImports.has(statement.moduleSpecifier.text)) {
                return this.addFailureAtNode(statement, Rule.FAILURE_STRING(statement.moduleSpecifier.text));
            }
            this.seenImports.add(statement.moduleSpecifier.text);
        }
    }
}
