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

import { getChildOfKind, isArrowFunction } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const BAN_SINGLE_ARG_PARENS = "ban-single-arg-parens";

interface Options {
    banSingleArgParens: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "arrow-parens",
        description: "Requires parentheses around the parameters of arrow function definitions.",
        hasFix: true,
        rationale: "Maintains stylistic consistency with other arrow function definitions.",
        optionsDescription: Lint.Utils.dedent`
            If \`${BAN_SINGLE_ARG_PARENS}\` is specified, then arrow functions with one parameter
            must not have parentheses if removing them is allowed by TypeScript.`,
        options: {
            type: "string",
            enum: [BAN_SINGLE_ARG_PARENS],
        },
        optionExamples: [true, [true, BAN_SINGLE_ARG_PARENS]],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_MISSING =
        "Parentheses are required around the parameters of an arrow function definition";
    public static FAILURE_STRING_EXISTS =
        "Parentheses are prohibited around the parameter in this single parameter arrow function";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            banSingleArgParens: this.ruleArguments.indexOf(BAN_SINGLE_ARG_PARENS) !== -1,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    function cb(node: ts.Node): void {
        if (isArrowFunction(node) && parensAreOptional(node)) {
            const openParen = getChildOfKind(node, ts.SyntaxKind.OpenParenToken);
            if (openParen === undefined) {
                if (!ctx.options.banSingleArgParens) {
                    const parameter = node.parameters[0];
                    const start = parameter.getStart(ctx.sourceFile);
                    const end = parameter.end;
                    ctx.addFailure(start, end, Rule.FAILURE_STRING_MISSING, [
                        Lint.Replacement.appendText(start, "("),
                        Lint.Replacement.appendText(end, ")"),
                    ]);
                }
            } else if (ctx.options.banSingleArgParens) {
                const closeParen = getChildOfKind(node, ts.SyntaxKind.CloseParenToken)!;
                const charBeforeOpenParen = ctx.sourceFile.text.substring(
                    openParen.pos - 1,
                    openParen.pos,
                );
                const replaceValue = charBeforeOpenParen.match(/[a-z]/i) !== null ? " " : "";
                ctx.addFailureAtNode(node.parameters[0], Rule.FAILURE_STRING_EXISTS, [
                    Lint.Replacement.replaceFromTo(
                        openParen.pos,
                        node.parameters[0].getStart(ctx.sourceFile),
                        replaceValue,
                    ),
                    Lint.Replacement.deleteFromTo(node.parameters[0].end, closeParen.end),
                ]);
            }
        }
        return ts.forEachChild(node, cb);
    }
    return ts.forEachChild(ctx.sourceFile, cb);
}

function parensAreOptional(node: ts.ArrowFunction) {
    return (
        node.parameters.length === 1 &&
        node.typeParameters === undefined &&
        node.type === undefined &&
        isSimpleParameter(node.parameters[0])
    );
}

function isSimpleParameter(parameter: ts.ParameterDeclaration): boolean {
    return (
        parameter.name.kind === ts.SyntaxKind.Identifier &&
        parameter.dotDotDotToken === undefined &&
        parameter.initializer === undefined &&
        parameter.questionToken === undefined &&
        parameter.type === undefined
    );
}
