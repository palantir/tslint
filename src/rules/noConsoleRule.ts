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

import { isCallExpression, isIdentifier, isPropertyAccessExpression } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";
import { codeExamples } from "./code-examples/preferWhile.examples";

interface Config {
    "banned-methods": string[] | undefined;
    "failure-string": string | undefined;
}

interface Options {
    bannedMethods: string[];
    customFailureString: string | undefined;
}

const DEFAULT_CONFIG = {
    bannedMethods: [],
    customFailureString: undefined,
};

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-console",
        description: "Bans the use of specified `console` methods.",
        rationale: "In general, \`console\` methods aren't appropriate for production code.",
        optionsDescription: Lint.Utils.dedent`
            Either a list of method names to ban, or an object containing one or both of the following properties:
            * \`banned-methods\` - A list of method names to ban. If no list is provided, all console methods are banned.
            * \`failure-string\` - A custom failure string which will be added to the normal error message.

            If no configuration options are provided, all console methods are banned.
        `,
        options: {
            oneOf: [
                {
                    type: "array",
                    items: { type: "string" },
                },
                {
                    type: "object",
                    properties: {
                        "banned-methods": {
                            type: "array",
                            items: { type: "string" },
                        },
                        "failure-string": { type: "string" },
                    },
                },
            ],
        },
        optionExamples: [[true, "log", "error"], [true, [], "Instead of using console, try importing LogService."]],
        type: "functionality",
        typescriptOnly: false,
        codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(method: string, customFailureString: string | undefined) {
        return `Calls to 'console.${method}' are not allowed.${customFailureString !== undefined ? ` ${customFailureString}` : ""}`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.ruleArguments));
    }

    private parseOptions(ruleArguments: any[]): Options {
        if (ruleArguments.length === 0 || typeof ruleArguments[0] === "string") {
            return {
                bannedMethods: [...ruleArguments],
                customFailureString: undefined,
            };
        } else if (typeof ruleArguments[0] === "object") {
            const bannedMethods = (ruleArguments[0] as Config)["banned-methods"];
            return {
                bannedMethods: bannedMethods !== undefined && bannedMethods.length !== undefined
                    ? bannedMethods
                    : [],
                customFailureString: (ruleArguments[0] as Config)["failure-string"],
            };
        }
        return DEFAULT_CONFIG;
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (isCallExpression(node) &&
            isPropertyAccessExpression(node.expression) &&
            isIdentifier(node.expression.expression) &&
            node.expression.expression.text === "console" &&
            (ctx.options.bannedMethods.length === 0 || ctx.options.bannedMethods.indexOf(node.expression.name.text) !== -1)) {

            ctx.addFailureAtNode(
                node.expression,
                Rule.FAILURE_STRING_FACTORY(
                    node.expression.name.text,
                    ctx.options.customFailureString,
                ),
            );
        }
        return ts.forEachChild(node, cb);
    });
}
