/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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

import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "promise-functions-async",
        description: "Requires any function or method that returns a promise to be marked async.",
        rationale: "Ensures that a function can only either return a rejected promise or throw an Error object.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "functions that return promises must be async";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new PreferForOfWalker(sourceFile, this.getOptions()));
    }
}

class PromiseAsyncWalker extends Lint.RuleWalker {
    private test(node: ts.FunctionExpression|ts.MethodDeclaration): void {
        const isAsync   = node.getText().split(/[\(=]/)[0].match(/\s?async\s+?/) !== null;
        const isPromise = node.type.getText().indexOf("Promise<") === 0;

        if (isAsync || !isPromise) {
            return;
        }

        this.addFailure(
            this.createFailure(
                node.getStart(),
                node.getWidth(),
                Rule.FAILURE_STRING
            )
        );
    }

    public visitFunctionExpression(node: ts.FunctionExpression): void {
        this.test(node);
        super.visitFunctionExpression(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.test(node);
        super.visitMethodDeclaration(node);
    }
}
