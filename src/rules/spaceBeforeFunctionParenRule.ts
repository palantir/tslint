/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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

const ALWAYS_OR_NEVER = {
    enum: ["always", "never"],
    type: "string",
};

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Require or disallow a space before function parenthesis",
        hasFix: true,
        optionExamples: [
            true,
            [true, "always"],
            [true, "never"],
            [true, {anonymous: "always", named: "never", asyncArrow: "always"}],
        ],
        options: {
            properties: {
                anonymous: ALWAYS_OR_NEVER,
                asyncArrow: ALWAYS_OR_NEVER,
                constructor: ALWAYS_OR_NEVER,
                method: ALWAYS_OR_NEVER,
                named: ALWAYS_OR_NEVER,
            },
            type: "object",
        },
        optionsDescription: Lint.Utils.dedent`
            One argument which is an object which may contain the keys \`anonymous\`, \`named\`, and \`asyncArrow\`
            These should be set to either \`"always"\` or \`"never"\`.

            * \`"anonymous"\` checks before the opening paren in anonymous functions
            * \`"named"\` checks before the opening paren in named functions
            * \`"asyncArrow"\` checks before the opening paren in async arrow functions
            * \`"method"\` checks before the opening paren in class methods
            * \`"constructor"\` checks before the opening paren in class constructors
        `,
        ruleName: "space-before-function-paren",
        type: "style",
        typescriptOnly: false,
    };
    public static INVALID_WHITESPACE_ERROR = "Spaces before function parens are disallowed";
    public static MISSING_WHITESPACE_ERROR = "Missing whitespace before function parens";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments[0] as Option | Options | undefined));
    }
}

type OptionName = "anonymous" | "asyncArrow" | "constructor" | "method" | "named";
const optionNames: OptionName[] = ["anonymous", "asyncArrow", "constructor", "method", "named"];
type Option = "always" | "never";
type Options = Partial<Record<OptionName, Option>>;

function parseOptions(json: Option | Options | undefined): Options {
    // Need to specify constructor or it will be Object
    const options: Options = { constructor: undefined };
    for (const optionName of optionNames) {
        options[optionName] = typeof json === "object" ? json[optionName] : json === undefined ? "always" : json;
    }
    return options;
}

function walk(ctx: Lint.WalkContext<Options>): void {
    const { options, sourceFile } = ctx;
    ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        const option = getOption(node, options);
        if (option !== undefined) {
            const openParen = Lint.childOfKind(node, ts.SyntaxKind.OpenParenToken)!;
            const hasSpace = ts.isWhiteSpaceLike(sourceFile.text.charCodeAt(openParen.end - 2));

            if (hasSpace && option === "never") {
                const pos = openParen.getStart() - 1;
                ctx.addFailureAt(pos, 1, Rule.INVALID_WHITESPACE_ERROR, Lint.Replacement.deleteText(pos, 1));
            } else if (!hasSpace && option === "always") {
                const pos = openParen.getStart();
                ctx.addFailureAt(pos, 1, Rule.MISSING_WHITESPACE_ERROR, Lint.Replacement.appendText(pos, " "));
            }
        }

        ts.forEachChild(node, cb);
    });
}

function getOption(node: ts.Node, options: Options): Option | undefined {
    switch (node.kind) {
        case ts.SyntaxKind.ArrowFunction:
            return Lint.hasModifier(node.modifiers, ts.SyntaxKind.AsyncKeyword) ? options.asyncArrow : undefined;

        case ts.SyntaxKind.Constructor:
            return options.constructor;

        case ts.SyntaxKind.FunctionDeclaration:
            return options.named;

        case ts.SyntaxKind.FunctionExpression:
            return (node as ts.FunctionExpression).name !== undefined ? options.named : options.anonymous;

        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
            return options.method;

        default:
            return undefined;
    }
}
