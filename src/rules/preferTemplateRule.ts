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

const OPTION_BINARY_OK = "binary-ok";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-template",
        description: "Prefer a template expression over string literal concatenation.",
        optionsDescription: Lint.Utils.dedent`
            If \`${OPTION_BINARY_OK}\` is specified, then a single concatenation (\`x + y\`) is allowed, but not more (\`x + y + z\`).`,
        options: {
            type: "string",
            enum: [OPTION_BINARY_OK],
        },
        optionExamples: ["true", `[true, "${OPTION_BINARY_OK}"]`],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Use a template literal instead of concatenating with a string literal.";
    public static FAILURE_STRING_MULTILINE = "Use a multiline template literal instead of concatenating string literals with newlines.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.isDeclarationFile) {
            return []; // Not possible in a declaration file
        }

        const binaryOk = this.getOptions().ruleArguments.indexOf(OPTION_BINARY_OK) !== -1;
        return this.applyWithFunction(sourceFile, (ctx) => walk(ctx, binaryOk));
    }
}

function walk(ctx: Lint.WalkContext<void>, binaryOk: boolean): void {
    return ts.forEachChild(ctx.sourceFile, cb);
    function cb(node: ts.Node): void {
        const failure = getError(node, binaryOk);
        if (failure) {
            ctx.addFailureAtNode(node, failure);
        } else {
            return ts.forEachChild(node, cb);
        }
    }
}

function getError(node: ts.Node, binaryOk: boolean): string | undefined {
    if (!isPlusExpression(node)) {
        return undefined;
    }

    const { left, right } = node;
    const l = isStringLike(left);
    const r = isStringLike(right);

    if (l && r) {
        // They're both strings.
        // If they're joined by a newline, recommend a template expression instead.
        // Otherwise ignore. ("a" + "b", probably writing a long newline-less string on many lines.)
        return containsNewline(left as StringLike) || containsNewline(right as StringLike) ? Rule.FAILURE_STRING_MULTILINE : undefined;
    } else if (!l && !r) {
        // Watch out for `"a" + b + c`.
        return containsAnyStringLiterals(left) ? Rule.FAILURE_STRING : undefined;
    } else if (l) {
        // `"x" + y`
        return !binaryOk ? Rule.FAILURE_STRING : undefined;
    } else {
        // `? + "b"`
        return !binaryOk || isPlusExpression(left) ? Rule.FAILURE_STRING : undefined;
    }
}

type StringLike = ts.StringLiteral | ts.TemplateLiteral;

function containsNewline(node: StringLike): boolean {
    if (node.kind === ts.SyntaxKind.TemplateExpression) {
        return node.templateSpans.some(({ literal: { text } }) => text.includes("\n"));
    } else {
        return node.text.includes("\n");
    }
}

function containsAnyStringLiterals(node: ts.Expression): boolean {
    if (!isPlusExpression(node)) {
        return false;
    }

    const { left, right } = node;
    return isStringLike(right) || isStringLike(left) || containsAnyStringLiterals(left);
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
