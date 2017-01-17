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
import {isAssignment, isCombinedModifierFlagSet, isCombinedNodeFlagSet, unwrapParentheses} from "../language/utils";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-const",
        description: "Requires that variable declarations use `const` instead of `let` if possible.",
        descriptionDetails: Lint.Utils.dedent`
            If a variable is only assigned to once when it is declared, it should be declared using 'const'`,
        hasFix: true,
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
    private static collect(statements: ts.Statement[], scopeInfo: ScopeInfo) {
        for (const s of statements) {
            if (s.kind === ts.SyntaxKind.VariableStatement) {
                PreferConstWalker.collectInVariableDeclarationList((s as ts.VariableStatement).declarationList, scopeInfo);
            }
        }
    }

    private static collectInVariableDeclarationList(node: ts.VariableDeclarationList, scopeInfo: ScopeInfo) {
        let allowConst: boolean;
        if ((ts as any).getCombinedModifierFlags === undefined) {
            // for back-compat, TypeScript < 2.1
            allowConst = isCombinedNodeFlagSet(node, ts.NodeFlags.Let)
                && !Lint.hasModifier(node.parent!.modifiers, ts.SyntaxKind.ExportKeyword);
        } else {
            allowConst = isCombinedNodeFlagSet(node, ts.NodeFlags.Let) && !isCombinedModifierFlagSet(node, ts.ModifierFlags.Export);
        }
        if (allowConst) {
            for (const decl of node.declarations) {
                PreferConstWalker.addDeclarationName(decl.name, node, scopeInfo);
            }
        }
    }

    private static addDeclarationName(node: ts.BindingName, container: ts.VariableDeclarationList, scopeInfo: ScopeInfo) {
        if (node.kind === ts.SyntaxKind.Identifier) {
            scopeInfo.addVariable(node as ts.Identifier, container);
        } else {
            for (const el of (node as ts.BindingPattern).elements) {
                if (el.kind === ts.SyntaxKind.BindingElement) {
                    PreferConstWalker.addDeclarationName(el.name, container, scopeInfo);
                }
            }
        }
    }

    public createScope() {
        return {};
    }

    public createBlockScope(node: ts.Node) {
        const scopeInfo = new ScopeInfo();
        switch (node.kind) {
            case ts.SyntaxKind.SourceFile:
                PreferConstWalker.collect((node as ts.SourceFile).statements, scopeInfo);
                break;
            case ts.SyntaxKind.Block:
                PreferConstWalker.collect((node as ts.Block).statements, scopeInfo);
                break;
            case ts.SyntaxKind.ModuleDeclaration:
                const body = (node as ts.ModuleDeclaration).body;
                if (body && body.kind === ts.SyntaxKind.ModuleBlock) {
                    PreferConstWalker.collect((body as ts.ModuleBlock).statements, scopeInfo);
                }
                break;
            case ts.SyntaxKind.ForStatement:
            case ts.SyntaxKind.ForOfStatement:
            case ts.SyntaxKind.ForInStatement:
                const initializer = (node as ts.ForInStatement | ts.ForOfStatement | ts.ForStatement).initializer;
                if (initializer && initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
                    PreferConstWalker.collectInVariableDeclarationList(initializer as ts.VariableDeclarationList, scopeInfo);
                }
                break;
            case ts.SyntaxKind.SwitchStatement:
                for (const caseClause of (node as ts.SwitchStatement).caseBlock.clauses) {
                    PreferConstWalker.collect(caseClause.statements, scopeInfo);
                }
                break;
            default:
                break;
        }
        return scopeInfo;
    }

    public onBlockScopeEnd() {
        const seenLetStatements = new Set<ts.VariableDeclarationList>();
        for (const usage of this.getCurrentBlockScope().getConstCandiates()) {
            let fix: Lint.Fix | undefined;
            if (!usage.reassignedSibling && !seenLetStatements.has(usage.letStatement)) {
                // only fix if all variables in the `let` statement can use `const`
                fix = this.createFix(this.createReplacement(usage.letStatement.getStart(), "let".length, "const"));
                seenLetStatements.add(usage.letStatement);
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

    private handleLHSExpression(node: ts.Expression) {
        node = unwrapParentheses(node);
        if (node.kind === ts.SyntaxKind.Identifier) {
            this.markAssignment(node as ts.Identifier);
        } else if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) {
            const deconstructionArray = node as ts.ArrayLiteralExpression;
            deconstructionArray.elements.forEach((child) => {
                // recursively unwrap destructuring arrays
                this.handleLHSExpression(child);
            });
        } else if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            for (const prop of (node as ts.ObjectLiteralExpression).properties) {
                switch (prop.kind) {
                    case ts.SyntaxKind.PropertyAssignment:
                        this.handleLHSExpression(prop.initializer);
                        break;
                    case ts.SyntaxKind.ShorthandPropertyAssignment:
                        this.handleLHSExpression(prop.name);
                        break;
                    case ts.SyntaxKind.SpreadAssignment:
                        this.handleLHSExpression(prop.expression);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    private handleUnaryExpression(node: ts.PrefixUnaryExpression | ts.PostfixUnaryExpression) {
        if (node.operator === ts.SyntaxKind.PlusPlusToken || node.operator === ts.SyntaxKind.MinusMinusToken) {
            this.handleLHSExpression(node.operand);
        }
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

interface UsageInfo {
    letStatement: ts.VariableDeclarationList;
    identifier: ts.Identifier;
    usageCount: number;
}

class ScopeInfo {
    public currentVariableDeclaration: ts.VariableDeclaration;
    private identifierUsages = new Map<string, UsageInfo>();
    // variable names grouped by common `let` statements
    private sharedLetSets = new Map<ts.VariableDeclarationList, string[]>();

    public addVariable(identifier: ts.Identifier, letStatement: ts.VariableDeclarationList) {
        this.identifierUsages.set(identifier.text, { letStatement, identifier, usageCount: 0 });
        let shared = this.sharedLetSets.get(letStatement);
        if (shared === undefined) {
            shared = [];
            this.sharedLetSets.set(letStatement, shared);
        }
        shared.push(identifier.text);
    }

    public getConstCandiates() {
        const constCandidates: IConstCandidate[] = [];
        this.sharedLetSets.forEach((variableNames) => {
            const anyReassigned = variableNames.some((key) => this.identifierUsages.get(key)!.usageCount > 0);
            for (const variableName of variableNames) {
                const usage = this.identifierUsages.get(variableName)!;
                if (usage.usageCount === 0) {
                    constCandidates.push({
                        identifier: usage.identifier,
                        letStatement: usage.letStatement,
                        reassignedSibling: anyReassigned,
                    });
                }
            }
        });
        return constCandidates;
    }

    public incrementVariableUsage(varName: string) {
        const usages = this.identifierUsages.get(varName);
        if (usages !== undefined) {
            usages.usageCount++;
            return true;
        }
        return false;
    }
}
