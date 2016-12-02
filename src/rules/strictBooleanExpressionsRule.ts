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
        ruleName: "strict-boolean-expressions",
        description: `Usage of && or || operators should be with boolean operands and
expressions in If, Do, While and For statements should be of type boolean`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static BINARY_EXPRESSION_ERROR = "Operands for the && or || operator should be of type boolean";
    public static UNARY_EXPRESSION_ERROR = "Operand for the ! operator should be of type boolean";
    public static STATEMENT_ERROR = "statement condition needs to be a boolean expression or literal";
    public static CONDITIONAL_EXPRESSION_ERROR = "Condition needs to be a boolean expression or literal";

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
        let isAndAndBinaryOperator = node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken;
        let isOrOrBinaryOperator = node.operatorToken.kind === ts.SyntaxKind.BarBarToken;
        if (isAndAndBinaryOperator || isOrOrBinaryOperator) {
            let lhsExpression = node.left;
            let lhsType = this.checker.getTypeAtLocation(lhsExpression);
            let rhsExpression = node.right;
            let rhsType = this.checker.getTypeAtLocation(rhsExpression);
            if (!this.isBooleanType(lhsType)) {
                if (lhsExpression.kind !== ts.SyntaxKind.BinaryExpression) {
                    this.addFailure(this.createFailure(lhsExpression.getStart(), lhsExpression.getWidth(), Rule.BINARY_EXPRESSION_ERROR));
                } else {
                    this.visitBinaryExpression(<ts.BinaryExpression> lhsExpression);
                }
            }
            if (!this.isBooleanType(rhsType)) {
                if (rhsExpression.kind !== ts.SyntaxKind.BinaryExpression) {
                    this.addFailure(this.createFailure(rhsExpression.getStart(), rhsExpression.getWidth(), Rule.BINARY_EXPRESSION_ERROR));
                } else {
                    this.visitBinaryExpression(<ts.BinaryExpression> rhsExpression);
                }
            }
        }
        super.visitBinaryExpression(node);
    }

    public visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression) {
        let isExclamationOperator = node.operator === ts.SyntaxKind.ExclamationToken;
        if (isExclamationOperator) {
            let expr = node.operand;
            let expType = this.checker.getTypeAtLocation(expr);
            if (!this.isBooleanType(expType)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.UNARY_EXPRESSION_ERROR));
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
        let cexp = node.condition;
        let expType = this.checker.getTypeAtLocation(cexp);
        if (!this.isBooleanType(expType)) {
            this.addFailure(this.createFailure(cexp.getStart(), cexp.getWidth(), Rule.CONDITIONAL_EXPRESSION_ERROR));
        }
        super.visitConditionalExpression(node);
    }

    public visitForStatement(node: ts.ForStatement) {
        let cexp = node.condition;
        let expType = this.checker.getTypeAtLocation(cexp);
        if (!this.isBooleanType(expType)) {
            this.addFailure(this.createFailure(cexp.getStart(), cexp.getWidth(), `For ${Rule.STATEMENT_ERROR}`));
        }
        super.visitForStatement(node);
    }

    private checkStatement(node: StatementType) {
        let bexp = node.expression;
        let expType = this.checker.getTypeAtLocation(bexp);
        if (!this.isBooleanType(expType)) {
            switch (node.kind) {
            case ts.SyntaxKind.IfStatement:
                this.addFailure(this.createFailure(bexp.getStart(), bexp.getWidth(), `If ${Rule.STATEMENT_ERROR}`));
                break;
            case ts.SyntaxKind.DoStatement:
                this.addFailure(this.createFailure(bexp.getStart(), bexp.getWidth(), `Do-While ${Rule.STATEMENT_ERROR}`));
                break;
            case ts.SyntaxKind.WhileStatement:
                this.addFailure(this.createFailure(bexp.getStart(), bexp.getWidth(), `While ${Rule.STATEMENT_ERROR}`));
                break;
            default:
                throw new Error("Unknown Syntax Kind");
            }
        }
    }

    private isBooleanType(btype: ts.Type): boolean {
        return utils.isTypeFlagSet(btype, ts.TypeFlags.BooleanLike);
    }
}
