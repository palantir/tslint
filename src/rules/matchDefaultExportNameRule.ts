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

import { isImportDeclaration, isSymbolFlagSet } from "tsutils";
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
        optionExamples: [true],
        type: "style",
        typescriptOnly: true,
        requiresTypeInfo: true
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(importName: string, exportName: string): string {
        return `Expected import '${importName}' to match the default export '${exportName}'.`;
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(ctx: Lint.WalkContext<void>, tc: ts.TypeChecker) {
    for (const statement of ctx.sourceFile.statements) {
        if (
            !isImportDeclaration(statement) ||
            statement.importClause === undefined ||
            statement.importClause.name === undefined
        ) {
            continue;
        }
        const defaultImport = statement.importClause.name;
        const symbol = tc.getSymbolAtLocation(defaultImport);
        if (symbol === undefined || !isSymbolFlagSet(symbol, ts.SymbolFlags.Alias)) {
            continue;
        }

        const { declarations } = tc.getAliasedSymbol(symbol);
        if (declarations !== undefined && declarations.length !== 0) {
            const { name } = declarations[0] as ts.NamedDeclaration;
            if (
                name !== undefined &&
                name.kind === ts.SyntaxKind.Identifier &&
                name.text !== defaultImport.text
            ) {
                ctx.addFailureAtNode(
                    defaultImport,
                    Rule.FAILURE_STRING(defaultImport.text, name.text)
                );
            }
        }
    }
}
