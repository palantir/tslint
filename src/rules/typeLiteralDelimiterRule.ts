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

const OPTION_TYPE_ALIAS_DELIMITER: keyof Options = "type-alias-delimiter";
const OPTION_COMMA = "comma";
const OPTION_SEMICOLON = "semicolon";
const OPTION_IGNORE = "ignore";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "type-literal-delimiter",
        description: Lint.Utils.dedent`
            Checks that type literal members are separated by commas.
            Enforces a trailing delimiter for multi-line type literals.`,
        optionsDescription: Lint.Utils.dedent`
            An options object may be passed with the following keys:

            * '${OPTION_TYPE_ALIAS_DELIMITER}': This may be set to one of:
              - \`"${OPTION_COMMA}"\`: This is the default. Type aliases are treated the same as other type literals.
              - \`"${OPTION_SEMICOLON}"\`: Use semicolons for type aliases instead of commas.
              - \`"ignore"\`: Do not check the delimiter used by a type alias. (Still check for a trailing delimiter.)`,
        options: {
            type: "object",
            properties: {
                [OPTION_TYPE_ALIAS_DELIMITER]: {
                    enum: [
                        OPTION_COMMA,
                        OPTION_SEMICOLON,
                        OPTION_IGNORE,
                    ],
                    type: "string",
                },
            },
        },
        optionExamples: [
            true,
            [true, { [OPTION_TYPE_ALIAS_DELIMITER]: OPTION_SEMICOLON }],
            [true, { [OPTION_TYPE_ALIAS_DELIMITER]: OPTION_IGNORE }],
        ],
        type: "style",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_PREFER(delimiter: string): string {
        return `Expected type literal to use '${delimiter}' as a delimiter.`;
    }
    public static FAILURE_STRING_MISSING(delimiter: string): string {
        return `Expected multi-line type literal to have a trailing '${delimiter}'.`;
    }
    public static FAILURE_STRING_TRAILING(delimiter: string): string {
        return `Did not expect single-line type literal to have a trailing '${delimiter}'.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options: Options = {
            "type-alias-delimiter": OPTION_COMMA,
            ...(this.ruleArguments[0] as Options | undefined),
        };
        return this.applyWithFunction(sourceFile, walk, options);
    }
}

interface Options {
    "type-alias-delimiter": typeof OPTION_COMMA | typeof OPTION_SEMICOLON | typeof OPTION_IGNORE;
}

function walk(ctx: Lint.WalkContext<Options>): void {
    const { sourceFile, options: { "type-alias-delimiter": typeAliasDelimiter } } = ctx;
    ts.forEachChild(sourceFile, function cb(node) {
        if (isTypeLiteralNode(node)) {
            check(node);
        }
        ts.forEachChild(node, cb);
    });

    function check(node: ts.TypeLiteralNode): void {
        const preferred = node.parent!.kind === ts.SyntaxKind.TypeAliasDeclaration
            ? (typeAliasDelimiter === OPTION_SEMICOLON ? ";" : typeAliasDelimiter === OPTION_COMMA ? "," : typeAliasDelimiter)
            : ",";
        const singleLine = isSameLine(sourceFile, node.getStart(sourceFile), node.getEnd());
        node.members.forEach((member, idx) => {
            const end = member.end - 1;
            const delimiter = sourceFile.text[end];
            const anyDelimiter = delimiter === ";" || delimiter === ",";
            // Trailing delimiter should be ommitted for a single-line type literal.
            if (singleLine && idx === node.members.length - 1) {
                if (anyDelimiter) {
                    fail(Rule.FAILURE_STRING_TRAILING(delimiter));
                }
            } else if (anyDelimiter) {
                if (delimiter !== preferred && preferred !== "ignore") {
                    fail(Rule.FAILURE_STRING_PREFER(preferred));
                }
            } else {
                fail(Rule.FAILURE_STRING_MISSING(preferred));
            }

            function fail(failure: string): void {
                ctx.addFailureAt(end, 1, failure);
            }
        });
    }
}
