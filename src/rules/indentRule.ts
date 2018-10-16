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

import { getLineRanges, getTokenAtPosition, isPositionInComment } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_USE_TABS = "tabs";
const OPTION_USE_SPACES = "spaces";
const OPTION_INDENT_SIZE_2 = 2;
const OPTION_INDENT_SIZE_4 = 4;

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "indent",
        description: "Enforces indentation with tabs or spaces.",
        rationale: Lint.Utils.dedent`
            Using only one of tabs or spaces for indentation leads to more consistent editor behavior,
            cleaner diffs in version control, and easier programmatic manipulation.`,
        optionsDescription: Lint.Utils.dedent`
            One of the following arguments must be provided:

            * \`${OPTION_USE_SPACES}\` enforces consistent spaces.
            * \`${OPTION_USE_TABS}\` enforces consistent tabs.

            A second optional argument specifies indentation size:

            * \`${OPTION_INDENT_SIZE_2.toString()}\` enforces 2 space indentation.
            * \`${OPTION_INDENT_SIZE_4.toString()}\` enforces 4 space indentation.

            Indentation size is **required** for auto-fixing, but not for rule checking.

            **NOTE**: auto-fixing will only convert invalid indent whitespace to the desired type, it will not fix invalid whitespace sizes.
            `,
        options: {
            type: "array",
            items: [
                {
                    type: "string",
                    enum: [OPTION_USE_TABS, OPTION_USE_SPACES]
                },
                {
                    type: "number",
                    enum: [OPTION_INDENT_SIZE_2, OPTION_INDENT_SIZE_4]
                }
            ],
            minLength: 0,
            maxLength: 5
        },
        optionExamples: [
            [true, OPTION_USE_SPACES],
            [true, OPTION_USE_SPACES, OPTION_INDENT_SIZE_4],
            [true, OPTION_USE_TABS, OPTION_INDENT_SIZE_2]
        ],
        hasFix: true,
        type: "maintainability",
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(expected: string): string {
        return `${expected} indentation expected`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = parseOptions(this.ruleArguments);
        return options === undefined ? [] : this.applyWithFunction(sourceFile, walk, options);
    }
}

function parseOptions(ruleArguments: any[]): Options | undefined {
    const type = ruleArguments[0] as string;
    if (type !== OPTION_USE_TABS && type !== OPTION_USE_SPACES) {
        return undefined;
    }

    const size = ruleArguments[1] as number | undefined;
    return {
        size: size === OPTION_INDENT_SIZE_2 || size === OPTION_INDENT_SIZE_4 ? size : undefined,
        tabs: type === OPTION_USE_TABS
    };
}

interface Options {
    readonly tabs: boolean;
    readonly size?: 2 | 4;
}

function walk(ctx: Lint.WalkContext<Options>): void {
    const {
        sourceFile,
        options: { tabs, size }
    } = ctx;
    const regExp = tabs ? new RegExp(" ".repeat(size === undefined ? 1 : size)) : /\t/;
    const failure = Rule.FAILURE_STRING(
        tabs ? "tab" : size === undefined ? "space" : `${size} space`
    );

    for (const { pos, contentLength } of getLineRanges(sourceFile)) {
        if (contentLength === 0) {
            continue;
        }
        const line = sourceFile.text.substr(pos, contentLength);
        let indentEnd = line.search(/\S/);
        if (indentEnd === 0) {
            continue;
        }
        if (indentEnd === -1) {
            indentEnd = contentLength;
        }
        const whitespace = line.slice(0, indentEnd);
        if (!regExp.test(whitespace)) {
            continue;
        }
        const token = getTokenAtPosition(sourceFile, pos)!;
        if (
            token.kind !== ts.SyntaxKind.JsxText &&
            (pos >= token.getStart(sourceFile) || isPositionInComment(sourceFile, pos, token))
        ) {
            continue;
        }
        ctx.addFailureAt(pos, indentEnd, failure, createFix(pos, whitespace, tabs, size));
    }
}

function createFix(
    lineStart: number,
    fullLeadingWhitespace: string,
    tabs: boolean,
    size?: number
): Lint.Fix | undefined {
    if (size === undefined) {
        return undefined;
    }
    const replaceRegExp = tabs
        ? // we want to find every group of `size` spaces, plus up to one 'incomplete' group
          new RegExp(`^( {${size}})+( {1,${size - 1}})?`, "g")
        : /\t/g;
    const replacement = fullLeadingWhitespace.replace(replaceRegExp, match =>
        (tabs ? "\t" : " ".repeat(size)).repeat(Math.ceil(match.length / size))
    );
    return new Lint.Replacement(lineStart, fullLeadingWhitespace.length, replacement);
}
