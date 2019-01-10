/**
 * @license
 * Copyright 2015 Palantir Technologies, Inc.
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
    hasModifier,
    isBlockScopedVariableDeclarationList,
    isNodeFlagSet,
    isVariableDeclarationList,
    isVariableStatement,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-var-keyword",
        description: "Disallows usage of the `var` keyword.",
        descriptionDetails: "Use `let` or `const` instead.",
        hasFix: true,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        rationale: Lint.Utils.dedent`
            Declaring variables using \`var\` has several edge case behaviors that make \`var\` unsuitable for modern code.
            Variables declared by \`var\` have their parent function block as their scope, ignoring other control flow statements.
            \`var\`s have declaration "hoisting" (similar to \`function\`s) and can appear to be used before declaration.

            Variables declared by \`const\` and \`let\` instead have as their scope the block in which they are defined,
            and are not allowed to used before declaration or be re-declared with another \`const\` or \`let\`.
        `,
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Forbidden 'var' keyword, use 'let' or 'const' instead";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    const { sourceFile } = ctx;
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        const parent = node.parent;
        if (
            isVariableDeclarationList(node) &&
            !isBlockScopedVariableDeclarationList(node) &&
            // If !isVariableStatement, this is inside of a for loop.
            (!isVariableStatement(parent) || !isGlobalVarDeclaration(parent))
        ) {
            const start = node.getStart(sourceFile);
            const width = "var".length;
            // Don't apply fix in a declaration file, because may have meant 'const'.
            const fix = sourceFile.isDeclarationFile
                ? undefined
                : new Lint.Replacement(start, width, "let");
            ctx.addFailureAt(start, width, Rule.FAILURE_STRING, fix);
        }

        return ts.forEachChild(node, cb);
    });
}

// Allow `declare var x: number;` or `declare global { var x: number; }`
function isGlobalVarDeclaration(node: ts.VariableStatement): boolean {
    const parent = node.parent;
    return (
        hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword) ||
        (parent.kind === ts.SyntaxKind.ModuleBlock &&
            isNodeFlagSet(parent.parent, ts.NodeFlags.GlobalAugmentation))
    );
}
