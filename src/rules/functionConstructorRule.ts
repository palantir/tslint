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

import { isCallExpression, isIdentifier, isNewExpression } from "tsutils";
import * as ts from "typescript";

import * as Lint from "..";

import { codeExamples } from "./code-examples/functionConstructor.examples";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        codeExamples,
        description: Lint.Utils.dedent`
            Prevents using the built-in Function constructor.
        `,
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: Lint.Utils.dedent`
            Calling the constructor directly is similar to \`eval\`, which is a symptom of design issues.
            String inputs don't receive type checking and can cause performance issues, particularly when dynamically created.
            
            If you need to dynamically create functions, use "factory" functions that themselves return functions.
        `,
        ruleName: "function-constructor",
        type: "functionality",
        typescriptOnly: false,
    };

    public static FAILURE = "Do not use the Function constructor to create functions.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(context: Lint.WalkContext<void>): void {
    ts.forEachChild(context.sourceFile, function cb(node): void {
        if (isFunctionCallOrNewExpression(node)) {
            addFailureAtNode(node);
        }

        ts.forEachChild(node, cb);
    });

    function addFailureAtNode(node: CallOrNewExpression) {
        context.addFailureAtNode(node, Rule.FAILURE);
    }
}

function isFunctionCallOrNewExpression(node: ts.Node): node is CallOrNewExpression {
    if (isCallExpression(node) || isNewExpression(node)) {
        return isIdentifier(node.expression) && node.expression.text === "Function";
    }

    return false;
}

type CallOrNewExpression = ts.CallExpression | ts.NewExpression;
