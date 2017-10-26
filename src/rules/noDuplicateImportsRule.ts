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

import { isLiteralExpression, isModuleBlock, isModuleDeclaration } from "tsutils";
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
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    walkWorker(ctx, ctx.sourceFile.statements, new Set());
}

function walkWorker(ctx: Lint.WalkContext<void>, statements: ReadonlyArray<ts.Statement>, seen: Set<string>): void {
    for (const statement of statements) {
        const im = tryGetImportSpecifier(statement);
        if (im !== undefined && isLiteralExpression(im)) {
            const { text } = im;
            if (seen.has(text)) {
                ctx.addFailureAtNode(im.parent!, Rule.FAILURE_STRING(text));
            }
            seen.add(text);
        }

        if (isModuleDeclaration(statement) && statement.body !== undefined && isModuleBlock(statement.body)) {
            // If this is a module augmentation, re-use `seen` since those imports could be moved outside.
            // If this is an ambient module, create a fresh `seen`
            // because they should have separate imports to avoid becoming augmentations.
            walkWorker(ctx, statement.body.statements, ts.isExternalModule(ctx.sourceFile) ? seen : new Set());
        }
    }
}

function tryGetImportSpecifier(statement: ts.Statement): ts.Expression | undefined {
    switch (statement.kind) {
        case ts.SyntaxKind.ImportDeclaration:
            return (statement as ts.ImportDeclaration).moduleSpecifier;
        case ts.SyntaxKind.ImportEqualsDeclaration:
            const ref = (statement as ts.ImportEqualsDeclaration).moduleReference;
            return ref.kind === ts.SyntaxKind.ExternalModuleReference ? ref.expression : undefined;
        default:
            return undefined;
    }
}
