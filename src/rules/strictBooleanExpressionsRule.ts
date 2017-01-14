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

import * as ts from "typescript";
import * as Lint from "../index";

const OPTION_ALLOW_NULL_UNION = "allow-null-union";
const OPTION_ALLOW_UNDEFINED_UNION = "allow-undefined-union";
const OPTION_ALLOW_STRING = "allow-string";
const OPTION_ALLOW_NUMBER = "allow-number";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "strict-boolean-expressions",
        description: Lint.Utils.dedent`
            Restricts the types allowed in boolean expressions. By default only booleans are allowed.

            The following nodes are checked:
            * Arguments to the '!', '&&', and '||' operators
            * The condition in a conditional expression ('cond ? x : y')
            * Conditions for 'if', 'for', 'while', and 'do-while' statements.`,
        optionsDescription: Lint.Utils.dedent`
            These options may be provided:

            * '${OPTION_ALLOW_NULL_UNION} allows union types containing 'null'.
              - It does *not* allow 'null' itself.
            * '${OPTION_ALLOW_UNDEFINED_UNION} allows union types containing 'undefined'.
              - It does *not* allow 'undefined' itself.
            * '${OPTION_ALLOW_STRING} allows strings.
              - It does *not* allow unions containing 'string'.
              - It does *not* allow string literal types.
            * '${OPTION_ALLOW_NUMBER} allows numbers.
              - It does *not* allow unions containing 'number'.
              - It does *not* allow enums or number literal types.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_ALLOW_NULL_UNION, OPTION_ALLOW_UNDEFINED_UNION, OPTION_ALLOW_STRING, OPTION_ALLOW_NUMBER],
            },
            minLength: 0,
            maxLength: 4,
        },
        optionExamples: [
            "true",
            `[true, ${OPTION_ALLOW_NULL_UNION}, ${OPTION_ALLOW_UNDEFINED_UNION}, ${OPTION_ALLOW_STRING}, ${OPTION_ALLOW_NUMBER}]`,
        ],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(locationDescription: string, expected: string): string {
        return locationDescription + " should be of type " + expected;
    }

    public applyWithProgram(srcFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new StrictBooleanExpressionsRule(srcFile, this.getOptions(), langSvc.getProgram()));
    }
}

class StrictBooleanExpressionsRule extends Lint.ProgramAwareRuleWalker {
    private checker = this.getTypeChecker();
    private allowNull = this.hasOption(OPTION_ALLOW_NULL_UNION);
    private allowUndefined = this.hasOption(OPTION_ALLOW_UNDEFINED_UNION);
    private allowString = this.hasOption(OPTION_ALLOW_STRING);
    private allowNumber = this.hasOption(OPTION_ALLOW_NUMBER);

    public visitBinaryExpression(node: ts.BinaryExpression) {
        if (isBinaryExpressionBoolean(node)) {
            const checkHalf = (expr: ts.Expression) => {
                // If it's another boolean binary expression, we'll check it when recursing.
                if (!isBooleanBinaryExpression(expr)) {
                    this.checkExpression(expr, "Operands for the && and || operators");
                }
            };
            checkHalf(node.left);
            checkHalf(node.right);
        }
        super.visitBinaryExpression(node);
    }

    public visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression) {
        if (node.operator === ts.SyntaxKind.ExclamationToken) {
            this.checkExpression(node.operand, "Operand for the ! operator");
        }
        super.visitPrefixUnaryExpression(node);
    }

    public visitIfStatement(node: ts.IfStatement) {
        this.checkStatement(node, "If statement condition");
        super.visitIfStatement(node);
    }

    public visitWhileStatement(node: ts.WhileStatement) {
        this.checkStatement(node, "While statement condition");
        super.visitWhileStatement(node);
    }

    public visitDoStatement(node: ts.DoStatement) {
        this.checkStatement(node, "Do-While statement condition");
        super.visitDoStatement(node);
    }

    public visitConditionalExpression(node: ts.ConditionalExpression) {
        this.checkExpression(node.condition, "Condition");
        super.visitConditionalExpression(node);
    }

    public visitForStatement(node: ts.ForStatement) {
        if (node.condition !== undefined) {
            this.checkExpression(node.condition, "For statement condition");
        }
        super.visitForStatement(node);
    }

    private checkStatement(node: ts.IfStatement | ts.DoStatement | ts.WhileStatement, locationDescription: string) {
        // If it's a boolean binary expression, we'll check it when recursing.
        if (!isBooleanBinaryExpression(node.expression)) {
            this.checkExpression(node.expression, locationDescription);
        }
    }

    private checkExpression(node: ts.Expression, locationDescription: string): void {
        if (!this.isTypeOk(this.checker.getTypeAtLocation(node))) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING(locationDescription, this.expectedTypeDescription()));
        }
    }

    private isTypeOk(type: ts.Type): boolean {
        return this.isNullable(type) ||
            this.allowString && is(ts.TypeFlags.String) ||
            this.allowNumber && is(ts.TypeFlags.Number) ||
            is(ts.TypeFlags.BooleanLike);

        function is(flag: ts.TypeFlags) {
            return Lint.isTypeFlagSet(type, flag);
        }
    }

    private isNullable(type: ts.Type) {
        return Lint.isUnionType(type) && type.types.some((part) =>
            this.allowNull && Lint.isTypeFlagSet(part, ts.TypeFlags.Null) ||
            this.allowUndefined && Lint.isTypeFlagSet(part, ts.TypeFlags.Undefined));
    }

    private expectedTypeDescription(): string {
        const parts = ["boolean"];
        if (this.allowNull) { parts.push("null-union"); }
        if (this.allowUndefined) { parts.push("undefined-union"); }
        if (this.allowString) { parts.push("string"); }
        if (this.allowNumber) { parts.push("number"); }
        return stringOr(parts);
    }
}

/** Matches `&&` and `||` operators. */
function isBooleanBinaryExpression(node: ts.Expression): boolean {
    return node.kind === ts.SyntaxKind.BinaryExpression && isBinaryExpressionBoolean(node as ts.BinaryExpression);
}

function isBinaryExpressionBoolean(node: ts.BinaryExpression): boolean {
    switch (node.operatorToken.kind) {
        case ts.SyntaxKind.AmpersandAmpersandToken:
        case ts.SyntaxKind.BarBarToken:
            return true;
        default:
            return false;
    }
}

function stringOr(parts: string[]): string {
    switch (parts.length) {
        case 1:
            return parts[0];
        case 2:
            return parts[0] + " or " + parts[1];
        default:
            let res = "";
            for (let i = 0; i < parts.length - 1; i++) {
                res += parts[i] + ", ";
            }
            return res + "or " + parts[parts.length - 1];
    }
}
