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
import * as Lint from "../lint";
import {isNodeFlagSet} from "../language/utils";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING_FACTORY = (identifier: string) => {
        return `Identifier '${identifier}' never appears on the LHS of an assignment - use const instead of let for its declaration.`;
    };

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
        // TODO: check which 'let' declarations were actually assigned to in this block scope, report failures
        const {declarationUsages} = this.getCurrentBlockScope();
        for (const varName of Object.keys(declarationUsages)) {
            if (declarationUsages[varName].usages === 0) {
                const node = declarationUsages[varName].declaration;
                this.addFailure(this.createFailure(
                    node.getStart(),
                    node.getWidth(),
                    Rule.FAILURE_STRING_FACTORY(varName)
                ));
            }
        }
    }

    public visitBinaryExpression(node: ts.BinaryExpression) {
        if (isAssignmentOperator(node.operatorToken)) {
            this.handleLHSExpression(node.left);
        }
        super.visitBinaryExpression(node);
    }

    public visitBindingPattern(node: ts.BindingPattern) {
        for (const element of node.elements) {
            if (element.name.kind === ts.SyntaxKind.Identifier) {
                // TODO: is this right?
                this.markAssignment(<ts.Identifier> element.name);
            }
        }
        super.visitBindingPattern(node);
    }

    public visitForStatement(node: ts.ForStatement) {
        this.handleAnyForStatement(node);
        super.visitForStatement(node);
    }

    public visitForInStatement(node: ts.ForInStatement) {
        this.handleAnyForStatement(node);
        super.visitForInStatement(node);
    }

    public visitForOfStatement(node: ts.ForOfStatement) {
        this.handleAnyForStatement(node);
        super.visitForOfStatement(node);
    }

    public visitModuleDeclaration(node: ts.ModuleDeclaration) {
        if (node.body.kind === ts.SyntaxKind.ModuleBlock) {
            this.visitBlock(<ts.ModuleBlock> node.body);
        }
        super.visitModuleDeclaration(node);
    }

    public visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression) {
        this.handleUnaryExpression(node);
        super.visitPrefixUnaryExpression(node);
    }

    public visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression) {
        this.handleUnaryExpression(node);
        super.visitPostfixUnaryExpression(node);
    }

    public visitVariableStatement(node: ts.VariableStatement) {
        for (const declaration of node.declarationList.declarations) {
            if (isNodeFlagSet(declaration, ts.NodeFlags.Let)
                    && !isNodeFlagSet(declaration, ts.NodeFlags.Export)
                    && declaration.name.kind === ts.SyntaxKind.Identifier) {
                const currentBlockScope = this.getCurrentBlockScope();
                const identifier = <ts.Identifier> declaration.name;
                currentBlockScope.declarationUsages[identifier.text] = {
                    declaration,
                    usages: 0
                };
            }
        }
        super.visitVariableStatement(node);
    }

    private handleAnyForStatement(node: ts.ForStatement | ts.ForInStatement | ts.ForOfStatement) {
        if (node.initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
            const declarations = (<ts.VariableDeclarationList> node.initializer).declarations;
            for (const declaration of declarations) {
                if (isNodeFlagSet(declaration, ts.NodeFlags.Let)) {
                    // TODO: collect identifiers, sometimes within binding patterns
                }
            }
        }
    }

    private handleBindingLiteralExpression(node: ts.ArrayLiteralExpression | ts.ObjectLiteralExpression) {
        if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            const pattern = <ts.ObjectLiteralExpression> node;
            for (const element of pattern.properties) {
                if (element.name.kind === ts.SyntaxKind.Identifier) {
                    this.markAssignment(<ts.Identifier> element.name);
                } else if (isBindingPattern(element.name)) {
                    // TODO: this.visitBindingPattern(element.name)?
                    // this.handleBindingPatternIdentifiers(<ts.BindingPattern> element.name);
                }
            }
        } else if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) {
            const pattern = <ts.ArrayLiteralExpression> node;
            for (const element of pattern.elements) {
                this.handleLHSExpression(element);
            }
        }
    }

    private handleLHSExpression(node: ts.Expression) {
        node = unwrapParentheses(node);
        if (node.kind === ts.SyntaxKind.Identifier) {
            this.markAssignment(<ts.Identifier> node);
        } else if (isBindingLiteralExpression(node)) {
            this.handleBindingLiteralExpression(node);
        }
    }

    private handleUnaryExpression(node: ts.PrefixUnaryExpression | ts.PostfixUnaryExpression) {
        if (node.operator === ts.SyntaxKind.PlusPlusToken || node.operator === ts.SyntaxKind.MinusMinusToken) {
            this.handleLHSExpression(node.operand);
        }
    }

    private markAssignment(identifier: ts.Identifier) {
        const varName = identifier.text;
        // look through block scopes from local -> global
        for (const blockScope of this.getAllBlockScopes().reverse()) {
            if (blockScope.declarationUsages[varName] != null) {
                blockScope.declarationUsages[varName].usages++;
                break;
            }
        }
    }
}

class ScopeInfo {
    public declarationUsages: {
        [varName: string]: {
            declaration: ts.VariableDeclaration,
            usages: number
        }
    } = {};
}

function isAssignmentOperator(token: ts.Node) {
    return token.kind >= ts.SyntaxKind.FirstAssignment
        && token.kind <= ts.SyntaxKind.LastAssignment;
}

function isBindingLiteralExpression(node: ts.Node): node is (ts.ArrayLiteralExpression | ts.ObjectLiteralExpression) {
    return (node != null)
        && (node.kind === ts.SyntaxKind.ObjectLiteralExpression || node.kind === ts.SyntaxKind.ArrayLiteralExpression);
}

function isBindingPattern(node: ts.Node): node is ts.BindingPattern {
    return (node != null)
        && (node.kind === ts.SyntaxKind.ArrayBindingPattern || node.kind === ts.SyntaxKind.ObjectBindingPattern);
}

function unwrapParentheses(node: ts.Expression) {
    while (node.kind === ts.SyntaxKind.ParenthesizedExpression) {
        node = (<ts.ParenthesizedExpression> node).expression;
    }
    return node;
}
