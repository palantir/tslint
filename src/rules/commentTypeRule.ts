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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

// Options
type CommentType = "singleline" | "multiline" | "doc" | "directive";

type Options = Set<CommentType>;

function parseOptions(opts: any[]): Options {
    return new Set(opts);
}

// Constant Messages
const MULTILINE_FAILURE = "multiline comments are not allowed";
const SINGLE_LINE_FAILURE = "singleline comments are not allowed";
const DOC_FAILURE = "doc comments are not allowed";
const DIRECTIVE_FAILURE = "triple-slash directives are not allowed";

// Logic
export class Rule extends Lint.Rules.AbstractRule {
    // tslint:disable:object-literal-sort-keys
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "comment-type",
        description: "Allows a limited set of comment types",
        optionsDescription: Lint.Utils.dedent`
            One or more of the following mutually exclusive comment types may be provided:

            * \`singleline\`: Comments starting with \`//\`
            * \`multiline\`:  Comments between \`/*\` and \`*/\` but are not doc comments
            * \`doc\`:        Multiline comments that start with \`/**\`
            * \'directive\':  Triple-slash directives that are singleline comments starting with \`///\``,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: ["singleline", "multiline", "doc", "directive"]
            },
            uniqueItems: true
        },
        optionExamples: [[true, "doc", "singleline"], [true, "singleline"], [true, "multiline"]],
        hasFix: false,
        type: "style",
        typescriptOnly: false
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments));
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    utils.forEachComment(ctx.sourceFile, (fullText, { kind, pos, end }) => {
        if (kind === ts.SyntaxKind.SingleLineCommentTrivia) {
            // directive
            if (fullText.slice(pos, pos + 3) === "///" && !ctx.options.has("directive")) {
                ctx.addFailure(pos, end, DIRECTIVE_FAILURE);
                // singleline
            } else if (fullText.slice(pos, pos + 3) !== "///" && !ctx.options.has("singleline")) {
                ctx.addFailure(pos, end, SINGLE_LINE_FAILURE);
            }
        } else if (kind === ts.SyntaxKind.MultiLineCommentTrivia) {
            // doc
            if (fullText.slice(pos, pos + 3) === "/**" && !ctx.options.has("doc")) {
                ctx.addFailure(pos, end, DOC_FAILURE);
                // multiline
            } else if (fullText.slice(pos, pos + 3) !== "/**" && !ctx.options.has("multiline")) {
                ctx.addFailure(pos, end, MULTILINE_FAILURE);
            }
        }
    });
}
