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

import { isIdentifier } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";
import { isFunctionScopeBoundary } from "../utils";

export class Rule extends Lint.Rules.AbstractRule {
    public static DEFAULT_THRESHOLD = 20;
    public static MINIMUM_THRESHOLD = 2;

    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "cyclomatic-complexity",
        description: "Enforces a threshold of cyclomatic complexity.",
        descriptionDetails: Lint.Utils.dedent`
            Cyclomatic complexity is assessed for each function of any type. A starting value of 0
            is assigned and this value is then incremented for every statement which can branch the
            control flow within the function. The following statements and expressions contribute
            to cyclomatic complexity:
            * \`catch\`
            * \`if\` and \`? :\`
            * \`||\` and \`&&\` due to short-circuit evaluation
            * \`for\`, \`for in\` and \`for of\` loops
            * \`while\` and \`do while\` loops
            * \`case\` clauses that contain statements`,
        rationale: Lint.Utils.dedent`
            Cyclomatic complexity is a code metric which indicates the level of complexity in a
            function. High cyclomatic complexity indicates confusing code which may be prone to
            errors or difficult to modify.

            It's better to have smaller, single-purpose functions with self-documenting names.`,
        optionsDescription: Lint.Utils.dedent`
            An optional upper limit for cyclomatic complexity can be specified. If no limit option
            is provided a default value of ${Rule.DEFAULT_THRESHOLD} will be used.`,
        options: {
            type: "number",
            minimum: Rule.MINIMUM_THRESHOLD,
        },
        optionExamples: [true, [true, 20]],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(expected: number, actual: number, name?: string): string {
        return (
            `The function${name === undefined ? "" : ` ${name}`} has a cyclomatic complexity of ` +
            `${actual} which is higher than the threshold of ${expected}`
        );
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, { threshold: this.threshold });
    }

    public isEnabled(): boolean {
        // Disable the rule if the option is provided but non-numeric or less than the minimum.
        const isThresholdValid =
            typeof this.threshold === "number" && this.threshold >= Rule.MINIMUM_THRESHOLD;
        return super.isEnabled() && isThresholdValid;
    }

    private get threshold(): number {
        if (this.ruleArguments[0] !== undefined) {
            return this.ruleArguments[0] as number;
        }
        return Rule.DEFAULT_THRESHOLD;
    }
}

function walk(ctx: Lint.WalkContext<{ threshold: number }>): void {
    const {
        options: { threshold },
    } = ctx;
    let complexity = 0;

    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        // tslint:disable:deprecation This is needed for https://github.com/palantir/tslint/pull/4274 and will be fixed once TSLint
        // requires tsutils > 3.0.
        if (isFunctionScopeBoundary(node)) {
            // tslint:enable:deprecation
            const old = complexity;
            complexity = 1;
            ts.forEachChild(node, cb);
            if (complexity > threshold) {
                const { name } = node as ts.FunctionLikeDeclaration;
                const nameStr = name !== undefined && isIdentifier(name) ? name.text : undefined;
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING(threshold, complexity, nameStr));
            }
            complexity = old;
        } else {
            if (increasesComplexity(node)) {
                complexity++;
            }
            return ts.forEachChild(node, cb);
        }
    });
}

function increasesComplexity(node: ts.Node): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.CaseClause:
            return (node as ts.CaseClause).statements.length > 0;
        case ts.SyntaxKind.CatchClause:
        case ts.SyntaxKind.ConditionalExpression:
        case ts.SyntaxKind.DoStatement:
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.ForInStatement:
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.IfStatement:
        case ts.SyntaxKind.WhileStatement:
            return true;

        case ts.SyntaxKind.BinaryExpression:
            switch ((node as ts.BinaryExpression).operatorToken.kind) {
                case ts.SyntaxKind.BarBarToken:
                case ts.SyntaxKind.AmpersandAmpersandToken:
                    return true;
                default:
                    return false;
            }

        default:
            return false;
    }
}
