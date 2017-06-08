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
import * as utils from "../language/utils";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-enum-boolean-expressions",
        description: "Disallow Enum type in boolean expressions.",
        descriptionDetails: Lint.Utils.dedent `
        Usage of \`&&\` or \`||\` operators should not be with Enum type and expressions
         in \`do-while\`, \`for\`, \`if\`, and \`while\` statements should not be of Enum type.`,
        rationale: Lint.Utils.dedent `
        Usage of Enum type in boolean expressions is often confusing especially because
         the first member of an Enum type is given a default value of 0.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static BINARY_EXPRESSION_ERROR = "Operands for the && or || operator should not be of Enum type";
    public static UNARY_EXPRESSION_ERROR = "Operand for the ! operator should not be of Enum type";
    public static STATEMENT_ERROR = "statement condition cannot be an Enum expression";
    public static CONDITIONAL_EXPRESSION_ERROR = "Condition cannot be an Enum expression";

    public applyWithProgram(srcFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new StrictBooleanExpressionsRule(srcFile, this.getOptions(), langSvc.getProgram()));
    }
}

type StatementType = ts.IfStatement|ts.DoStatement|ts.WhileStatement;

class StrictBooleanExpressionsRule extends Lint.ProgramAwareRuleWalker {
    private checker: ts.TypeChecker;

    constructor(srcFile: ts.SourceFile, lintOptions: Lint.IOptions, program: ts.Program) {
        super(srcFile, lintOptions, program);
        this.checker = this.getTypeChecker();
    }

    public visitBinaryExpression(node: ts.BinaryExpression) {
        const isAndAndBinaryOperator = node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken;
        const isOrOrBinaryOperator = node.operatorToken.kind === ts.SyntaxKind.BarBarToken;
        if (isAndAndBinaryOperator || isOrOrBinaryOperator) {
            const lhsExpression = node.left;
            const lhsType = this.checker.getTypeAtLocation(lhsExpression);
            const rhsExpression = node.right;
            const rhsType = this.checker.getTypeAtLocation(rhsExpression);
            if (this.isEnumType(lhsType)) {
                if (lhsExpression.kind !== ts.SyntaxKind.BinaryExpression) {
                    this.addFailureAtNode(lhsExpression, Rule.BINARY_EXPRESSION_ERROR);
                } else {
                    this.visitBinaryExpression(lhsExpression as ts.BinaryExpression);
                }
            }
            if (this.isEnumType(rhsType)) {
                if (rhsExpression.kind !== ts.SyntaxKind.BinaryExpression) {
                    this.addFailureAtNode(rhsExpression, Rule.BINARY_EXPRESSION_ERROR);
                } else {
                    this.visitBinaryExpression(rhsExpression as ts.BinaryExpression);
                }
            }
        }
        super.visitBinaryExpression(node);
    }

    public visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression) {
        const isExclamationOperator = node.operator === ts.SyntaxKind.ExclamationToken;
        if (isExclamationOperator) {
            const expr = node.operand;
            const expType = this.checker.getTypeAtLocation(expr);
            if (this.isEnumType(expType)) {
                this.addFailureAtNode(node, Rule.UNARY_EXPRESSION_ERROR);
            }
        }
        super.visitPrefixUnaryExpression(node);
    }

    public visitIfStatement(node: ts.IfStatement) {
        this.checkStatement(node);
        super.visitIfStatement(node);
    }

    public visitWhileStatement(node: ts.WhileStatement) {
        this.checkStatement(node);
        super.visitWhileStatement(node);
    }

    public visitDoStatement(node: ts.DoStatement) {
        this.checkStatement(node);
        super.visitDoStatement(node);
    }

    public visitConditionalExpression(node: ts.ConditionalExpression) {
        const cexp = node.condition;
        const expType = this.checker.getTypeAtLocation(cexp);
        if (this.isEnumType(expType)) {
            this.addFailureAtNode(cexp, Rule.CONDITIONAL_EXPRESSION_ERROR);
        }
        super.visitConditionalExpression(node);
    }

    public visitForStatement(node: ts.ForStatement) {
        const forCondition = node.condition;
        if (forCondition !== undefined) {
            const expType = this.checker.getTypeAtLocation(forCondition);
            if (this.isEnumType(expType)) {
                this.addFailureAtNode(forCondition, `For ${Rule.STATEMENT_ERROR}`);
            }
        }
        super.visitForStatement(node);
    }

    private checkStatement(node: StatementType) {
        const bexp = node.expression;
        const expType = this.checker.getTypeAtLocation(bexp);
        if (this.isEnumType(expType)) {
            this.addFailureAtNode(bexp, `${failureTextForKind(node.kind)} ${Rule.STATEMENT_ERROR}`);
        }
    }

    private isEnumType(btype: ts.Type): boolean {
        return utils.isTypeFlagSet(btype, ts.TypeFlags.EnumLike);
    }
}

function failureTextForKind(kind: ts.SyntaxKind) {
    switch (kind) {
        case ts.SyntaxKind.IfStatement:
            return "If";
        case ts.SyntaxKind.DoStatement:
            return "Do-While";
        case ts.SyntaxKind.WhileStatement:
            return "While";
        default:
            throw new Error("Unknown Syntax Kind");
    }
}
