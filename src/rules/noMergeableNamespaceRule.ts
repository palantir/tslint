/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-mergeable-namespace",
        description: "Disallows mergeable namespaces in the same file.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "maintainability",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static failureStringFactory(name: string, seenBeforeLine: number) {
        return `Mergeable namespace '${name}' found. Merge its contents with the namespace on line ${seenBeforeLine}.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.ruleName, undefined));
    }
}

class Walker extends Lint.AbstractWalker<void> {
    public walk(node: ts.SourceFile) {
        return this.checkStatements(node.statements);
    }

    private checkStatements(statements: ReadonlyArray<ts.Statement>): void {
        const seen = new Map<string, ts.NamespaceDeclaration>();

        for (const statement of statements) {
            if (statement.kind !== ts.SyntaxKind.ModuleDeclaration) {
                continue;
            }

            const { name } = statement as ts.ModuleDeclaration;
            if (name.kind === ts.SyntaxKind.Identifier) {
                const { text } = name;
                const prev = seen.get(text);
                if (prev !== undefined) {
                    this.addFailureAtNode(
                        name,
                        Rule.failureStringFactory(text, this.getLineOfNode(prev.name)),
                    );
                }
                seen.set(text, statement as ts.NamespaceDeclaration);
            }

            // Recursively check in all module declarations
            this.checkModuleDeclaration(statement as ts.ModuleDeclaration);
        }
    }

    private checkModuleDeclaration(decl: ts.ModuleDeclaration): void {
        const { body } = decl;
        if (body === undefined) {
            return;
        }

        switch (body.kind) {
            case ts.SyntaxKind.ModuleBlock:
                this.checkStatements(body.statements);
                break;
            case ts.SyntaxKind.ModuleDeclaration:
                this.checkModuleDeclaration(body as ts.ModuleDeclaration);
        }
    }

    private getLineOfNode(node: ts.Node): number {
        return ts.getLineAndCharacterOfPosition(this.sourceFile, node.pos).line + 1;
    }
}
