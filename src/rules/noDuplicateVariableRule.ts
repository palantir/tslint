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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-duplicate-variable",
        description: "Disallows duplicate variable declarations in the same block scope.",
        descriptionDetails: Lint.Utils.dedent`
            This rule is only useful when using the \`var\` keyword -
            the compiler will detect redeclarations of \`let\` and \`const\` variables.`,
        rationale: Lint.Utils.dedent`
            A variable can be reassigned if necessary -
            there's no good reason to have a duplicate variable declaration.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(name: string): string {
        return `Duplicate variable: '${name}'`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    let scope = new Set<string>();
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (utils.isFunctionScopeBoundary(node)) {
            const oldScope = scope;
            scope = new Set();
            ts.forEachChild(node, cb);
            scope = oldScope;
            return;
        } else if (utils.isVariableDeclaration(node) && !utils.isBlockScopedVariableDeclaration(node)) {
            forEachBoundIdentifier(node.name, (id) => {
                const { text } = id;
                if (scope.has(text)) {
                    ctx.addFailureAtNode(id, Rule.FAILURE_STRING(text));
                } else {
                    scope.add(text);
                }
            });
        }

        return ts.forEachChild(node, cb);
    });
}

function forEachBoundIdentifier(name: ts.BindingName, action: (id: ts.Identifier) => void): void {
    if (name.kind === ts.SyntaxKind.Identifier) {
        action(name);
    } else {
        for (const e of name.elements) {
            if (e.kind !== ts.SyntaxKind.OmittedExpression) {
                forEachBoundIdentifier(e.name, action);
            }
        }
    }
}
