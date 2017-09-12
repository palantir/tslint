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
const OPTION_JSX_SINGLE = "jsx-single";
const OPTION_JSX_DOUBLE = "jsx-double";
const OPTION_AVOID_TEMPLATE = "avoid-template";
const OPTION_AVOID_ESCAPE = "avoid-escape";

interface Options {
    quoteMark: '"' | "'";
    jsxQuoteMark: '"' | "'";
    avoidEscape: boolean;
    avoidTemplate: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "quotemark",
        description: "Requires single or double quotes for string literals.",
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
            Five arguments may be optionally provided:

            * \`"${OPTION_SINGLE}"\` enforces single quotes.
            * \`"${OPTION_DOUBLE}"\` enforces double quotes.
            * \`"${OPTION_JSX_SINGLE}"\` enforces single quotes for JSX attributes.
            * \`"${OPTION_JSX_DOUBLE}"\` enforces double quotes for JSX attributes.
            * \`"${OPTION_AVOID_TEMPLATE}"\` forbids single-line untagged template strings that do not contain string interpolations.
            * \`"${OPTION_AVOID_ESCAPE}"\` allows you to use the "other" quotemark in cases where escaping would normally be required.
            For example, \`[true, "${OPTION_DOUBLE}", "${OPTION_AVOID_ESCAPE}"]\` would not report a failure on the string literal
            \`'Hello "World"'\`.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_SINGLE, OPTION_DOUBLE, OPTION_JSX_SINGLE, OPTION_JSX_DOUBLE, OPTION_AVOID_ESCAPE, OPTION_AVOID_TEMPLATE],
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
        const quoteMark = getQuotemarkPreference(args) === OPTION_SINGLE ? "'" : '"';
        return this.applyWithFunction(sourceFile, walk, {
            avoidEscape: hasArg(OPTION_AVOID_ESCAPE),
            avoidTemplate: hasArg(OPTION_AVOID_TEMPLATE),
            jsxQuoteMark: hasArg(OPTION_JSX_SINGLE) ? "'" : hasArg(OPTION_JSX_DOUBLE) ? '"' : quoteMark,
            quoteMark,
        });

        function hasArg(name: string): boolean {
            return args.indexOf(name) !== -1;
        }
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { sourceFile, options } = ctx;
    ts.forEachChild(sourceFile, function cb(node) {
        if (isStringLiteral(node)
                || options.avoidTemplate && isNoSubstitutionTemplateLiteral(node)
                && node.parent!.kind !== ts.SyntaxKind.TaggedTemplateExpression
                && isSameLine(sourceFile, node.getStart(sourceFile), node.end)) {
            const expectedQuoteMark = node.parent!.kind === ts.SyntaxKind.JsxAttribute ? options.jsxQuoteMark : options.quoteMark;
            const actualQuoteMark = sourceFile.text[node.end - 1];
            if (actualQuoteMark === expectedQuoteMark) {
                return;
            }

            let fixQuoteMark = expectedQuoteMark;

            const needsQuoteEscapes = node.text.includes(expectedQuoteMark);
            if (needsQuoteEscapes && options.avoidEscape) {
                if (node.kind === ts.SyntaxKind.StringLiteral) {
                    return;
                }

                // If expecting double quotes, fix a template `a "quote"` to `a 'quote'` anyway,
                // always preferring *some* quote mark over a template.
                fixQuoteMark = expectedQuoteMark === '"' ? "'" : '"';
                if (node.text.includes(fixQuoteMark)) {
                    return;
                }
            }

            const start = node.getStart(sourceFile);
            let text = sourceFile.text.substring(start + 1, node.end - 1);
            if (needsQuoteEscapes) {
                text = text.replace(new RegExp(fixQuoteMark, "g"), `\\${fixQuoteMark}`);
            }
            text = text.replace(new RegExp(`\\\\${actualQuoteMark}`, "g"), actualQuoteMark);
            return ctx.addFailure(
                start, node.end, Rule.FAILURE_STRING(actualQuoteMark, fixQuoteMark),
                new Lint.Replacement(start, node.end - start, fixQuoteMark + text + fixQuoteMark));
        }
        ts.forEachChild(node, cb);
    });
}

function getQuotemarkPreference(args: any[]): string | undefined {
    for (const arg of args) {
        if (arg === OPTION_SINGLE || arg === OPTION_DOUBLE) {
            return arg as string;
        }
    }
    return undefined;
}
