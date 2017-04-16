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

import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_SINGLE = "single";
const OPTION_DOUBLE = "double";
const OPTION_JSX_SINGLE = "jsx-single";
const OPTION_JSX_DOUBLE = "jsx-double";
const OPTION_AVOID_ESCAPE = "avoid-escape";

interface Options {
    quoteMark: string;
    jsxQuoteMark: string;
    avoidEscape: boolean;
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
            * \`"${OPTION_AVOID_ESCAPE}"\` allows you to use the "other" quotemark in cases where escaping would normally be required.
            For example, \`[true, "${OPTION_DOUBLE}", "${OPTION_AVOID_ESCAPE}"]\` would not report a failure on the string literal
            \`'Hello "World"'\`.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_SINGLE, OPTION_DOUBLE, OPTION_JSX_SINGLE, OPTION_JSX_DOUBLE, OPTION_AVOID_ESCAPE],
            },
            minLength: 0,
            maxLength: 5,
        },
        optionExamples: [
            [true, OPTION_SINGLE, OPTION_AVOID_ESCAPE],
            [true, OPTION_SINGLE, OPTION_JSX_DOUBLE],
        ],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(actual: string, expected: string) {
        return `${actual} should be ${expected}`;
    }

    public isEnabled(): boolean {
        return super.isEnabled() && (this.ruleArguments[0] === OPTION_SINGLE || this.ruleArguments[0] === OPTION_DOUBLE);
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const args = this.ruleArguments;
        const quoteMark = args[0] === OPTION_SINGLE ? "'" : '"';
        return this.applyWithFunction(sourceFile, walk, {
            avoidEscape: args.indexOf(OPTION_AVOID_ESCAPE) !== -1,
            jsxQuoteMark: args.indexOf(OPTION_JSX_SINGLE) !== -1
                          ? "'"
                          : args.indexOf(OPTION_JSX_DOUBLE) ? '"' : quoteMark,
            quoteMark,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.StringLiteral) {
            const expectedQuoteMark = node.parent!.kind === ts.SyntaxKind.JsxAttribute ? ctx.options.jsxQuoteMark : ctx.options.quoteMark;
            const actualQuoteMark = ctx.sourceFile.text[node.end - 1];
            if (actualQuoteMark === expectedQuoteMark) {
                return;
            }
            const start = node.getStart(ctx.sourceFile);
            let text = ctx.sourceFile.text.substring(start + 1, node.end - 1);
            if ((node as ts.StringLiteral).text.includes(expectedQuoteMark)) {
                if (ctx.options.avoidEscape) {
                    return;
                }
                text = text.replace(new RegExp(expectedQuoteMark, "g"), `\\${expectedQuoteMark}`);
            }
            text = text.replace(new RegExp(`\\\\${actualQuoteMark}`, "g"), actualQuoteMark);

            return ctx.addFailure(start, node.end, Rule.FAILURE_STRING(actualQuoteMark, expectedQuoteMark),
                new Lint.Replacement(start, node.end - start, expectedQuoteMark + text + expectedQuoteMark),
            );
        }
        return ts.forEachChild(node, cb);
    });
}
