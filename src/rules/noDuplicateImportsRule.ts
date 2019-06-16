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

import {
    isImportDeclaration,
    isLiteralExpression,
    isModuleDeclaration,
    isNamespaceImport,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS = "allow-namespace-imports";

interface RuleOptions {
    [OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS]?: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-duplicate-imports",
        description: Lint.Utils.dedent`
            Disallows multiple import statements from the same module.`,
        rationale: Lint.Utils.dedent`
            Using a single import statement per module will make the code clearer because you can see everything being imported
            from that module on one line.`,
        optionsDescription: Lint.Utils.dedent`
            "${OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS}" allows you to import namespaces on separate lines.`,
        options: {
            type: "object",
            properties: {
                [OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS]: {
                    type: "boolean",
                },
            },
        },
        optionExamples: [[true, { [OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS]: true }]],
        type: "maintainability",
        typescriptOnly: false,
    };

    public static FAILURE_STRING(module: string) {
        return `Multiple imports from '${module}' can be combined into one.`;
    }

    public static NAMESPACE_FAILURE_STRING(module: string) {
        return `Multiple wildcard imports from the same module, '${module}', are prohibited.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            [OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS]: !!(
                this.ruleArguments.length > 0 &&
                this.ruleArguments[0] !== null &&
                (this.ruleArguments[0] as RuleOptions)[OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS]
            ),
        });
    }
}

function walk(ctx: Lint.WalkContext<RuleOptions>): void {
    walkWorker(ctx, ctx.sourceFile.statements, {
        imports: new Set(),
        namespaceImports: new Set(),
    });
}

function statementIsNamespaceImport(statement: ts.ImportDeclaration) {
    return !!(
        statement.importClause !== undefined &&
        statement.importClause.namedBindings !== undefined &&
        isNamespaceImport(statement.importClause.namedBindings)
    );
}

function walkWorker(
    ctx: Lint.WalkContext<RuleOptions>,
    statements: ReadonlyArray<ts.Statement>,
    seen: {
        imports: Set<string>;
        namespaceImports: Set<string>;
    },
): void {
    for (const statement of statements) {
        if (
            isImportDeclaration(statement) &&
            isLiteralExpression(statement.moduleSpecifier) &&
            (!statementIsNamespaceImport(statement) ||
                !ctx.options[OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS])
        ) {
            const { text } = statement.moduleSpecifier;
            if (seen.imports.has(text)) {
                ctx.addFailureAtNode(statement, Rule.FAILURE_STRING(text));
            }
            seen.imports.add(text);
        } else if (
            isImportDeclaration(statement) &&
            isLiteralExpression(statement.moduleSpecifier) &&
            statementIsNamespaceImport(statement) &&
            ctx.options[OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS]
        ) {
            const { text } = statement.moduleSpecifier;
            if (seen.namespaceImports.has(text)) {
                ctx.addFailureAtNode(statement, Rule.NAMESPACE_FAILURE_STRING(text));
            }
            seen.namespaceImports.add(text);
        }

        if (
            isModuleDeclaration(statement) &&
            statement.body !== undefined &&
            statement.name.kind === ts.SyntaxKind.StringLiteral
        ) {
            // If this is a module augmentation, re-use `seen` since those imports could be moved outside.
            // If this is an ambient module, create a fresh `seen`
            // because they should have separate imports to avoid becoming augmentations.
            walkWorker(
                ctx,
                (statement.body as ts.ModuleBlock).statements,
                ts.isExternalModule(ctx.sourceFile)
                    ? seen
                    : {
                          imports: new Set(),
                          namespaceImports: new Set(),
                      },
            );
        }
    }
}
