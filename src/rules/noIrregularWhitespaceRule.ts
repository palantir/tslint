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

import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-irregular-whitespace",
        description: "Disallow irregular whitespace within a file, including strings and comments.",
        hasFix: true,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "style",
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Irregular whitespace not allowed";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

/* Inspired by: https://github.com/eslint/eslint/blob/master/lib/rules/no-irregular-whitespace.js */
/* tslint:disable:max-line-length */
export const IRREGULAR_WHITESPACE_REGEX = /[\u000b\u000c\u0085\ufeff\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u202f\u205f\u3000\u2028\u2029]+/gm;
/* tslint:enable:max-line-length */

function walk(ctx: Lint.WalkContext<void>): void {
    IRREGULAR_WHITESPACE_REGEX.lastIndex = 0;
    let match: RegExpExecArray | null;
    // tslint:disable-next-line no-conditional-assignment
    while ((match = IRREGULAR_WHITESPACE_REGEX.exec(ctx.sourceFile.text)) !== null) {
        const start = match.index;
        const len = match[0].length;
        const fix = new Lint.Replacement(start, len, " ".repeat(len));
        ctx.addFailureAt(start, len, Rule.FAILURE_STRING, fix);
    }
}
