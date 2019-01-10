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

import { isNoSubstitutionTemplateLiteral, isSameLine, isStringLiteral } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

const OPTION_SINGLE = "single";
const OPTION_DOUBLE = "double";
const OPTION_BACKTICK = "backtick";
const OPTION_JSX_SINGLE = "jsx-single";
const OPTION_JSX_DOUBLE = "jsx-double";
const OPTION_AVOID_TEMPLATE = "avoid-template";
const OPTION_AVOID_ESCAPE = "avoid-escape";

type QUOTEMARK = "'" | '"' | "`";
type JSX_QUOTEMARK = "'" | '"';

interface Options {
    quotemark: QUOTEMARK;
    jsxQuotemark: JSX_QUOTEMARK;
    avoidEscape: boolean;
    avoidTemplate: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "quotemark",
        description: "Enforces quote character for string literals.",
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
            Five arguments may be optionally provided:

            * \`"${OPTION_SINGLE}"\` enforces single quotes.
            * \`"${OPTION_DOUBLE}"\` enforces double quotes.
            * \`"${OPTION_BACKTICK}"\` enforces backticks.
            * \`"${OPTION_JSX_SINGLE}"\` enforces single quotes for JSX attributes.
            * \`"${OPTION_JSX_DOUBLE}"\` enforces double quotes for JSX attributes.
            * \`"${OPTION_AVOID_TEMPLATE}"\` forbids single-line untagged template strings that do not contain string interpolations.
                Note that backticks may still be used if \`"${OPTION_AVOID_ESCAPE}"\` is enabled and both single and double quotes are
                present in the string (the latter option takes precedence).
            * \`"${OPTION_AVOID_ESCAPE}"\` allows you to use the "other" quotemark in cases where escaping would normally be required.
                For example, \`[true, "${OPTION_DOUBLE}", "${OPTION_AVOID_ESCAPE}"]\` would not report a failure on the string literal
                \`'Hello "World"'\`.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    OPTION_SINGLE,
                    OPTION_DOUBLE,
                    OPTION_BACKTICK,
                    OPTION_JSX_SINGLE,
                    OPTION_JSX_DOUBLE,
                    OPTION_AVOID_ESCAPE,
                    OPTION_AVOID_TEMPLATE,
                ],
            },
            minLength: 0,
            maxLength: 5,
        },
        optionExamples: [
            [true, OPTION_SINGLE, OPTION_AVOID_ESCAPE, OPTION_AVOID_TEMPLATE],
            [true, OPTION_SINGLE, OPTION_JSX_DOUBLE],
        ],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(actual: string, expected: string) {
        return `${actual} should be ${expected}`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const args = this.ruleArguments;
        const quotemark = getQuotemarkPreference(args);
        const jsxQuotemark = getJSXQuotemarkPreference(args, quotemark);

        return this.applyWithFunction(sourceFile, walk, {
            avoidEscape: hasArg(OPTION_AVOID_ESCAPE),
            avoidTemplate: hasArg(OPTION_AVOID_TEMPLATE),
            jsxQuotemark,
            quotemark,
        });

        function hasArg(name: string): boolean {
            return args.indexOf(name) !== -1;
        }
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { sourceFile, options } = ctx;
    ts.forEachChild(sourceFile, function cb(node) {
        if (
            isStringLiteral(node) ||
            (options.avoidTemplate &&
                isNoSubstitutionTemplateLiteral(node) &&
                node.parent.kind !== ts.SyntaxKind.TaggedTemplateExpression &&
                isSameLine(sourceFile, node.getStart(sourceFile), node.end))
        ) {
            const expectedQuotemark =
                node.parent.kind === ts.SyntaxKind.JsxAttribute
                    ? options.jsxQuotemark
                    : options.quotemark;
            const actualQuotemark = sourceFile.text[node.end - 1];

            if (actualQuotemark === expectedQuotemark) {
                return;
            }

            let fixQuotemark = expectedQuotemark;
            const needsQuoteEscapes = node.text.includes(expectedQuotemark);

            // This string requires escapes to use the expected quote mark, but `avoid-escape` was passed
            if (needsQuoteEscapes && options.avoidEscape) {
                if (node.kind === ts.SyntaxKind.StringLiteral) {
                    return;
                }

                // If we are expecting double quotes, use single quotes to avoid escaping.
                // Otherwise, just use double quotes.
                const alternativeFixQuotemark = expectedQuotemark === '"' ? "'" : '"';

                if (node.text.includes(alternativeFixQuotemark)) {
                    // It also includes the alternative fix quote mark. Let's try to use single quotes instead,
                    // unless we originally expected single quotes, in which case we will try to use backticks.
                    // This means that we may use backtick even with avoid-template in trying to avoid escaping.
                    fixQuotemark = expectedQuotemark === "'" ? "`" : "'";

                    if (fixQuotemark === actualQuotemark) {
                        // We were already using the best quote mark for this scenario
                        return;
                    } else if (node.text.includes(fixQuotemark)) {
                        // It contains all of the other kinds of quotes. Escaping is unavoidable, sadly.
                        return;
                    }
                } else {
                    fixQuotemark = alternativeFixQuotemark;
                }
            }

            const start = node.getStart(sourceFile);
            let text = sourceFile.text.substring(start + 1, node.end - 1);

            if (needsQuoteEscapes) {
                text = text.replace(new RegExp(fixQuotemark, "g"), `\\${fixQuotemark}`);
            }

            text = text.replace(new RegExp(`\\\\${actualQuotemark}`, "g"), actualQuotemark);

            return ctx.addFailure(
                start,
                node.end,
                Rule.FAILURE_STRING(actualQuotemark, fixQuotemark),
                new Lint.Replacement(start, node.end - start, fixQuotemark + text + fixQuotemark),
            );
        }
        ts.forEachChild(node, cb);
    });
}

function getQuotemarkPreference(ruleArguments: any[]): QUOTEMARK {
    for (const arg of ruleArguments) {
        switch (arg) {
            case OPTION_SINGLE:
                return "'";
            case OPTION_DOUBLE:
                return '"';
            case OPTION_BACKTICK:
                return "`";
            default:
                continue;
        }
    }

    // Default to double quotes if no pref is found.
    return '"';
}

function getJSXQuotemarkPreference(ruleArguments: any[], regularQuotemarkPreference: QUOTEMARK): JSX_QUOTEMARK {
    for (const arg of ruleArguments) {
        switch (arg) {
            case OPTION_JSX_SINGLE:
                return "'";
            case OPTION_JSX_DOUBLE:
                return '"';
            default:
                continue;
        }
    }

    // The JSX preference was not found, so try to use the regular preference.
    //   If the regular pref is backtick, use double quotes instead.
    return regularQuotemarkPreference !== "`" ? regularQuotemarkPreference : '"';
}
