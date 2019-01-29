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

import { isForStatement, isVariableStatement } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

import { codeExamples } from "./code-examples/oneVariablePerDeclaration.examples";

const OPTION_IGNORE_FOR_LOOP = "ignore-for-loop";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "one-variable-per-declaration",
        description: "Disallows multiple variable definitions in the same declaration statement.",
        optionsDescription: Lint.Utils.dedent`
            One argument may be optionally provided:

            * \`${OPTION_IGNORE_FOR_LOOP}\` allows multiple variable definitions in a for loop declaration.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_IGNORE_FOR_LOOP],
            },
            minLength: 0,
            maxLength: 1,
        },
        optionExamples: [true, [true, OPTION_IGNORE_FOR_LOOP]],
        type: "style",
        typescriptOnly: false,
        codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Multiple variable declarations in the same statement are forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            ignoreForLoop: this.ruleArguments.indexOf(OPTION_IGNORE_FOR_LOOP) !== -1,
        });
    }
}

function walk(ctx: Lint.WalkContext<{ ignoreForLoop: boolean }>): void {
    ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (isVariableStatement(node) && node.declarationList.declarations.length > 1) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        } else if (isForStatement(node) && !ctx.options.ignoreForLoop) {
            const { initializer } = node;
            if (
                initializer !== undefined &&
                initializer.kind === ts.SyntaxKind.VariableDeclarationList &&
                (initializer as ts.VariableDeclarationList).declarations.length > 1
            ) {
                ctx.addFailureAtNode(initializer, Rule.FAILURE_STRING);
            }
        }
        ts.forEachChild(node, cb);
    });
}
