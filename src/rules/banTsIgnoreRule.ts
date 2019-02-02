/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import { forEachComment } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

import { codeExamples } from "./code-examples/banTsIgnore.examples";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "ban-ts-ignore",
        description: 'Bans "// @ts-ignore" comments from being used.',
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "typescript",
        typescriptOnly: true,
        codeExamples,
    };
    /* tslint:disable:object-literal-sort-keys */

    public static FAILURE_STRING =
        'Do not use "// @ts-ignore" comments because they suppress compilation errors.';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    const ignoreDiagnosticCommentRegEx = /^\s*\/\/\/?\s*@ts-ignore/;
    forEachComment(ctx.sourceFile, (fullText, comment) => {
        const commentText = fullText.slice(comment.pos, comment.end);
        if (Boolean(commentText.match(ignoreDiagnosticCommentRegEx))) {
            ctx.addFailure(comment.pos, comment.end, Rule.FAILURE_STRING);
        }
    });
}
