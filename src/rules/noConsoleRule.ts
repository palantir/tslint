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

import { isIdentifier, isPropertyAccessExpression } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-console",
        description: "Bans the use of specified `console` methods.",
        rationale: "In general, `console` methods aren't appropriate for production code.",
        optionsDescription:
            "A list of method names to ban. If no method names are provided, all console methods are banned.",
        options: {
            type: "array",
            items: { type: "string" }
        },
        optionExamples: [[true, "log", "error"]],
        type: "functionality",
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(method: string) {
        return `Calls to 'console.${method}' are not allowed.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
    }
}

function walk(ctx: Lint.WalkContext<string[]>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (
            isPropertyAccessExpression(node) &&
            isIdentifier(node.expression) &&
            node.expression.text === "console" &&
            (ctx.options.length === 0 || ctx.options.indexOf(node.name.text) !== -1)
        ) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING_FACTORY(node.name.text));
        }
        return ts.forEachChild(node, cb);
    });
}
