/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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

import { isNodeFlagSet } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-internal-module",
        description: "Disallows internal `module`",
        rationale:
            "Using `module` leads to a confusion of concepts with external modules. Use the newer `namespace` keyword instead.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "typescript",
        typescriptOnly: true,
        hasFix: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "The internal 'module' syntax is deprecated, use the 'namespace' keyword instead.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new NoInternalModuleWalker(sourceFile, this.ruleName, undefined),
        );
    }
}

class NoInternalModuleWalker extends Lint.AbstractWalker<void> {
    public walk(sourceFile: ts.SourceFile) {
        return this.checkStatements(sourceFile.statements);
    }

    private checkStatements(statements: ReadonlyArray<ts.Statement>) {
        for (const statement of statements) {
            if (statement.kind === ts.SyntaxKind.ModuleDeclaration) {
                this.checkModuleDeclaration(statement as ts.ModuleDeclaration);
            }
        }
    }

    private checkModuleDeclaration(node: ts.ModuleDeclaration, nested?: boolean): void {
        if (
            !nested &&
            node.name.kind === ts.SyntaxKind.Identifier &&
            !isNodeFlagSet(node, ts.NodeFlags.Namespace) &&
            // augmenting global uses a special syntax that is allowed
            // see https://github.com/Microsoft/TypeScript/pull/6213
            !isNodeFlagSet(node, ts.NodeFlags.GlobalAugmentation)
        ) {
            const end = node.name.pos;
            const start = end - "module".length;
            this.addFailure(
                start,
                end,
                Rule.FAILURE_STRING,
                Lint.Replacement.replaceFromTo(start, end, "namespace"),
            );
        }
        if (node.body !== undefined) {
            switch (node.body.kind) {
                case ts.SyntaxKind.ModuleBlock:
                    return this.checkStatements(node.body.statements);
                case ts.SyntaxKind.ModuleDeclaration:
                    return this.checkModuleDeclaration(node.body, true);
            }
        }
    }
}
