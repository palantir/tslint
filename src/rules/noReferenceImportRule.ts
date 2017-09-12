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

import { isImportDeclaration, isImportEqualsDeclaration, isModuleDeclaration, isStringLiteral } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-reference-import",
        description: 'Don\'t `<reference types="foo" />` if you import `foo` anyway.',
        optionsDescription: "Not configurable.",
        options: null,
        type: "style",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(moduleReference: string): string {
        return `No need to reference "${moduleReference}", since it is imported.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoReferenceImportWalker(sourceFile, this.ruleName, undefined));
    }
}

class NoReferenceImportWalker extends Lint.AbstractWalker<void> {
    private readonly imports = new Set<string>();
    public walk(sourceFile: ts.SourceFile) {
        if (sourceFile.typeReferenceDirectives.length === 0) {
            return;
        }
        this.findImports(sourceFile.statements);
        for (const ref of sourceFile.typeReferenceDirectives) {
            if (this.imports.has(ref.fileName)) {
                this.addFailure(ref.pos, ref.end, Rule.FAILURE_STRING(ref.fileName));
            }
        }
    }

    private findImports(statements: ReadonlyArray<ts.Statement>) {
        for (const statement of statements) {
            if (isImportDeclaration(statement)) {
                this.addImport(statement.moduleSpecifier);
            } else if (isImportEqualsDeclaration(statement)) {
                if (statement.moduleReference.kind === ts.SyntaxKind.ExternalModuleReference &&
                    statement.moduleReference.expression !== undefined) {
                    this.addImport(statement.moduleReference.expression);
                }
            } else if (isModuleDeclaration(statement) && statement.body !== undefined && this.sourceFile.isDeclarationFile) {
                // There can't be any imports in a module augmentation or namespace
                this.findImportsInModule(statement.body);
            }
        }
    }

    private findImportsInModule(body: ts.ModuleBody): void {
        if (body.kind === ts.SyntaxKind.ModuleBlock) {
            return this.findImports(body.statements);
        } else if (body.kind === ts.SyntaxKind.ModuleDeclaration && body.body !== undefined) {
            return this.findImportsInModule(body.body);
        }
    }

    private addImport(specifier: ts.Expression) {
        if (isStringLiteral(specifier)) {
            this.imports.add(specifier.text);
        }
    }
}
