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

import { isBinaryExpression } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { codeExamples } from "./code-examples/preferTemplate.examples";

const OPTION_SINGLE_CONCAT = "allow-single-concat";

interface Options {
    allowSingleConcat: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-template",
        description: "Prefer a template expression over string literal concatenation.",
        optionsDescription: Lint.Utils.dedent`
            If \`${OPTION_SINGLE_CONCAT}\` is specified, then a single concatenation (\`x + y\`) is allowed, but not more (\`x + y + z\`).`,
        options: {
            type: "string",
            enum: [OPTION_SINGLE_CONCAT],
        },
        optionExamples: [true, [true, OPTION_SINGLE_CONCAT]],
        type: "style",
        typescriptOnly: false,
        codeExamples,
        hasFix: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Use a template literal instead of concatenating with a string literal.";
    public static FAILURE_STRING_MULTILINE =
        "Use a multiline template literal instead of concatenating string literals with newlines.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.isDeclarationFile) {
            return []; // Not possible in a declaration file
        }

        const allowSingleConcat = this.ruleArguments.indexOf(OPTION_SINGLE_CONCAT) !== -1;
        return this.applyWithFunction(sourceFile, walk, { allowSingleConcat });
    }
}

function walk(ctx: Lint.WalkContext<Options>): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (!isPlusExpression(node)) {
            return ts.forEachChild(node, cb);
        }

        const expressions = extractAllExpressions(node);

        if (!expressions.some(isStringLike)) {
            // No strings/templates so nothing to do
            return;
        }

        if (expressions.every(isStringLike)) {
            // All expressions are strings/templates
            const stringLikeExp = expressions as StringLike[];

            if (stringLikeExp.some(containsNewline)) {
                // If they're joined by a newline, recommend a template expression instead.
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING_MULTILINE);
            } else if (
                stringLikeExp.reduce(containsStringLiteralsOnSameLine(ctx.sourceFile), []) ===
                undefined
            ) {
                // If multiple literals are on the same line, recommend a template expession
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
            // Otherwise ignore.
            return;
        }

        if (
            ctx.options.allowSingleConcat &&
            expressions.length === 2 &&
            (expressions[0].kind === ts.SyntaxKind.StringLiteral ||
                expressions[1].kind === ts.SyntaxKind.StringLiteral)
        ) {
            // Special case allowed by option
            return;
        }
        ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
    });
}

function extractAllExpressions(node: ts.Expression): ts.Expression[] {
    if (!isPlusExpression(node)) {
        return [node];
    }

    const { left, right } = node;

    return Array.prototype.concat(extractAllExpressions(left), extractAllExpressions(right));
}

type StringLike = ts.StringLiteral | ts.TemplateLiteral;

function containsNewline(node: StringLike): boolean {
    if (node.kind === ts.SyntaxKind.TemplateExpression) {
        return node.templateSpans.some(({ literal: { text } }) => text.includes("\n"));
    } else {
        return node.text.includes("\n");
    }
}

function containsStringLiteralsOnSameLine(sourceFile: ts.SourceFile) {
    return (lineNumbers: number[] | undefined, literal: StringLike) => {
        // skip check if undefined
        if (lineNumbers === undefined) {
            return undefined;
        }

        // use literal.end because pos may include leading newlines
        const lineNumber = sourceFile.getLineAndCharacterOfPosition(literal.end).line;
        if (lineNumbers.some(el => el === lineNumber)) {
            // lineNumber collision therefore all further checks can be skipped
            return undefined;
        }
        lineNumbers.push(lineNumber);
        return lineNumbers;
    };
}

function isPlusExpression(node: ts.Node): node is ts.BinaryExpression {
    return isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken;
}

function isStringLike(node: ts.Node): node is StringLike {
    switch (node.kind) {
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
        case ts.SyntaxKind.TemplateExpression:
            return true;
        default:
            return false;
    }
}
