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

const singeLineConfigOptionName = "singleLine";
interface Options {
    [singeLineConfigOptionName]?: "never" | "always";
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "type-literal-delimiter",
        description: Lint.Utils.dedent`
            Checks that type literal members are separated by semicolons.
            Enforces a trailing semicolon for multiline type literals.`,
        optionsDescription: `\`{${singeLineConfigOptionName}: "always"}\` enforces semicolon for one liners`,
        options: {
            type: "object",
            properties: {
                [singeLineConfigOptionName]: {
                    type: "string",
                    enum: ["always", "never"] as Array<Options["singleLine"]>
                }
            }
        },
        hasFix: true,
        optionExamples: [true],
        type: "style",
        typescriptOnly: true
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_MISSING = "Expected type literal to use ';' to separate members.";
    public static FAILURE_STRING_COMMA = "Expected type literal to use ';' instead of ','.";
    public static FAILURE_STRING_TRAILING =
        "Did not expect single-line type literal to have a trailing ';'.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.getRuleOptions());
    }

    private getRuleOptions(): Options {
        if (this.ruleArguments[0] === undefined) {
            return {};
        } else {
            return this.ruleArguments[0] as Options;
        }
    }
}

function walk(ctx: Lint.WalkContext<Options>): void {
    const { sourceFile, options } = ctx;
    ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (isTypeLiteralNode(node)) {
            check(node);
        }
        ts.forEachChild(node, cb);
    });
    function check(node: ts.TypeLiteralNode): void {
        node.members.forEach((member, idx) => {
            const end = member.end - 1;
            // Check if delimiter should be ommitted for a single-line type literal.
            const shouldOmit =
                options.singleLine === "always"
                    ? false
                    : idx === node.members.length - 1 &&
                      isSameLine(sourceFile, node.getStart(sourceFile), node.getEnd());
            const delimiter = sourceFile.text[end];
            switch (delimiter) {
                case ";":
                    if (shouldOmit) {
                        ctx.addFailureAt(
                            end,
                            1,
                            Rule.FAILURE_STRING_TRAILING,
                            Lint.Replacement.replaceFromTo(end, end + 1, "")
                        );
                    }
                    break;
                case ",":
                    ctx.addFailureAt(
                        end,
                        1,
                        Rule.FAILURE_STRING_COMMA,
                        Lint.Replacement.replaceFromTo(end, end + 1, ";")
                    );
                    break;
                default:
                    if (!shouldOmit) {
                        ctx.addFailureAt(
                            end,
                            1,
                            Rule.FAILURE_STRING_MISSING,
                            Lint.Replacement.replaceFromTo(end + 1, end + 1, ";")
                        );
                    }
            }
        });
    }
}
