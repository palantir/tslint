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

interface FunctionBan {
    name: string;
    message?: string;
}
interface MethodBan extends FunctionBan {
    object: string[];
}

interface Options {
    functions: FunctionBan[];
    methods: MethodBan[];
}

interface OptionsInput {
    name: string | string[];
    message?: string;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "ban",
        description: "Bans the use of specific functions or global methods.",
        optionsDescription: Lint.Utils.dedent`
            A list of banned functions or methods in the following format:

            * banning functions:
              * just the name of the function: \`"functionName"\`
              * the name of the function in an array with one element: \`["functionName"]\`
              * an object in the following format: \`{"name": "functionName", "message": "optional explanation message"}\`
            * banning methods:
              * an array with the object name, method name and optional message: \`["functionName", "methodName", "optional message"]\`
              * an object in the following format: \`{"name": ["objectName", "methodName"], "message": "optional message"}\`
                * you can also ban deeply nested methods: \`{"name": ["foo", "bar", "baz"]}\` bans \`foo.bar.baz()\`
                * the first element can contain a wildcard (\`*\`) that matches everything. \`{"name": ["*", "forEach"]}\` bans\
                  \`[].forEach(...)\`, \`$(...).forEach(...)\`, \`arr.forEach(...)\`, etc.
            `,
        options: {
            type: "list",
            listType: {
                anyOf: [
                    {
                        type: "string"
                    },
                    {
                        type: "array",
                        items: { type: "string" },
                        minLength: 1,
                        maxLength: 3
                    },
                    {
                        type: "object",
                        properties: {
                            name: {
                                anyOf: [
                                    { type: "string" },
                                    { type: "array", items: { type: "string" }, minLength: 1 }
                                ]
                            },
                            message: { type: "string" }
                        },
                        required: ["name"]
                    }
                ]
            }
        },
        optionExamples: [
            [
                true,
                "eval",
                { name: "$", message: "please don't" },
                ["describe", "only"],
                { name: ["it", "only"], message: "don't focus tests" },
                { name: ["chai", "assert", "equal"], message: "Use 'strictEqual' instead." },
                { name: ["*", "forEach"], message: "Use a regular for loop instead." }
            ]
        ],
        type: "functionality",
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(expression: string, messageAddition?: string) {
        return `Calls to '${expression}' are not allowed.${
            messageAddition !== undefined ? ` ${messageAddition}` : ""
        }`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new BanFunctionWalker(sourceFile, this.ruleName, parseOptions(this.ruleArguments))
        );
    }
}

function parseOptions(args: Array<string | string[] | OptionsInput>): Options {
    const functions: FunctionBan[] = [];
    const methods: MethodBan[] = [];
    for (const arg of args) {
        if (typeof arg === "string") {
            functions.push({ name: arg });
        } else if (Array.isArray(arg)) {
            switch (arg.length) {
                case 0:
                    break;
                case 1:
                    functions.push({ name: arg[0] });
                    break;
                default:
                    methods.push({ object: [arg[0]], name: arg[1], message: arg[2] });
            }
        } else if (!Array.isArray(arg.name)) {
            functions.push(arg as FunctionBan);
        } else {
            switch (arg.name.length) {
                case 0:
                    break;
                case 1:
                    functions.push({ name: arg.name[0], message: arg.message });
                    break;
                default:
                    methods.push({
                        name: arg.name[arg.name.length - 1],
                        object: arg.name.slice(0, -1),
                        message: arg.message
                    });
            }
        }
    }
    return { functions, methods };
}

class BanFunctionWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (isCallExpression(node)) {
                if (isIdentifier(node.expression)) {
                    this.checkFunctionBan(node.expression);
                } else if (isPropertyAccessExpression(node.expression)) {
                    this.checkForObjectMethodBan(node.expression);
                }
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private checkForObjectMethodBan(expression: ts.PropertyAccessExpression) {
        for (const ban of this.options.methods) {
            if (expression.name.text !== ban.name) {
                continue;
            }
            let current = expression.expression;
            for (let i = ban.object.length - 1; i > 0; --i) {
                if (!isPropertyAccessExpression(current) || current.name.text !== ban.object[i]) {
                    continue;
                }
                current = current.expression;
            }
            if (
                ban.object[0] === "*" ||
                (isIdentifier(current) && current.text === ban.object[0])
            ) {
                this.addFailureAtNode(
                    expression,
                    Rule.FAILURE_STRING_FACTORY(`${ban.object.join(".")}.${ban.name}`, ban.message)
                );
                break;
            }
        }
    }

    private checkFunctionBan(name: ts.Identifier) {
        const { text } = name;
        for (const ban of this.options.functions) {
            if (ban.name === text) {
                this.addFailureAtNode(name, Rule.FAILURE_STRING_FACTORY(text, ban.message));
                break;
            }
        }
    }
}
