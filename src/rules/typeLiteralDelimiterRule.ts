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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "type-literal-delimiter",
        description: Lint.Utils.dedent`
            Checks that type literal members are separated by commas.
            Does not check the last member, as that is done by 'trailing-comma'.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_MISSING =
        "Expected type literal to use ',' to separate members.";
    public static FAILURE_STRING_SEMICOLON =
        "Expected type literal to use ',' instead of ';'.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    const { sourceFile } = ctx;
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (utils.isTypeLiteralNode(node)) {
            check(node);
        } else {
            return ts.forEachChild(node, cb);
        }
    });

    function check({ members }: ts.TypeLiteralNode): void {
        members.forEach((member, idx) => {
            const end = member.end - 1;
            const delimiter = sourceFile.text[end];
            if (delimiter === ",") {
                return;
            }

            // Allow missing trailing ',', but do not allow trailing ';'.
            if (delimiter === ";") {
                ctx.addFailureAt(end, 1, Rule.FAILURE_STRING_SEMICOLON);
            } else if (idx !== members.length - 1) {
                ctx.addFailureAt(end, 1, Rule.FAILURE_STRING_MISSING);
            }
        });
    }
}
