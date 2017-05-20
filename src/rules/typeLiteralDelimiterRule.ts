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

import { isSameLine, isTypeLiteralNode } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "type-literal-delimiter",
        description: Lint.Utils.dedent`
            Checks that single-line type literal members are separated by commas.
            Checks that multi-line type literal members are separated by semicolons.
            Enforces a trailing semicolon for multi-line type literals.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "style",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_MISSING =
        "Expected multi-line type literal to have a trailing ';'.";
    public static FAILURE_STRING_PREFER_COMMA =
        "Expected multi-line type literal to use ';' instead of ','.";
    public static FAILURE_STRING_PREFER_SEMICOLON =
        "Expected single-line type literal to use ',' instead of ';'.";
    public static FAILURE_STRING_TRAILING(delimiter: string): string {
        return `Did not expect single-line type literal to have a trailing '${delimiter}'.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    const { sourceFile } = ctx;
    ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (isTypeLiteralNode(node)) {
            check(node);
        }
        ts.forEachChild(node, cb);
    });

    function check(node: ts.TypeLiteralNode): void {
        const preferComma = isSameLine(sourceFile, node.getStart(sourceFile), node.getEnd());
        node.members.forEach((member, idx) => {
            const end = member.end - 1;
            const delimiter = sourceFile.text[end];
            const anyDelimiter = delimiter === ";" || delimiter === ",";
            // Trailing delimiter should be ommitted for a single-line type literal.
            if (preferComma && idx === node.members.length - 1) {
                if (anyDelimiter) {
                    fail(Rule.FAILURE_STRING_TRAILING(delimiter));
                }
            } else if (anyDelimiter) {
                if ((delimiter === ",") !== preferComma) {
                    fail(preferComma ? Rule.FAILURE_STRING_PREFER_SEMICOLON : Rule.FAILURE_STRING_PREFER_COMMA);
                }
            } else {
                fail(Rule.FAILURE_STRING_MISSING);
            }

            function fail(failure: string): void {
                ctx.addFailureAt(end, 1, failure);
            }
        });
    }
}
