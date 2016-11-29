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

import * as ts from "typescript";
import * as Lint from "../index";
import {isNodeFlagSet} from "../language/utils";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-const",
        description: "Requires that variable declarations use `const` instead of `let` if possible.",
        descriptionDetails: Lint.Utils.dedent`
            If a variable is only assigned to once when it is declared, it should be declared using 'const'`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY = (identifier: string) => {
        return `Identifier '${identifier}' is never reassigned; use 'const' instead of 'let'.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const preferConstWalker = new PreferConstWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(preferConstWalker);
    }
}

class PreferConstWalker extends Lint.BlockScopeAwareRuleWalker<{}, ScopeInfo> {
    private currentVariableDeclaration: ts.VariableDeclaration;

    public createScope() {
        return {};
    }

    public createBlockScope() {
        return new ScopeInfo();
    }

    public onBlockScopeEnd() {
        const seenLetStatements: { [startPosition: string]: boolean } = {};
        let nonReassignedVariables = this.getCurrentBlockScope().getNonReassignedVariables();
        for (const usage of nonReassignedVariables) {
            let fix: Lint.Fix;
            if (!usage.reassignedSibling && !seenLetStatements[usage.letStatement.getStart().toString()]) {
                // only fix if all variables in the `let` statement can use `const`
                const replacement = new Lint.Replacement(usage.letStatement.getStart(), "let".length, "const");
                fix = new Lint.Fix(Rule.metadata.ruleName, [replacement]);
                seenLetStatements[usage.letStatement.getStart().toString()] = true;
            }
            this.addFailure(this.createFailure(
                usage.identifier.getStart(),
                usage.identifier.getWidth(),
                Rule.FAILURE_STRING_FACTORY(usage.identifier.text),
                fix,
            ));
        }
    }

    protected visitBinaryExpression(node: ts.BinaryExpression) {
        if (isAssignmentOperator(node.operatorToken)) {
            this.handleLHSExpression(node.left);
        }
        super.visitBinaryExpression(node);
    }

    protected visitEndOfFileToken(node: ts.Node) {
        this.onBlockScopeEnd();
        super.visitEndOfFileToken(node);
    }

    protected visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression) {
        this.handleUnaryExpression(node);
        super.visitPrefixUnaryExpression(node);
    }

    protected visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression) {
        this.handleUnaryExpression(node);
        super.visitPostfixUnaryExpression(node);
    }

    protected visitVariableDeclaration(node: ts.VariableDeclaration) {
        this.currentVariableDeclaration = node;
        super.visitVariableDeclaration(node);
        this.currentVariableDeclaration = null;
    }

    protected visitVariableDeclarationList(node: ts.VariableDeclarationList) {
        let currentBlockScope = this.getCurrentBlockScope();
        currentBlockScope.declarationListStack.push(node);
        super.visitVariableDeclarationList(node);
        currentBlockScope.declarationListStack.pop();
    }

    protected visitIdentifier(node: ts.Identifier) {
        const currentBlockScope = this.getCurrentBlockScope();
        if (currentBlockScope.declarationListStack.length > 0) {
            const currentDeclarationList = currentBlockScope.declarationListStack[currentBlockScope.declarationListStack.length - 1];
            if (isNodeFlagSet(currentDeclarationList, ts.NodeFlags.Let)
                && !isNodeFlagSet(currentDeclarationList.parent, ts.NodeFlags.Export)) {
                if (this.isVariableDeclaration(node)) {
                    currentBlockScope.addIdentifier(node, currentDeclarationList);
                }
            }
        }
        super.visitIdentifier(node);
    }

    private handleLHSExpression(node: ts.Expression) {
        node = unwrapParentheses(node);
        if (node.kind === ts.SyntaxKind.Identifier) {
            this.markAssignment(<ts.Identifier> node);
        }
    }

    private handleUnaryExpression(node: ts.PrefixUnaryExpression | ts.PostfixUnaryExpression) {
        if (node.operator === ts.SyntaxKind.PlusPlusToken || node.operator === ts.SyntaxKind.MinusMinusToken) {
            this.handleLHSExpression(node.operand);
        }
    }

    private isVariableDeclaration(node: ts.Identifier) {
        if (this.currentVariableDeclaration != null) {
            // `isBindingElementDeclaration` differentiates between non-variable binding elements and variable binding elements
            // for example in `let {a: {b}} = {a: {b: 1}}`, `a` is a non-variable and the 1st `b` is a variable
            const isBindingElementDeclaration = node.parent.kind === ts.SyntaxKind.BindingElement
                && node.parent.getText() === node.getText();
            const isSimpleVariableDeclaration = node.parent.kind === ts.SyntaxKind.VariableDeclaration;
            const inVariableDeclaration = this.currentVariableDeclaration.name.getEnd() >= node.getEnd();
            return inVariableDeclaration && (isBindingElementDeclaration || isSimpleVariableDeclaration);
        }
        return false;
    }

    private markAssignment(identifier: ts.Identifier) {
        // look through block scopes from local -> global
        for (const blockScope of this.getAllBlockScopes().reverse()) {
            if (blockScope.incrementIdentifier(identifier.text)) {
                break;
            }
        }
    }
}

interface IVariableUsage {
    letStatement: ts.VariableDeclarationList;
    identifier: ts.Identifier;
    // whether or not a different variable declaration that shares the same `let` statement is ever reassigned
    reassignedSibling: boolean;
}

class ScopeInfo {
    // the stack of const/let/var declarations
    public declarationListStack: ts.VariableDeclarationList[] = [];
    private identifierUsages: {
        [varName: string]: {
            letStatement: ts.VariableDeclarationList,
            identifier: ts.Identifier,
            usages: number,
        },
    } = {};
    // variable names grouped by common `let` statements
    private sharedLetSets: {
        [letStartIndex: string]: { [variableName: string]: boolean },
    } = {};

    public addIdentifier(identifier: ts.Identifier, letStatement: ts.VariableDeclarationList) {
        this.identifierUsages[identifier.text] = { letStatement, identifier, usages: 0 };
        const letSetKey = letStatement.getStart().toString();
        if (this.sharedLetSets[letSetKey] == null) {
            this.sharedLetSets[letSetKey] = {};
        }
        this.sharedLetSets[letSetKey][identifier.text] = true;
    }

    public getNonReassignedVariables() {
        let letCandidates: IVariableUsage[] = [];
        for (const letSetKey of Object.keys(this.sharedLetSets)) {
            const letSet = this.sharedLetSets[letSetKey];
            const variableNames = Object.keys(letSet);
            const anyReassigned = variableNames.some((key) => this.identifierUsages[key].usages > 0);
            for (const variableName of variableNames) {
                const usage = this.identifierUsages[variableName];
                if (usage.usages === 0) {
                    letCandidates.push({
                        identifier: usage.identifier,
                        letStatement: usage.letStatement,
                        reassignedSibling: anyReassigned,
                    });
                }
            }
        }
        return letCandidates;
    }

    public incrementIdentifier(varName: string) {
        if (this.identifierUsages[varName] != null) {
            this.identifierUsages[varName].usages++;
            return true;
        }
        return false;
    }
}

function isAssignmentOperator(token: ts.Node) {
    return token.kind >= ts.SyntaxKind.FirstAssignment
        && token.kind <= ts.SyntaxKind.LastAssignment;
}

function unwrapParentheses(node: ts.Expression) {
    while (node.kind === ts.SyntaxKind.ParenthesizedExpression) {
        node = (<ts.ParenthesizedExpression> node).expression;
    }
    return node;
}
