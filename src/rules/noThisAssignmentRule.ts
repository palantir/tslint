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

const ALLOW_THIS_DESTRUCTURING = "allow-destructuring";
const ALLOWED_THIS_NAMES = "allowed-names";

interface Options {
    allowedNames: string[];
    allowDestructuring: boolean;
}

interface ConfigOptions {
    "allow-destructuring"?: boolean;
    "allowed-names"?: string[];
}

const parseConfigOptions = (configOptions: ConfigOptions | undefined): Options => {
    const allowedNames: string[] = [];
    let allowDestructuring = false;

    if (configOptions !== undefined) {
        allowDestructuring = !!configOptions[ALLOW_THIS_DESTRUCTURING];

        if (configOptions[ALLOWED_THIS_NAMES] !== undefined) {
            allowedNames.push(...configOptions[ALLOWED_THIS_NAMES]!);
        }
    }

    return { allowedNames, allowDestructuring };
};

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows unnecessary references to `this`.",
        optionExamples: [
            true,
            [
                true,
                {
                    [ALLOWED_THIS_NAMES]: ["^self$"],
                    [ALLOW_THIS_DESTRUCTURING]: true
                }
            ]
        ],
        options: {
            additionalProperties: false,
            properties: {
                [ALLOW_THIS_DESTRUCTURING]: {
                    type: "boolean"
                },
                [ALLOWED_THIS_NAMES]: {
                    listType: "string",
                    type: "list"
                }
            },
            type: "object"
        },
        optionsDescription: Lint.Utils.dedent`
            Two options may be provided on an object:

            * \`${ALLOW_THIS_DESTRUCTURING}\` allows using destructuring to access members of \`this\` (e.g. \`{ foo, bar } = this;\`).
            * \`${ALLOWED_THIS_NAMES}\` may be specified as a list of regular expressions to match allowed variable names.`,
        rationale: Lint.Utils.dedent`
            Assigning a variable to \`this\` instead of properly using arrow lambdas may be a symptom of pre-ES6 practices
            or not managing scope well.

            Instead of storing a reference to \`this\` and using it inside a \`function () {\`:

            \`\`\`
            const self = this;

            setTimeout(function () {
                self.doWork();
            });
            \`\`\`

            Use \`() =>\` arrow lambdas, as they preserve \`this\` scope for you:

            \`\`\`
            setTimeout(() => {
                this.doWork();
            });
            \`\`\`
        `,
        ruleName: "no-this-assignment",
        type: "functionality",
        typescriptOnly: false
    };

    public static FAILURE_STRING_BINDINGS = "Don't assign members of `this` to local variables.";

    public static FAILURE_STRING_FACTORY_IDENTIFIERS(name: string) {
        return `Assigning \`this\` reference to local variable not allowed: ${name}.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = parseConfigOptions((this.ruleArguments as [ConfigOptions])[0]);
        const noThisAssignmentWalker = new NoThisAssignmentWalker(
            sourceFile,
            this.ruleName,
            options
        );

        return this.applyWithWalker(noThisAssignmentWalker);
    }
}

class NoThisAssignmentWalker extends Lint.AbstractWalker<Options> {
    private readonly allowedThisNameTesters = this.options.allowedNames.map(
        allowedThisName => new RegExp(allowedThisName)
    );

    public walk(sourceFile: ts.SourceFile): void {
        ts.forEachChild(sourceFile, this.visitNode);
    }

    private readonly visitNode = (node: ts.Node): void => {
        if (utils.isVariableDeclaration(node)) {
            this.visitVariableDeclaration(node);
        }

        ts.forEachChild(node, this.visitNode);
    };

    private visitVariableDeclaration(node: ts.VariableDeclaration): void {
        if (node.initializer === undefined || node.initializer.kind !== ts.SyntaxKind.ThisKeyword) {
            return;
        }

        switch (node.name.kind) {
            case ts.SyntaxKind.Identifier:
                if (this.variableNameIsBanned(node.name.text)) {
                    this.addFailureAtNode(
                        node,
                        Rule.FAILURE_STRING_FACTORY_IDENTIFIERS(node.name.text)
                    );
                }
                break;

            default:
                if (!this.options.allowDestructuring) {
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
