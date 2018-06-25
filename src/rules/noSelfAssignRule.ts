/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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

import { isArrayLiteralExpression, isBinaryExpression, isObjectLiteralExpression } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

interface Option {
    props: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-self-assign",
        description: "This rule is aimed at eliminating self assignments.",
        optionsDescription: Lint.Utils.dedent`
        Self assignments have no effect, so probably those are an error due to incomplete refactoring.
        Those indicate that what you should do is still remaining.

            \`foo = foo;\`
            \`[bar, baz] = [bar, qiz];\`
            `,
        options: {
            type: "object",
            properties: {
                props: {
                    type: "boolean",
                },
            },
        },
        optionExamples: [[true, { props: false }]],
        type: "style",
        typescriptOnly: false,
        hasFix: true,
    };

    public static FAILURE_STRING(name: string) {
        return `variable '${name}' is assigned to itself.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const opt: Option = this.ruleArguments[0] || { props: true };

        return this.applyWithFunction(sourceFile, walk, opt);
    }
}

function walk(ctx: Lint.WalkContext<Option>) {
    return ts.forEachChild(ctx.sourceFile, function recur(node: ts.Node): void {
        if (ts.isTypeNode(node)) {
            return ;
        }

        if (isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
            doCheck(node.left, node.right);
        }

        if (ts.isPropertyDeclaration(node) && isPropertySelfAssigned(node)) {
            report(node.initializer!);
        }

        return ts.forEachChild(node, recur);
    });

    function report(node: ts.Node) {
        ctx.addFailureAtNode(node, Rule.FAILURE_STRING(node.getText()));
    }

    function isPropertySelfAssigned(prop: ts.PropertyDeclaration) {
        const {name, initializer} = prop;
        if (ts.isIdentifier(name) && initializer && ts.isPropertyAccessExpression(initializer)) {
            const { name: initializerName, expression } = initializer;
            return expression.kind === ts.SyntaxKind.ThisKeyword && ts.isIdentifier(initializerName) && name.text === initializerName.text;
        }

        return false;
    }

    function doCheck(left: ts.Node | undefined, right: ts.Node | undefined) {
        if (!left || !right) {
            return;
        }

        if (isSameIdentifier(left, right)) {
            report(right);
        }

        if (isArrayLiteralExpression(left) && isArrayLiteralExpression(right)) {
            const end = Math.min(left.elements.length, right.elements.length);

            for (let i = 0; i < end; i++) {
                doCheck(left.elements[i], right.elements[i]);

                if (ts.isSpreadElement(right.elements[i])) {
                    break;
                }
            }

        }

        if (isObjectLiteralExpression(left) && isObjectLiteralExpression(right)) {

            /*
            * Gets the index of the last spread property.
            * It's possible to overwrite properties followed by it.
            */
            let startRight = 0;

            for (let i = right.properties.length - 1; i >= 0; i--) {
                if (ts.isSpreadAssignment(right.properties[i])) {
                    startRight = i + 1;
                    break;
                }
            }

            for (const leftProp of left.properties) {
                for (let j = startRight; j < right.properties.length; j++) {
                    doCheck(leftProp, right.properties[j]);
                }
            }
        }

        // ({a} = {a});
        if (ts.isShorthandPropertyAssignment(left) && !left.objectAssignmentInitializer && ts.isShorthandPropertyAssignment(right)) {
            doCheck(left.name, right.name);
        }

        // a.b = a.b
        if (ctx.options.props && ts.isPropertyAccessExpression(left) && ts.isPropertyAccessExpression(right) && isSameMember(left, right)) {
            report(right);
            return;
        }

        // a["b"] = a["b"]
        if (ctx.options.props && ts.isElementAccessExpression(left) && ts.isElementAccessExpression(right)
            && isSameElementAccess(left, right)) {
            report(right);
        }
    }
}

function isSameElementAccess(left: ts.ElementAccessExpression, right: ts.ElementAccessExpression) {
    const leftExp = left.expression;
    const rightExp = right.expression;
    if (isSameIdentifier(leftExp, rightExp)) {
        const leftArg = left.argumentExpression;
        const rightArg = right.argumentExpression;

        if (leftArg && rightArg) {
            if (ts.isIdentifier(leftArg) && ts.isIdentifier(rightArg)) {
                return leftArg.text === rightArg.text;
            }

            if (ts.isLiteralExpression(leftArg) && ts.isLiteralExpression(rightArg)) {
                return leftArg.text === rightArg.text;
            }
        }
    }

    return false;
}

function isSameIdentifier(left: ts.Node, right: ts.Node) {
    return ts.isIdentifier(left) && ts.isIdentifier(right) && left.text === right.text;
}

function isSameMember(left: ts.PropertyAccessExpression, right: ts.PropertyAccessExpression): boolean {
    if (!isSameProperty(left, right)) {
        return false;
    }

    const leftExp = left.expression;
    const rightExp = right.expression;

    if (ts.isPropertyAccessExpression(leftExp) && ts.isPropertyAccessExpression(rightExp)) {
        return isSameMember(leftExp, rightExp);
    }

    return ts.isIdentifier(leftExp) && ts.isIdentifier(rightExp) && leftExp.text === rightExp.text;
}

function isSameProperty(left: ts.Node, right: ts.Node) {
    if (ts.isPropertyAccessExpression(left) && ts.isPropertyAccessExpression(right)
        && left.name.text === right.name.text) {
        return true;
    }

    return false;
}
