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

export interface FunctionBan {
    name: string;
    message?: string;
}
export interface MethodBan extends FunctionBan {
    object: string;
}
export interface Options {
    functions: FunctionBan[];
    methods: MethodBan[];
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
              * an object in the following format: \`{"object": "objectName", "name": "methodName", "message": "optional message"}\`
            `,
        options: {
            type: "list",
            listType: {
                anyOf: [{
                    type: "string",
                }, {
                    type: "array",
                    items: {type: "string"},
                    minLength: 1,
                    maxLength: 3,
                }, {
                    type: "object",
                    properties: {
                        name: {type: "string"},
                        object: {type: "string"},
                        message: {type: "string"},
                    },
                    required: ["name"],
                }],
            },
        },
        optionExamples: [
            [
                true,
                "eval",
                {name: "$", message: "please don't"},
                ["describe", "only"],
                {object: "it", name: "only", message: "don't fucus tests"},
            ],
        ],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY = (expression: string, messageAddition?: string) => {
        return `Calls to '${expression}' are not allowed.${messageAddition ? " " + messageAddition : ""}`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new BanFunctionWalker(sourceFile, this.ruleName, parseOptions(this.ruleArguments)));
    }
}

function parseOptions(args: any[]): Options {
    const functions: FunctionBan[] = [];
    const methods: MethodBan[] = [];
    for (const arg of args) {
        if (typeof arg === "string") {
            functions.push({name: arg});
        } else if (Array.isArray(arg)) {
            if (arg.length === 1) {
                functions.push({name: arg[0]});
            } else {
                methods.push({object: arg[0], name: arg[1], message: arg[2]});
            }
        } else if (arg.object !== undefined) {
            methods.push(arg);
        } else {
            functions.push(arg);
        }
    }
    return { functions, methods };
}

export class BanFunctionWalker extends Lint.AbstractWalker<Options> {
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
        if (isIdentifier(expression.expression)) {
            const objectName = expression.expression.text;
            const name = expression.name.text;
            for (const ban of this.options.methods) {
                if (ban.object === objectName && ban.name === name) {
                    this.addFailureAtNode(expression, Rule.FAILURE_STRING_FACTORY(objectName + "." + name, ban.message));
                    break;
                }
            }
        }
    }

    private checkFunctionBan(name: ts.Identifier) {
        const {text} = name;
        for (const ban of this.options.functions) {
            if (ban.name === text) {
                this.addFailureAtNode(name, Rule.FAILURE_STRING_FACTORY(text, ban.message));
                break;
            }
        }
    }
}
