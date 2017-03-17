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

const OPTION_MIN_CASES = "min-cases";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-switch",
        description: "Prefer a `switch` statement to an `if` statement with simple `===` comparisons.",
        optionsDescription: Lint.Utils.dedent`
            An optional object with the property '${OPTION_MIN_CASES}'.
            This is the number cases needed before a switch statement is recommended.
            Defaults to 2.`,
        options: {
            type: "object",
            properties: {
                [OPTION_MIN_CASES]: { type: "number" },
            },
        },
        optionExamples: ["true", `["true", { "${OPTION_MIN_CASES}": 2 }]`],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Use a switch statement instead of using multiple '===' checks.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = this.getOptions().ruleArguments;
        let minCases = 2;
        if (options.length) {
            const obj = options[0];
            minCases = obj[OPTION_MIN_CASES];
        }
        return this.applyWithFunction(sourceFile, walk, minCases);
    }
}

function walk(ctx: Lint.WalkContext<number>): void {
    const { options: minCases, sourceFile } = ctx;
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (utils.isIfStatement(node) && check(node, sourceFile, minCases)) {
            const { expression, elseStatement } = node;
            ctx.addFailureAtNode(expression, Rule.FAILURE_STRING);
            // Be careful not to fail again for the "else if"
            ts.forEachChild(expression, cb);
            if (elseStatement) {
                ts.forEachChild(elseStatement, cb);
            }
        } else {
            return ts.forEachChild(node, cb);
        }
    });
}

function check(node: ts.IfStatement, sourceFile: ts.SourceFile, minCases: number): boolean {
    let switchVariable: SimpleExpression | undefined;
    let casesSeen = 0;
    const couldBeSwitch = everyCase(node, (expr) => {
        casesSeen++;
        if (switchVariable) {
            return nodeEquals(expr, switchVariable, sourceFile);
        } else {
            switchVariable = expr;
            return true;
        }
    });
    return couldBeSwitch && casesSeen >= minCases;
}

function everyCase({ expression, elseStatement }: ts.IfStatement, test: (e: SimpleExpression) => boolean): boolean {
    if (!everyCondition(expression, test)) {
        return false;
    }
    return !elseStatement || !utils.isIfStatement(elseStatement) || everyCase(elseStatement, test);
}

function everyCondition(node: ts.Expression, test: (e: SimpleExpression) => boolean): boolean {
    if (!utils.isBinaryExpression(node)) {
        return false;
    }

    const { operatorToken, left, right } = node;
    switch (operatorToken.kind) {
        case ts.SyntaxKind.BarBarToken:
            return everyCondition(left, test) && everyCondition(right, test);
        case ts.SyntaxKind.EqualsEqualsEqualsToken:
            return isSimple(left) && isSimple(right) && test(left);
        default:
            return false;
    }
}

function nodeEquals<T extends ts.Node>(a: T, b: T, sourceFile: ts.SourceFile): boolean {
    return a.getText(sourceFile) === b.getText(sourceFile);
}

type SimpleExpression = ts.PropertyAccessEntityNameExpression | ts.Identifier | ts.NumericLiteral | ts.StringLiteral;

function isSimple(node: ts.Node): node is SimpleExpression {
    switch (node.kind) {
        case ts.SyntaxKind.PropertyAccessExpression:
            return isSimple((node as ts.PropertyAccessExpression).expression);
        case ts.SyntaxKind.Identifier:
        case ts.SyntaxKind.NumericLiteral:
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.ThisKeyword:
            return true;
        default:
            return false;
    }
}
