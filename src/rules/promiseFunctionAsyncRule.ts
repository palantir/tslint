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

import { hasAccessModifier, hasModifier, isCallExpression } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_FUNCTION_DECLARATION = "check-function-declaration";
const OPTION_FUNCTION_EXPRESSION = "check-function-expression";
const OPTION_ARROW_FUNCTION = "check-arrow-function";
const OPTION_METHOD_DECLARATION = "check-method-declaration";

const KIND_FOR_OPTION: { [arg: string]: number } = {
    [OPTION_FUNCTION_DECLARATION]: ts.SyntaxKind.FunctionDeclaration,
    [OPTION_FUNCTION_EXPRESSION]: ts.SyntaxKind.FunctionExpression,
    [OPTION_ARROW_FUNCTION]: ts.SyntaxKind.ArrowFunction,
    [OPTION_METHOD_DECLARATION]: ts.SyntaxKind.MethodDeclaration,
};

type EnabledSyntaxKinds = ReadonlySet<number>;

function parseOptions(ruleArguments: string[]): EnabledSyntaxKinds {
    if (ruleArguments.length === 0) {
        ruleArguments = Object.keys(KIND_FOR_OPTION);
    }

    const enabledKinds = new Set<number>();
    for (const arg of ruleArguments) {
        enabledKinds.add(KIND_FOR_OPTION[arg]);
    }
    return enabledKinds;
}

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "promise-function-async",
        description: "Requires any function or method that returns a promise to be marked async.",
        hasFix: true,
        rationale: Lint.Utils.dedent`
            Ensures that each function is only capable of 1) returning a rejected promise, or 2)
            throwing an Error object. In contrast, non-\`async\` \`Promise\`-returning functions
            are technically capable of either. This practice removes a requirement for consuming
            code to handle both cases.

            If no optional arguments are provided then all function types are checked,
            otherwise the specific function types are checked:

            * \`"${OPTION_FUNCTION_DECLARATION}"\` check function declarations.
            * \`"${OPTION_FUNCTION_EXPRESSION}"\` check function expressions.
            * \`"${OPTION_ARROW_FUNCTION}"\` check arrow functions.
            * \`"${OPTION_METHOD_DECLARATION}"\` check method declarations.
        `,
        optionsDescription: "Not configurable.",
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    OPTION_FUNCTION_DECLARATION,
                    OPTION_FUNCTION_EXPRESSION,
                    OPTION_ARROW_FUNCTION,
                    OPTION_METHOD_DECLARATION,
                ],
            },
            minLength: 0,
            maxLength: 4,
        },
        optionExamples: [true, [true, OPTION_FUNCTION_DECLARATION, OPTION_METHOD_DECLARATION]],
        type: "typescript",
        typescriptOnly: false,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "functions that return promises must be async";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(
            sourceFile,
            walk,
            parseOptions(this.ruleArguments),
            program.getTypeChecker(),
        );
    }
}

function walk(ctx: Lint.WalkContext<EnabledSyntaxKinds>, tc: ts.TypeChecker) {
    const { sourceFile, options } = ctx;
    return ts.forEachChild(sourceFile, function cb(node): void {
        if (options.has(node.kind)) {
            const declaration = node as ts.FunctionLikeDeclaration;
            switch (node.kind) {
                case ts.SyntaxKind.MethodDeclaration:
                case ts.SyntaxKind.FunctionDeclaration:
                    if (declaration.body === undefined) {
                        break;
                    }
                // falls through
                case ts.SyntaxKind.FunctionExpression:
                case ts.SyntaxKind.ArrowFunction:
                    if (
                        !hasModifier(node.modifiers, ts.SyntaxKind.AsyncKeyword) &&
                        returnsPromise(declaration, tc) &&
                        !isCallExpression(declaration.body as ts.Expression)
                    ) {
                        const start = node.getStart(sourceFile);
                        let fixPos = start;

                        if (hasAccessModifier(node as ts.ClassElement)) {
                            // "public async ..." instead of "async public ..."
                            const name = (node as ts.FunctionLikeDeclaration).name;

                            if (name) {
                                fixPos = name.pos + 1;
                            }
                        }

                        const fix = Lint.Replacement.appendText(fixPos, "async ");
                        ctx.addFailure(
                            start,
                            (node as ts.FunctionLikeDeclaration).body!.pos,
                            Rule.FAILURE_STRING,
                            fix,
                        );
                    }
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function returnsPromise(node: ts.FunctionLikeDeclaration, tc: ts.TypeChecker): boolean {
    const type = tc.getReturnTypeOfSignature(tc.getTypeAtLocation(node).getCallSignatures()[0]);
    return type.symbol !== undefined && type.symbol.name === "Promise";
}
