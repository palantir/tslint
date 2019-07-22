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

import { isTypeFlagSet } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Disable implicit toString() calls",
        descriptionDetails: Lint.Utils.dedent`
            Require explicit toString() call for variables used in strings. By default only strings are allowed.

            The following nodes are checked:

            * String literals ("foo" + bar)
            * ES6 templates (\`foo \${bar}\`)`,
        hasFix: true,
        optionExamples: [true],
        options: [],
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "strict-string-expressions",
        type: "functionality",
        typescriptOnly: true,
    };

    public static CONVERSION_REQUIRED = "Explicit conversion to string type required";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(ctx: Lint.WalkContext, checker: ts.TypeChecker): void {
    const { sourceFile } = ctx;
    ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.BinaryExpression: {
                const binaryExpr = node as ts.BinaryExpression;
                if (binaryExpr.operatorToken.kind === ts.SyntaxKind.PlusToken) {
                    const leftIsString = isTypeRequiresExplicitToString(checker.getTypeAtLocation(binaryExpr.left));
                    const rightIsString = isTypeRequiresExplicitToString(checker.getTypeAtLocation(binaryExpr.right));
                    const leftIsFailed = !leftIsString && rightIsString;
                    const rightIsFailed = leftIsString && !rightIsString;
                    if (leftIsFailed || rightIsFailed) {
                        const expression = leftIsFailed ? binaryExpr.left : binaryExpr.right;
                        addFailure(binaryExpr, expression);
                    }
                }
                break;
            }
            case ts.SyntaxKind.TemplateSpan: {
                const templateSpanNode = node as ts.TemplateSpan;
                const type = checker.getTypeAtLocation(templateSpanNode.expression);
                const isString = isTypeRequiresExplicitToString(type);
                if (!isString) {
                    const { expression } = templateSpanNode;
                    addFailure(templateSpanNode, expression);
                }
            }
        }
        return ts.forEachChild(node, cb);
    });

    function addFailure(node: ts.Node, expression: ts.Expression) {
        const fix = Lint.Replacement.replaceFromTo(
            expression.getStart(),
            expression.end,
            `String(${expression.getText()})`,
        );
        ctx.addFailureAtNode(node, Rule.CONVERSION_REQUIRED, fix);
    }
}

function isTypeRequiresExplicitToString (type: ts.Type) {
    return isTypeFlagSet(type, ts.TypeFlags.StringLike) || isTypeFlagSet(type, ts.TypeFlags.Any);
}
