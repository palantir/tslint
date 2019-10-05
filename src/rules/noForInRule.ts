/**
 * @license
 * Copyright 2019 Palantir Technologies, Inc.
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
        description: "Ban the usage of for...in statements.",
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale:
            "for...in statements are legacy JavaScript syntax which usually require a verbose `hasOwnProperty` check inside their loop body. These statements can be fully replaced with for...of statements in modern JS & TS.",
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
