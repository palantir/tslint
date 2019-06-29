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
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale:
            "A for(... of ...) loop is easier to implement and read when a for(... in ...) loop, as for(... in ...) require a hasOwnProperty check on objects to ensure proper behaviour.",
        ruleName: "no-for-in",
        type: "typescript",
        typescriptOnly: false,
    };

    public static FAILURE_STRING_FACTORY(): string {
        return `Use a for...of statement instead of for...in. If iterating over an object, use Object.keys() to access its enumerable keys.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext) {
    function cb(node: ts.Node): void {
        if (isForInStatement(node)) {
            const msg: string = Rule.FAILURE_STRING_FACTORY();
            ctx.addFailureAt(node.getStart(), node.getWidth(), msg);
        }
        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
