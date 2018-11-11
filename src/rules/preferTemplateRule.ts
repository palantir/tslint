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

interface EvaluatedExpression {
    exp: ts.Expression;
    line: number;
    char: number;
    isStringLike: boolean;
    hasNewLine: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-template",
        description: Lint.Utils.dedent`
            Prefer a template expression over string literal concatenation.

            There is one expection for this rule regarding long strings. It is allowed
            to concatenate strings and template expressions if they do not contain a
            newline character and there is exactly one expression per line.`,
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

        const expressions = extractExpressions(node);

        if (// No strings/templates so nothing to do
            !expressions.some(isStringLike)
            // Special case allowed by option
            || (ctx.options.allowSingleConcat && isSingleConcat(expressions))) {
            return;
        }

        const evalExpressions = evaluateExpressions(expressions, ctx.sourceFile);

        if (evalExpressions.some((exp) => exp.isStringLike && exp.hasNewLine)) {
            // Multiline template
            // Currently no fixer available
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING_MULTILINE);
        } else {
            // (Concatenated) single line stringlikes
            const groupedExpressions = groupBy(evalExpressions, (el) => el.line);
            groupedExpressions.forEach((exps) => {
                if (exps.length <= 1) { return; }

                const fix = exps.every((exp) => exp.exp.kind === ts.SyntaxKind.StringLiteral)
                    ? concatStrings(exps)
                    : concatMixed(exps);
                ctx.addFailure(exps[0].exp.getStart(), exps[exps.length - 1].exp.end, Rule.FAILURE_STRING, fix);
            });
        }
    });
}

function isSingleConcat(expressions: ts.Expression[]) {
    return expressions.length === 2
        && ((expressions[0].kind === ts.SyntaxKind.StringLiteral && !isStringLike(expressions[1]))
            || (!isStringLike(expressions[0]) && expressions[1].kind === ts.SyntaxKind.StringLiteral));
}

function evaluateExpressions(expressions: ts.Expression[], sourceFile: ts.SourceFile): EvaluatedExpression[] {
    return expressions.map((exp) => {
        const lineAndChar = sourceFile.getLineAndCharacterOfPosition(exp.getStart());
        return {
            char: lineAndChar.character,
            exp,
            hasNewLine: isStringLike(exp) ? containsNewline(exp) : false,
            isStringLike: isStringLike(exp),
            line: lineAndChar.line,
        };
    });
}

function extractExpressions(node: ts.Expression): ts.Expression[] {
    if (!isPlusExpression(node)) {
        return [node];
    }

    const { left, right } = node;

    return Array.prototype.concat(extractExpressions(left), extractExpressions(right));
}

type StringLike = ts.StringLiteral | ts.TemplateLiteral;

function containsNewline(node: StringLike): boolean {
    if (node.kind === ts.SyntaxKind.TemplateExpression) {
        return node.templateSpans.some(({ literal: { text } }) => text.includes("\n"));
    } else {
        return node.text.includes("\n");
    }
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

type Key = string | number | symbol;
function groupBy<T, U extends Key>(array: T[], accessor: (el: T) => U): Map<U, T[]> {
    return array.reduce(
        (prev, cur) => {
            const key = accessor(cur);
            const elements = prev.get(key);
            if (elements == undefined) {
                prev.set(key, [cur]);
            } else {
                elements.push(cur);
            }
            return prev;
        },
        new Map<U, T[]>());
}

function concatStrings(evalExp: EvaluatedExpression[]) {
    const exps = evalExp.sort((e1, e2) => e1.char - e2.char);

    const fixes: Lint.Replacement[] = [];
    for (let i = 0; i < exps.length - 1; i++) {
        const start = exps[i].exp.end - 1;
        const end = exps[i + 1].exp.getStart() + 1;
        fixes.push(Lint.Replacement.deleteFromTo(start, end));
    }
    return fixes;
}

function concatMixed(evalExp: EvaluatedExpression[]) {
    const exps = evalExp.sort((e1, e2) => e1.char - e2.char);

    const fixes: Lint.Replacement[] = [];

    if (!exps[0].isStringLike) {
        // tslint:disable-next-line:no-invalid-template-strings
        fixes.push(Lint.Replacement.appendText(exps[0].exp.getStart(), "`${"));
    } else if (exps[0].exp.kind === ts.SyntaxKind.StringLiteral) {
        fixes.push(new Lint.Replacement(exps[0].exp.getStart(), 1, "`"));
    }

    for (let i = 0; i < exps.length - 1; i++) {
        const eval1 = exps[i];
        const exp1 = eval1.exp;
        const eval2 = exps[i + 1];
        const exp2 = eval2.exp;

        if (!eval1.isStringLike && !eval2.isStringLike) { continue; }
        if (!eval1.isStringLike) {
            fixes.push(Lint.Replacement.replaceFromTo(exp1.end, exp2.getStart() + 1, "}"));
            continue;
        }
        if (!eval2.isStringLike) {
            // tslint:disable-next-line:no-invalid-template-strings
            fixes.push(Lint.Replacement.replaceFromTo(exp1.end - 1, exp2.getStart(), "${"));
            continue;
        }
        fixes.push(Lint.Replacement.deleteFromTo(exp1.end - 1, exp2.getStart() + 1));
    }

    if (!exps[exps.length - 1].isStringLike) {
        fixes.push(Lint.Replacement.appendText(exps[exps.length - 1].exp.end, "}`"));
    } else if (exps[exps.length - 1].exp.kind === ts.SyntaxKind.StringLiteral) {
        fixes.push(new Lint.Replacement(exps[exps.length - 1].exp.end - 1, 1, "`"));
    }

    return fixes;
}
