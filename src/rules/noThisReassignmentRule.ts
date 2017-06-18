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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const ALLOW_THIS_DESTRUCTURING = "allow-this-destructuring";
const ALLOWED_THIS_NAMES = "allowed-this-names";

interface Options {
    allowedThisNames: string[];
    allowThisDestructuring: boolean;
}

type RuleArgument = boolean | {
    "allow-this-destructuring"?: boolean;
    "allowed-this-names"?: string[];
};

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows unnecessary references to `this`.",
        optionExamples: [
            true,
            [
                true,
                {
                    [ALLOWED_THIS_NAMES]: ["self"],
                    [ALLOW_THIS_DESTRUCTURING]: true,
                },
            ],
        ],
        options: {
            additionalProperties: false,
            properties: {
                [ALLOW_THIS_DESTRUCTURING]: {
                    type: "boolean",
                },
                [ALLOWED_THIS_NAMES]: {
                    listType: "string",
                    type: "list",
                },
            },
            type: "object",
        },
        optionsDescription: Lint.Utils.dedent`
            Two options may be provided on an object:

            * \`${ALLOW_THIS_DESTRUCTURING}\` allows using destructuring to access members of \`this\` (e.g. \`{ foo, bar } = this;\`).
            * \`${ALLOWED_THIS_NAMES}\` may be specified as a list of regular expressions to match allowed variable names.`,
        rationale: "Assigning a variable to `this` instead of properly using arrow lambdas"
            + "may be a symptom of pre-ES6 practices or not manging scope well.",
        ruleName: "no-this-reassignment",
        type: "functionality",
        typescriptOnly: false,
    };

    public static readonly FAILURE_STRING_BINDINGS = "Don't reassign members of `this` to local variables.";

    public static FAILURE_STRING_FACTORY_IDENTIFIERS(name: string) {
        return `Assigning \`this\` reference to local variable not allowed: ${name}.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const allowedThisNames: string[] = [];
        let allowThisDestructuring = false;

        for (const ruleArgument of this.ruleArguments as RuleArgument[]) {
            if (typeof ruleArgument === "object") {
                allowThisDestructuring = !!ruleArgument[ALLOW_THIS_DESTRUCTURING];

                if (ruleArgument[ALLOWED_THIS_NAMES] !== undefined) {
                    allowedThisNames.push(...ruleArgument[ALLOWED_THIS_NAMES]!);
                }
            }
        }

        const options = { allowedThisNames, allowThisDestructuring };
        const noThisReassignmentWalker = new NoThisReassignmentWalker(sourceFile, this.ruleName, options);

        return this.applyWithWalker(noThisReassignmentWalker);
    }
}

class NoThisReassignmentWalker extends Lint.AbstractWalker<Options> {
    private readonly allowedThisNameTesters = this.options.allowedThisNames.map(
        (allowedThisName) => new RegExp(allowedThisName));

    public walk(sourceFile: ts.SourceFile): void {
        ts.forEachChild(sourceFile, this.visitNode);
    }

    private visitNode = (node: ts.Node): void => {
        if (utils.isVariableDeclaration(node)) {
            this.visitVariableDeclaration(node);
        }

        ts.forEachChild(node, this.visitNode);
    }

    private visitVariableDeclaration(node: ts.VariableDeclaration): void {
        if (node.initializer === undefined || node.initializer.kind !== ts.SyntaxKind.ThisKeyword) {
            return;
        }

        switch (node.name.kind) {
            case ts.SyntaxKind.Identifier:
                if (this.variableNameIsBanned(node.name.text)) {
                    this.addFailureAtNode(node, Rule.FAILURE_STRING_FACTORY_IDENTIFIERS(node.name.text));
                }
                break;

            case ts.SyntaxKind.ObjectBindingPattern:
                if (!this.options.allowThisDestructuring) {
                    this.addFailureAtNode(node, Rule.FAILURE_STRING_BINDINGS);
                }
        }
    }

    private variableNameIsBanned(name: string): boolean {
        for (const tester of this.allowedThisNameTesters) {
            if (tester.test(name)) {
                return false;
            }
        }

        return true;
    }
}
