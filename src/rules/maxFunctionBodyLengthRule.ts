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

import * as tsutils from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";
import { isFunctionLikeDeclaration } from "../language/utils";

interface MaxFunctionLengthRuleOptions {
    arrowFunctionBodyLength?: number;
    bodyLength: number;
    constructorBodyLength?: number;
    functionDeclarationBodyLength?: number;
    functionExpressionBodyLength?: number;
    ignoreComments?: boolean;
    ignoreParametersToFunction?: RegExp;
    methodDeclarationBodyLength?: number;
}

const ARROW_FUNCTION_BODY_LENGTH = "arrow-function-body-length";
const BODY_LENGTH = "body-length";
const CONSTRUCTOR_BODY_LENGTH = "constructor-body-length";
const FUNCTION_DECLARATION_BODY_LENGTH = "function-declaration-body-length";
const FUNCTION_EXPRESSION_BODY_LENGTH = "function-expression-body-length";
const IGNORE_COMMENTS = "ignore-comments";
const IGNORE_PARAMETERS_TO_FUNCTIONS = "ignore-parameters-to-functions";
const METHOD_DECLARATION_BODY_LENGTH = "method-declaration-body-length";

const DEFAULT_BODY_LENGTH = 100;

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Requires lines to be under a certain max length.",
        optionExamples: [
            [true],
            [true, 140],
            [
                true,
                {
                    [FUNCTION_DECLARATION_BODY_LENGTH]: 140,
                    [METHOD_DECLARATION_BODY_LENGTH]: 175
                }
            ],
            [
                true,
                {
                    [FUNCTION_EXPRESSION_BODY_LENGTH]: true,
                    [IGNORE_COMMENTS]: true
                }
            ],
            [
                true,
                {
                    [ARROW_FUNCTION_BODY_LENGTH]: 75,
                    [CONSTRUCTOR_BODY_LENGTH]: 35,
                    [IGNORE_PARAMETERS_TO_FUNCTIONS]: "^describe$"
                }
            ]
        ],
        options: {
            anyOf: [
                {
                    type: "number"
                },
                {
                    properties: {
                        [ARROW_FUNCTION_BODY_LENGTH]: {
                            type: "number"
                        },
                        [BODY_LENGTH]: {
                            type: "number"
                        },
                        [CONSTRUCTOR_BODY_LENGTH]: {
                            type: "number"
                        },
                        [FUNCTION_DECLARATION_BODY_LENGTH]: {
                            type: "number"
                        },
                        [FUNCTION_EXPRESSION_BODY_LENGTH]: {
                            type: "number"
                        },
                        [IGNORE_COMMENTS]: {
                            type: "boolean"
                        },
                        [IGNORE_PARAMETERS_TO_FUNCTIONS]: {
                            type: "string"
                        },
                        [METHOD_DECLARATION_BODY_LENGTH]: {
                            type: "number"
                        }
                    },
                    type: "object"
                }
            ]
        },
        optionsDescription: Lint.Utils.dedent`
            A number may be passed to specify the global maximum allowed body length, which defaults to ${DEFAULT_BODY_LENGTH}.

            Alternately, it may be provided as an object with the \`${BODY_LENGTH}\` member as that number,
            with any of the following overrides:
            * \`${ARROW_FUNCTION_BODY_LENGTH}\`: \`() => { ... }\` arrow functions.
            * \`${CONSTRUCTOR_BODY_LENGTH}\`: Class constructors.
            * \`${FUNCTION_DECLARATION_BODY_LENGTH}\`: Regular standalone \`function\` declarations.
            * \`${FUNCTION_EXPRESSION_BODY_LENGTH}\`: Function expressions, such as those assigned to variables.

            Two more options are allowed in the object:
            * \`${IGNORE_COMMENTS}\`: Whether to exclude lines containing only comments in body length calculations.
            * \`${IGNORE_PARAMETERS_TO_FUNCTIONS}\`: Regular expression of functions to ignore parameters of, such as in test \`describe\`s.
        `,
        rationale: Lint.Utils.dedent`
            wat
        `,
        ruleName: "max-function-body-length",
        type: "maintainability",
        typescriptOnly: false
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(
            sourceFile,
            walk,
            parseOptions(this.ruleArguments[0] as number | IRawRuleArgument)
        );
    }
}

interface IRawRuleArgument {
    "arrow-function-body-length"?: number;
    "body-length": number;
    "constructor-body-length": number;
    "function-declaration-body-length": number;
    "function-expression-body-length": number;
    "ignore-comments": boolean;
    "ignore-parameters-to-functions": string;
    "method-declaration-body-length": number;
}

