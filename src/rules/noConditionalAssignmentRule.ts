/**
 * @license
 * Copyright 2015 Palantir Technologies, Inc.
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

import {
    isAssertionExpression, isAssignmentKind, isBinaryExpression, isConditionalExpression, isDoStatement, isForStatement, isIfStatement,
    isNonNullExpression, isParenthesizedExpression, isPrefixUnaryExpression, isWhileStatement,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-conditional-assignment",
        description: "Disallows any type of assignment in conditionals.",
        descriptionDetails: "This applies to `do-while`, `for`, `if`, and `while` statements.",
        rationale: Lint.Utils.dedent `
            Assignments in conditionals are often typos:
            for example \`if (var1 = var2)\` instead of \`if (var1 == var2)\`.
            They also can be an indicator of overly clever code which decreases maintainability.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Assignments in conditional expressions are forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoConditionalAssignmentWalker(sourceFile, this.ruleName, undefined));
    }
}

class NoConditionalAssignmentWalker extends Lint.AbstractWalker<void> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (isIfStatement(node) || isDoStatement(node) || isWhileStatement(node)) {
                this.checkCondition(node.expression);
            } else if (isConditionalExpression(node) || isForStatement(node) && node.condition !== undefined) {
                this.checkCondition(node.condition!);
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private checkCondition(node: ts.Expression) {
        // return early for prevalent conditions
        if (node.kind === ts.SyntaxKind.Identifier || node.kind === ts.SyntaxKind.CallExpression) {
            return;
        }
        if (isBinaryExpression(node)) {
            if (isAssignmentKind(node.operatorToken.kind)) {
                this.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
            this.checkCondition(node.left);
            this.checkCondition(node.right);
        } else if (isParenthesizedExpression(node) || isNonNullExpression(node) || isAssertionExpression(node)) {
            this.checkCondition(node.expression);
        } else if (isConditionalExpression(node)) {
            this.checkCondition(node.whenTrue);
            this.checkCondition(node.whenFalse);
        } else if (isPrefixUnaryExpression(node)) {
            this.checkCondition(node.operand);
        }
    }
}
