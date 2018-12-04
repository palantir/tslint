/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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

import { isFunctionWithBody, isIdentifier } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    public static DEFAULT_THRESHOLD = 4;
    public static MINIMUM_THRESHOLD = 0;

    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "max-nesting-depth",
        description: "Enforces a maximum threshold of nesting depth.",
        descriptionDetails: Lint.Utils.dedent`
            The nesting depth metric is assessed for each function of any type. It is computed by
            determining the nesting levels of the control statements within the function. A starting
            value of 0 is assigned, this value is incremented each time a new control statement is
            entered, then the value is decremented when the control statement is left. The following
            control statements contribute to the nesting depth computation:
            * \`if\` statements
            * \`?:\` ternary operators
            * \`switch\` statements
            * \`for\`, \`for in\` and \`for of\` loops
            * \`while\` and \`do while\` loops
            * \`try\` \`catch\` and \`finally\` blocks

            The [\`max-nesting-depth\`](../max-nesting-depth) metric and the
            [\`cyclomatic-complexity\`](../cyclomatic-complexity) metric are both computed using the
            control statements. The cyclomatic complexity metric simply counts the control statements
            of the function until its threshold is reached whereas the nesting depth metric increase
            and decrease each time a control statement is entered and left in the function until its
            threshold is reached.`,
        rationale: Lint.Utils.dedent`
            Maximum nesting depth is a code metric which indicates how deep control statements are
            nested in a function. This metric quickly reveals the functions whose code is made
            difficult to read by an excessive nesting of the control statements.

            It's better to have smaller, single-purpose functions with self-documenting names.`,
        optionsDescription: Lint.Utils.dedent`
            An optional upper limit for maximum nesting depth can be specified. If no limit option
            is provided a default value of ${Rule.DEFAULT_THRESHOLD} will be used.`,
        options: {
            type: "number",
            minimum: Rule.MINIMUM_THRESHOLD,
        },
        optionExamples: [true, [true, 5]],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(expected: number, actual: number, name?: string): string {
        return (
            `The function${name === "" ? "" : ` ${name}`} has a nesting depth of at least ` +
            `${actual} which is higher than the threshold of ${expected}`
        );
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

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, { threshold: this.threshold });
    }
}

function getFunctionName(node: ts.FunctionLikeDeclaration): string {
    return node.name !== undefined && isIdentifier(node.name) ? node.name.text : "";
}

function walk(ctx: Lint.WalkContext<{ threshold: number }>): void {
    const {
        options: { threshold },
    } = ctx;
    const nestingDepthStack: number[] = [];
    const functionNameStack: string[] = [];
    const cbNode = (node: ts.Node): void => {
        if (isFunctionWithBody(node)) {
            nestingDepthStack.push(0);
            functionNameStack.push(getFunctionName(node));
            ts.forEachChild(node, cbNode);
            nestingDepthStack.pop();
            functionNameStack.pop();
        } else if (isNestingDepthStatement(node)) {
            nestingDepthStack[nestingDepthStack.length - 1]++;
            // Report at the outer depth and stop walking the AST
            if (nestingDepthStack[nestingDepthStack.length - 1] === threshold + 1) {
                ctx.addFailureAtNode(
                    node,
                    Rule.FAILURE_STRING(
                        threshold,
                        nestingDepthStack[nestingDepthStack.length - 1],
                        functionNameStack[functionNameStack.length - 1],
                    ),
                );
            } else {
                ts.forEachChild(node, cbNode);
            }
            nestingDepthStack[nestingDepthStack.length - 1]--;
        } else {
            return ts.forEachChild(node, cbNode);
        }
    };
    return ts.forEachChild(ctx.sourceFile, cbNode);
}

function isNestingDepthStatement(node: ts.Node) {
    switch (node.kind) {
        case ts.SyntaxKind.ConditionalExpression:
        case ts.SyntaxKind.IfStatement:
        case ts.SyntaxKind.SwitchStatement:
        case ts.SyntaxKind.DoStatement:
        case ts.SyntaxKind.WhileStatement:
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.ForInStatement:
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.TryStatement:
            return true;
        default:
            return false;
    }
}
