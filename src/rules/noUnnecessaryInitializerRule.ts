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

import { getChildOfKind, isBindingPattern, isNodeFlagSet } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unnecessary-initializer",
        description:
            "Forbids a 'var'/'let' statement or destructuring initializer to be initialized to 'undefined'.",
        hasFix: true,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        rationale: Lint.Utils.dedent`
            Values in JavaScript default to \`undefined\`.
            There's no need to do so manually.
        `,
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Unnecessary initialization to 'undefined'.";
    public static FAILURE_STRING_PARAMETER =
        "Use an optional parameter instead of initializing to 'undefined'. " +
        "Also, the type declaration does not need to include '| undefined'.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.BindingElement:
                checkInitializer(node as ts.BindingElement);
                break;

            case ts.SyntaxKind.VariableDeclaration:
                if (
                    !isBindingPattern((node as ts.VariableDeclaration).name) &&
                    !isNodeFlagSet(node.parent, ts.NodeFlags.Const)
                ) {
                    checkInitializer(node as ts.VariableDeclaration);
                }
                break;

            case ts.SyntaxKind.MethodDeclaration:
            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.Constructor: {
                const { parameters } = node as ts.FunctionLikeDeclaration;
                parameters.forEach((parameter, i) => {
                    if (isUndefined(parameter.initializer)) {
                        if (parametersAllOptionalAfter(parameters, i)) {
                            // No fix since they may want to remove '| undefined' from the type.
                            ctx.addFailureAtNode(parameter, Rule.FAILURE_STRING_PARAMETER);
                        } else {
                            failWithFix(parameter);
                        }
                    }
                });
            }
        }
        ts.forEachChild(node, cb);
    });

    function checkInitializer(node: ts.VariableDeclaration | ts.BindingElement) {
        if (isUndefined(node.initializer)) {
            failWithFix(node);
        }
    }

    function failWithFix(
        node: ts.VariableDeclaration | ts.BindingElement | ts.ParameterDeclaration,
    ) {
        const fix = Lint.Replacement.deleteFromTo(
            getChildOfKind(node, ts.SyntaxKind.EqualsToken)!.pos,
            node.end,
        );
        ctx.addFailureAtNode(node, Rule.FAILURE_STRING, fix);
    }
}

function parametersAllOptionalAfter(
    parameters: ReadonlyArray<ts.ParameterDeclaration>,
    idx: number,
): boolean {
    for (let i = idx + 1; i < parameters.length; i++) {
        if (parameters[i].questionToken !== undefined) {
            return true;
        }
        if (parameters[i].initializer === undefined) {
            return false;
        }
    }
    return true;
}

function isUndefined(node: ts.Node | undefined): boolean {
    return (
        node !== undefined &&
        node.kind === ts.SyntaxKind.Identifier &&
        (node as ts.Identifier).originalKeywordKind === ts.SyntaxKind.UndefinedKeyword
    );
}
