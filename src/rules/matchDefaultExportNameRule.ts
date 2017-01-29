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

import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "match-default-export-name",
        description: Lint.Utils.dedent`
            Requires that a default import have the same name as the declaration it imports.
            Does nothing for anonymous default exports.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(importName: string, exportName: string): string {
        return `Expected import '${importName}' to match the default export '${exportName}'.`;
    }

    public applyWithProgram(sourceFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), langSvc.getProgram()));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {
    public visitSourceFile(node: ts.SourceFile) {
        for (const statement of node.statements) {
            if (statement.kind !== ts.SyntaxKind.ImportDeclaration) {
                continue;
            }

            const { importClause } = statement as ts.ImportDeclaration;
            if (importClause && importClause.name) {
                this.checkDefaultImport(importClause.name);
            }
        }
    }

    private checkDefaultImport(defaultImport: ts.Identifier) {
        const { declarations } = this.getTypeChecker().getAliasedSymbol(
            this.getTypeChecker().getSymbolAtLocation(defaultImport));
        const name = declarations && declarations[0] && declarations[0].name;
        if (name && name.kind === ts.SyntaxKind.Identifier && defaultImport.text !== name.text) {
            this.addFailureAtNode(defaultImport, Rule.FAILURE_STRING(defaultImport.text, name.text));
        }
    }
}
