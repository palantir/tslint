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
import { isFunctionScopeBoundary } from "../utils";

const OPTION_CHECK_PARAMETERS = "check-parameters";

interface Options {
    parameters: boolean;
}

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
        optionsDescription: `You can specify \`"${OPTION_CHECK_PARAMETERS}"\` to check for variables with the same name as a parameter.`,
        options: {
            type: "string",
            enum: [OPTION_CHECK_PARAMETERS],
        },
        optionExamples: [true, [true, OPTION_CHECK_PARAMETERS]],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(name: string): string {
        return `Duplicate variable: '${name}'`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new NoDuplicateVariableWalker(sourceFile, this.ruleName, {
                parameters: this.ruleArguments.indexOf(OPTION_CHECK_PARAMETERS) !== -1,
            }),
        );
    }
}

class NoDuplicateVariableWalker extends Lint.AbstractWalker<Options> {
    private scope: Set<string> = new Set();
    public walk(sourceFile: ts.SourceFile) {
        this.scope = new Set();
        const cb = (node: ts.Node): void => {
            // tslint:disable:deprecation This is needed for https://github.com/palantir/tslint/pull/4274 and will be fixed once TSLint
            // requires tsutils > 3.0.
            if (isFunctionScopeBoundary(node)) {
                // tslint:enable:deprecation
                const oldScope = this.scope;
                this.scope = new Set();
                ts.forEachChild(node, cb);
                this.scope = oldScope;
                return;
            }
            if (this.options.parameters && utils.isParameterDeclaration(node)) {
                this.handleBindingName(node.name, false);
            } else if (
                utils.isVariableDeclarationList(node) &&
                !utils.isBlockScopedVariableDeclarationList(node)
            ) {
                for (const variable of node.declarations) {
                    this.handleBindingName(variable.name, true);
                }
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private handleBindingName(name: ts.BindingName, check: boolean) {
        if (name.kind === ts.SyntaxKind.Identifier) {
            if (check && this.scope.has(name.text)) {
                this.addFailureAtNode(name, Rule.FAILURE_STRING(name.text));
            } else {
                this.scope.add(name.text);
            }
        } else {
            for (const e of name.elements) {
                if (e.kind !== ts.SyntaxKind.OmittedExpression) {
                    this.handleBindingName(e.name, check);
                }
            }
        }
    }
}
