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
    public static metadata: Lint.IRuleMetadata = {
        description: "Disallows `{type}` annotations within JSDoc comments.",
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: "Type annotations in JSDoc comments are unnecessary in TypeScript.",
        ruleName: "no-jsdoc-types",
        type: "style",
        typescriptOnly: true,
    };

    public static FAILURE_STRING = "type annotations in JSDoc comments are unnecessary in TypeScript";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

const violationSearcher = /\@(param|return|returns)( *)\{.*\}/g;
const fixReplacer = /( *)\{.*\}/;

function walk(ctx: Lint.WalkContext<void>) {
    return utils.forEachComment(ctx.sourceFile, (fullText, { kind, pos }) => {
        if (kind !== ts.SyntaxKind.MultiLineCommentTrivia ||
            fullText[pos + 2] !== "*" || fullText[pos + 3] === "*" || fullText[pos + 3] === "/") {
            return;
        }

        while (true) {
            const violation = violationSearcher.exec(fullText);
            if (violation === null) {
                break;
            }

            const text = violation[0];
            const start = pos + violation.index;
            const end = start + text.length;
            const replacement = new Lint.Replacement(start, text.length, text.replace(fixReplacer, ""));

            ctx.addFailure(start, end, Rule.FAILURE_STRING, replacement);
        }
    });
}
