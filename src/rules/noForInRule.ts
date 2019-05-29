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
import { isForInStatement } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description:
            "Recommended the avoidance of 'for-in' statements. They can be replaced by Object.keys in a 'for-of' loop.",
        ruleName: "no-for-in",
        rationale:
            "A for(... of ...) loop is easier to implement and read when a for(... in ...) loop, as for(... in ...) require a hasOwnProperty check on objects to ensure proper behaviour.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "typescript",
        typescriptOnly: false,
    };

    public static FAILURE_STRING_FACTORY(initializer: string, expression: string): string {
        return `Do not use the 'for in' statement: 'for (${initializer} in ${expression})'. If this is an object, use 'Object.keys' instead. If this is an array use a standard 'for' or 'for of' loop instead.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext) {
    function cb(node: ts.Node): void {
        if (isForInStatement(node)) {
            const initializer: string = node.initializer.getText();
            const expression: string = node.expression.getText();

            const msg: string = Rule.FAILURE_STRING_FACTORY(initializer, expression);
            ctx.addFailureAt(node.getStart(), node.getWidth(), msg);
        }
        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}