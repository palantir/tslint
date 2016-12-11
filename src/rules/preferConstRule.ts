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
import {isAssignment, isNodeFlagSet, unwrapParentheses} from "../language/utils";

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
    public createScope() {
        return {};
    }

    public createBlockScope() {
        return new ScopeInfo();
    }

    public onBlockScopeEnd() {
        const seenLetStatements: { [startPosition: string]: boolean } = {};
        for (const usage of this.getCurrentBlockScope().getConstCandiates()) {
            let fix: Lint.Fix;
            if (!usage.reassignedSibling && !seenLetStatements[usage.letStatement.getStart().toString()]) {
                // only fix if all variables in the `let` statement can use `const`
                const replacement = new Lint.Replacement(usage.letStatement.getStart(), "let".length, "const");
                fix = new Lint.Fix(Rule.metadata.ruleName, [replacement]);
                seenLetStatements[usage.letStatement.getStart().toString()] = true;
            }
            this.addFailureAtNode(usage.identifier, Rule.FAILURE_STRING_FACTORY(usage.identifier.text), fix);
        }
    }

    protected visitBinaryExpression(node: ts.BinaryExpression) {
        if (isAssignment(node)) {
            this.handleLHSExpression(node.left);
        }
        super.visitBinaryExpression(node);
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
        this.getCurrentBlockScope().currentVariableDeclaration = node;
        super.visitVariableDeclaration(node);
        this.getCurrentBlockScope().currentVariableDeclaration = null;
    }

    protected visitIdentifier(node: ts.Identifier) {
        if (this.getCurrentBlockScope().currentVariableDeclaration != null) {
            const declarationList = this.getCurrentBlockScope().currentVariableDeclaration.parent;
            if (isNodeFlagSet(declarationList, ts.NodeFlags.Let) && !isNodeFlagSet(declarationList.parent, ts.NodeFlags.Export)) {
                if (this.isVariableDeclaration(node)) {
                    this.getCurrentBlockScope().addVariable(node, declarationList);
                }
            }
        }
        super.visitIdentifier(node);
    }

    private handleLHSExpression(node: ts.Expression) {
        node = unwrapParentheses(node);
        if (node.kind === ts.SyntaxKind.Identifier) {
            this.markAssignment(node as ts.Identifier);
        }
    }

    private handleUnaryExpression(node: ts.PrefixUnaryExpression | ts.PostfixUnaryExpression) {
        if (node.operator === ts.SyntaxKind.PlusPlusToken || node.operator === ts.SyntaxKind.MinusMinusToken) {
            this.handleLHSExpression(node.operand);
        }
    }

    private isVariableDeclaration(node: ts.Identifier) {
        if (this.getCurrentBlockScope().currentVariableDeclaration != null) {
            // `isBindingElementDeclaration` differentiates between non-variable binding elements and variable binding elements
            // for example in `let {a: {b}} = {a: {b: 1}}`, `a` is a non-variable and the 1st `b` is a variable
            const isBindingElementDeclaration = node.parent.kind === ts.SyntaxKind.BindingElement
                && node.parent.getText() === node.getText();
            const isSimpleVariableDeclaration = node.parent.kind === ts.SyntaxKind.VariableDeclaration;
            // differentiates between the left and right hand side of a declaration
            const inVariableDeclaration = this.getCurrentBlockScope().currentVariableDeclaration.name.getEnd() >= node.getEnd();
            return inVariableDeclaration && (isBindingElementDeclaration || isSimpleVariableDeclaration);
        }
        return false;
    }

    private markAssignment(identifier: ts.Identifier) {
        const allBlockScopes = this.getAllBlockScopes();
        // look through block scopes from local -> global
        for (let i = allBlockScopes.length - 1; i >= 0; i--) {
            if (allBlockScopes[i].incrementVariableUsage(identifier.text)) {
                break;
            }
        }
    }
}

interface IConstCandidate {
    letStatement: ts.VariableDeclarationList;
    identifier: ts.Identifier;
    // whether or not a different variable declaration that shares the same `let` statement is ever reassigned
    reassignedSibling: boolean;
}

class ScopeInfo {
    public currentVariableDeclaration: ts.VariableDeclaration;

    private identifierUsages: {
        [varName: string]: {
            letStatement: ts.VariableDeclarationList,
            identifier: ts.Identifier,
            usageCount: number,
        },
    } = {};
    // variable names grouped by common `let` statements
    private sharedLetSets: {[letStartIndex: string]: string[]} = {};

    public addVariable(identifier: ts.Identifier, letStatement: ts.VariableDeclarationList) {
        this.identifierUsages[identifier.text] = { letStatement, identifier, usageCount: 0 };
        const letSetKey = letStatement.getStart().toString();
        if (this.sharedLetSets[letSetKey] == null) {
            this.sharedLetSets[letSetKey] = [];
        }
        this.sharedLetSets[letSetKey].push(identifier.text);
    }

    public getConstCandiates() {
        const constCandidates: IConstCandidate[] = [];
        for (const letSetKey of Object.keys(this.sharedLetSets)) {
            const variableNames = this.sharedLetSets[letSetKey];
            const anyReassigned = variableNames.some((key) => this.identifierUsages[key].usageCount > 0);
            for (const variableName of variableNames) {
                const usage = this.identifierUsages[variableName];
                if (usage.usageCount === 0) {
                    constCandidates.push({
                        identifier: usage.identifier,
                        letStatement: usage.letStatement,
                        reassignedSibling: anyReassigned,
                    });
                }
            }
        }
        return constCandidates;
    }

    public incrementVariableUsage(varName: string) {
        if (this.identifierUsages[varName] != null) {
            this.identifierUsages[varName].usageCount++;
            return true;
        }
        return false;
    }
}