function parseOptions(ruleArgument: number | IRawRuleArgument): MaxFunctionLengthRuleOptions {
    if (typeof ruleArgument === "number") {
        return {
            bodyLength: ruleArgument
        };
    }

    if (typeof ruleArgument !== "object") {
        return {
            bodyLength: DEFAULT_BODY_LENGTH
        };
    }

    return {
        arrowFunctionBodyLength: ruleArgument[ARROW_FUNCTION_BODY_LENGTH],
        bodyLength:
            ruleArgument[BODY_LENGTH] === undefined
                ? DEFAULT_BODY_LENGTH
                : ruleArgument[BODY_LENGTH],
        constructorBodyLength: ruleArgument[CONSTRUCTOR_BODY_LENGTH],
        functionDeclarationBodyLength: ruleArgument[FUNCTION_DECLARATION_BODY_LENGTH],
        functionExpressionBodyLength: ruleArgument[FUNCTION_EXPRESSION_BODY_LENGTH],
        ignoreComments:
            ruleArgument[IGNORE_COMMENTS] === undefined ? false : ruleArgument[IGNORE_COMMENTS],
        ignoreParametersToFunction:
            IGNORE_PARAMETERS_TO_FUNCTIONS in ruleArgument
                ? new RegExp(ruleArgument[IGNORE_PARAMETERS_TO_FUNCTIONS])
                : undefined,
        methodDeclarationBodyLength: ruleArgument[METHOD_DECLARATION_BODY_LENGTH]
    };
}

const functionKindTexts: { [i: number]: string } = {
    [ts.SyntaxKind.ArrowFunction]: "arrow function",
    [ts.SyntaxKind.Constructor]: "constructor",
    [ts.SyntaxKind.FunctionDeclaration]: "function declaration",
    [ts.SyntaxKind.FunctionExpression]: "function expression",
    [ts.SyntaxKind.MethodDeclaration]: "method"
};

const fallbackNumber = (value: number | undefined, fallback: number) =>
    value === undefined ? fallback : value;

function walk(context: Lint.WalkContext<MaxFunctionLengthRuleOptions>) {
    const maxLengths: { [i: number]: number } = {
        [ts.SyntaxKind.ArrowFunction]: fallbackNumber(
            context.options.arrowFunctionBodyLength,
            context.options.bodyLength
        ),
        [ts.SyntaxKind.Constructor]: fallbackNumber(
            context.options.constructorBodyLength,
            context.options.bodyLength
        ),
        [ts.SyntaxKind.FunctionDeclaration]: fallbackNumber(
            context.options.functionDeclarationBodyLength,
            context.options.bodyLength
        ),
        [ts.SyntaxKind.FunctionExpression]: fallbackNumber(
            context.options.functionExpressionBodyLength,
            context.options.bodyLength
        ),
        [ts.SyntaxKind.MethodDeclaration]: fallbackNumber(
            context.options.methodDeclarationBodyLength,
            context.options.bodyLength
        )
    };

    function formatFailureText(
        node: ts.FunctionLikeDeclaration,
        bodyLength: number,
        maxLength: number
    ): string {
        const functionKindText: string = functionKindTexts[node.kind];

        return `Maximum ${functionKindText} body length exceeded: ${bodyLength} lines instead of <= ${maxLength}.`;
    }

    function calculateBodyLength(node: ts.FunctionLikeDeclaration): number {
        if (node.body === undefined) {
            return 0;
        }

        const startLine: number = context.sourceFile.getLineAndCharacterOfPosition(node.body.pos)
            .line;
        const endLine: number = context.sourceFile.getLineAndCharacterOfPosition(node.body.end)
            .line;
        let total = endLine - startLine + 1;

        if (context.options.ignoreComments) {
            total -= calculateBodyCommentLength(node);
        }

        return total;
    }

    function calculateBodyCommentLength(node: ts.FunctionLikeDeclaration): number {
        let commentLineCount = 0;

        commentLineCount += node
            .getFullText()
            .split(/\n/)
            .filter(line => line.trim().match(/^\/\//) !== null).length;

        tsutils.forEachTokenWithTrivia(node, (text, tokenSyntaxKind) => {
            if (tokenSyntaxKind === ts.SyntaxKind.MultiLineCommentTrivia) {
                commentLineCount += text.split(/\n/).length;
            }
        });

        return commentLineCount;
    }

    function getCallExpressionFunctionName(node: ts.CallExpression): string | undefined {
        const { expression } = node;

        return tsutils.isIdentifier(expression) ? expression.text : undefined;
    }

    function shouldSkipNode(node: ts.Node) {
        const { parent } = node;
        if (
            parent === undefined ||
            !tsutils.isCallExpression(parent) ||
            context.options.ignoreParametersToFunction === undefined
        ) {
            return false;
        }

        const functionName = getCallExpressionFunctionName(parent);

        return (
            functionName !== undefined &&
            context.options.ignoreParametersToFunction.test(functionName)
        );
    }

    function validate(node: ts.FunctionLikeDeclaration): void {
        const bodyLength = calculateBodyLength(node);
        const maxLength = maxLengths[node.kind];

        if (bodyLength > maxLength && node.parent !== undefined) {
            context.addFailureAt(
                node.getStart(),
                node.getWidth(),
                formatFailureText(node, bodyLength, maxLength)
            );
        }
    }

    return ts.forEachChild(context.sourceFile, function cb(node): void {
        if (isFunctionLikeDeclaration(node) && !shouldSkipNode(node)) {
            validate(node);
        }

        return ts.forEachChild(node, cb);
    });
}
