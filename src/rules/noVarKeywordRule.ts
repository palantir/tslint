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

import { isModuleDeclaration, isVariableDeclarationList } from "tsutils";
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
        optionExamples: ["true"],
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
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.VariableStatement: {
                const vs = node as ts.VariableStatement;
                if (!Lint.isBlockScopedVariableDeclarationList(vs.declarationList) && !isGlobalVarDeclaration(vs)) {
                    fail(vs.declarationList);
                }
                break;
            }

            case ts.SyntaxKind.ForStatement:
            case ts.SyntaxKind.ForInStatement:
            case ts.SyntaxKind.ForOfStatement: {
                const { initializer } = node as ts.ForStatement | ts.ForInStatement | ts.ForOfStatement;
                if (initializer && isVariableDeclarationList(initializer) && !Lint.isBlockScopedVariableDeclarationList(initializer)) {
                    fail(initializer);
                }
                break;
            }
        }

        return ts.forEachChild(node, cb);
    });

    function fail(node: ts.Node): void {
        // Don't apply fix in a declaration file, because may have meant 'const'.
        const fix = sourceFile.isDeclarationFile ? undefined : new Lint.Replacement(node.getStart(), "var".length, "let");
        ctx.addFailureAtNode(Lint.childOfKind(node, ts.SyntaxKind.VarKeyword)!, Rule.FAILURE_STRING, fix);
    }
}

// Allow `declare var x: number;` or `declare global { var x: number; }`
function isGlobalVarDeclaration(node: ts.VariableStatement): boolean {
    const parent = node.parent!;
    return Lint.hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword)
        || parent.kind === ts.SyntaxKind.ModuleBlock && isDeclareGlobal(parent.parent!);
}

function isDeclareGlobal(node: ts.Node): boolean {
    return isModuleDeclaration(node) && node.name.kind === ts.SyntaxKind.Identifier && node.name.text === "global";
}
