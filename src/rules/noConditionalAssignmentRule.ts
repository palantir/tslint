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

import { isAssignmentKind, isNodeKind } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-conditional-assignment",
        description: "Disallows any type of assignment in conditionals.",
        descriptionDetails:
            "This applies to `do-while`, `for`, `if`, and `while` statements and conditional (ternary) expressions.",
        rationale: Lint.Utils.dedent`
            Assignments in conditionals are often typos:
            for example \`if (var1 = var2)\` instead of \`if (var1 == var2)\`.
            They also can be an indicator of overly clever code which decreases maintainability.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Assignments in conditional expressions are forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    let checking = 0;
    return ts.forEachChild(ctx.sourceFile, cb);

    function cb(node: ts.Node): void {
        const kind = node.kind;
        if (!isNodeKind(kind)) {
            return; // return early for tokens
        }
        switch (kind) {
            case ts.SyntaxKind.ConditionalExpression:
                check((node as ts.ConditionalExpression).condition);
                cb((node as ts.ConditionalExpression).whenTrue);
                cb((node as ts.ConditionalExpression).whenFalse);
                return;
            case ts.SyntaxKind.IfStatement:
                check((node as ts.IfStatement).expression);
                cb((node as ts.IfStatement).thenStatement);
                maybeCallback(cb, (node as ts.IfStatement).elseStatement);
                return;
            case ts.SyntaxKind.DoStatement:
            case ts.SyntaxKind.WhileStatement:
                check((node as ts.DoStatement | ts.WhileStatement).expression);
                cb((node as ts.IterationStatement).statement);
                return;
            case ts.SyntaxKind.ForStatement:
                maybeCallback(cb, (node as ts.ForStatement).initializer);
                maybeCallback(check, (node as ts.ForStatement).condition);
                maybeCallback(cb, (node as ts.ForStatement).incrementor);
                cb((node as ts.ForStatement).statement);
                return;
        }
        if (checking !== 0) {
            switch (kind) {
                case ts.SyntaxKind.BinaryExpression:
                    if (isAssignmentKind((node as ts.BinaryExpression).operatorToken.kind)) {
                        ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
                    }
                    cb((node as ts.BinaryExpression).left);
                    cb((node as ts.BinaryExpression).right);
                    return;
                case ts.SyntaxKind.ParenthesizedExpression:
                case ts.SyntaxKind.NonNullExpression:
                case ts.SyntaxKind.AsExpression:
                case ts.SyntaxKind.TypeAssertionExpression:
                    return cb(
                        (node as
                            | ts.AssertionExpression
                            | ts.NonNullExpression
                            | ts.ParenthesizedExpression).expression
                    );
                case ts.SyntaxKind.PrefixUnaryExpression:
                    return cb((node as ts.PrefixUnaryExpression).operand);
                default:
                    return noCheck(node);
            }
        }
        return ts.forEachChild(node, cb);
    }

    function check(node: ts.Node): void {
        ++checking;
        cb(node);
        --checking;
    }
    function noCheck(node: ts.Node): void {
        const old = checking;
        checking = 0;
        ts.forEachChild(node, cb);
        checking = old;
    }
}

function maybeCallback(cb: (node: ts.Node) => void, node?: ts.Node) {
    if (node !== undefined) {
        cb(node);
    }
}
