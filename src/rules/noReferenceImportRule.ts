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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { moduleDeclarationBody } from "../language/utils";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-reference-import",
        description: 'Don\'t <reference types="foo" /> if you import "foo" anyway.',
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
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    const { sourceFile } = ctx;
    if (sourceFile.typeReferenceDirectives.length === 0) {
        return;
    }

    const imports = allImports(sourceFile);
    for (const ref of sourceFile.typeReferenceDirectives) {
        if (imports.has(ref.fileName)) {
            ctx.addFailure(ref.pos, ref.end, Rule.FAILURE_STRING(ref.fileName));
        }
    }
}

function allImports(sourceFile: ts.SourceFile): Set<string> {
    const imports = new Set<string>();
    for (const statement of sourceFile.statements) {
        recur(statement);
    }
    return imports;

    function recur(node: ts.Statement): void {
        if (utils.isImportEqualsDeclaration(node)) {
            const ref = node.moduleReference;
            if (ref.kind === ts.SyntaxKind.ExternalModuleReference) {
                if (ref.expression) {
                    addImport(ref.expression);
                }
            }
        } else if (utils.isImportDeclaration(node)) {
            addImport(node.moduleSpecifier);
        } else if (utils.isModuleDeclaration(node)) {
            if (!sourceFile.isDeclarationFile) {
                // Can't be any imports in a module augmentation.
                return;
            }

            const body = moduleDeclarationBody(node);
            if (body) {
                for (const statement of body.statements) {
                    recur(statement);
                }
            }
        }
    }

    function addImport(moduleReference: ts.Expression): void {
        if (utils.isStringLiteral(moduleReference)) {
            imports.add(moduleReference.text);
        }
    }
}
