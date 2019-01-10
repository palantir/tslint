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

import * as utils from "tsutils";

const OPTION_DESTRUCTURING_ALL = "all";
const OPTION_DESTRUCTURING_ANY = "any";

interface Options {
    destructuringAll: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-const",
        description:
            "Requires that variable declarations use `const` instead of `let` and `var` if possible.",
        descriptionDetails: Lint.Utils.dedent`
            If a variable is only assigned to once when it is declared, it should be declared using 'const'`,
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
            An optional object containing the property "destructuring" with two possible values:

            * "${OPTION_DESTRUCTURING_ANY}" (default) - If any variable in destructuring can be const, this rule warns for those variables.
            * "${OPTION_DESTRUCTURING_ALL}" - Only warns if all variables in destructuring can be const.`,
        options: {
            type: "object",
            properties: {
                destructuring: {
                    type: "string",
                    enum: [OPTION_DESTRUCTURING_ALL, OPTION_DESTRUCTURING_ANY],
                },
            },
        },
        optionExamples: [true, [true, { destructuring: OPTION_DESTRUCTURING_ALL }]],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(identifier: string, blockScoped: boolean) {
        return `Identifier '${identifier}' is never reassigned; use 'const' instead of '${
            blockScoped ? "let" : "var"
        }'.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options: Options = {
            destructuringAll:
                this.ruleArguments.length !== 0 &&
                (this.ruleArguments[0] as { destructuring?: string }).destructuring ===
                    OPTION_DESTRUCTURING_ALL,
        };
        const preferConstWalker = new PreferConstWalker(sourceFile, this.ruleName, options);
        return this.applyWithWalker(preferConstWalker);
    }
}

class Scope {
    public functionScope: Scope;
    public variables = new Map<string, VariableInfo>();
    public reassigned = new Set<string>();
    constructor(functionScope?: Scope) {
        // if no functionScope is provided we are in the process of creating a new function scope, which for consistency links to itself
        this.functionScope = functionScope === undefined ? this : functionScope;
    }

    public addVariable(
        identifier: ts.Identifier,
        declarationInfo: DeclarationInfo,
        destructuringInfo?: DestructuringInfo,
    ) {
        // block scoped variables go to the block scope, function scoped variables to the containing function scope
        const scope = declarationInfo.isBlockScoped ? this : this.functionScope;
        scope.variables.set(identifier.text, {
            declarationInfo,
            destructuringInfo,
            identifier,
            reassigned: false,
        });
    }
}

interface VariableInfo {
    identifier: ts.Identifier;
    reassigned: boolean;
    declarationInfo: DeclarationInfo;
    destructuringInfo: DestructuringInfo | undefined;
}

interface DeclarationListInfo {
    allInitialized: boolean;
    canBeConst: true;
    declarationList: ts.VariableDeclarationList;
    isBlockScoped: boolean;
    isForLoop: boolean;
    reassignedSiblings: boolean;
}

interface UnchangeableDeclarationInfo {
    canBeConst: false;
    isBlockScoped: boolean;
}

type DeclarationInfo = DeclarationListInfo | UnchangeableDeclarationInfo;

interface DestructuringInfo {
    reassignedSiblings: boolean;
}

class PreferConstWalker extends Lint.AbstractWalker<Options> {
    private scope: Scope = new Scope();
    public walk(sourceFile: ts.SourceFile) {
        // don't check anything on declaration files
        if (sourceFile.isDeclarationFile) {
            return;
        }

        this.scope = new Scope();
        const cb = (node: ts.Node): void => {
            const savedScope = this.scope;
            const boundary = utils.isScopeBoundary(node);
            if (boundary !== utils.ScopeBoundary.None) {
                if (boundary === utils.ScopeBoundary.Function) {
                    if (
                        node.kind === ts.SyntaxKind.ModuleDeclaration &&
                        utils.hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword)
                    ) {
                        // don't check ambient namespaces
                        return;
                    }
                    this.scope = new Scope();
                    if (
                        utils.isFunctionDeclaration(node) ||
                        utils.isMethodDeclaration(node) ||
                        utils.isFunctionExpression(node) ||
                        utils.isArrowFunction(node) ||
                        utils.isConstructorDeclaration(node)
                    ) {
                        // special handling for function parameters
                        // each parameter initializer can only reassign preceding parameters of variables of the containing scope
                        if (node.body !== undefined) {
                            for (const param of node.parameters) {
                                cb(param);
                                this.settle(savedScope);
                            }
                            cb(node.body);
                            this.onScopeEnd(savedScope);
                        }
                        this.scope = savedScope;
                        return;
                    }
                } else {
                    this.scope = new Scope(this.scope.functionScope);
                    if (
                        (utils.isForInStatement(node) || utils.isForOfStatement(node)) &&
                        node.initializer.kind !== ts.SyntaxKind.VariableDeclarationList
                    ) {
                        this.handleExpression(node.initializer);
                    }
                }
            }
            if (node.kind === ts.SyntaxKind.VariableDeclarationList) {
                this.handleVariableDeclaration(node as ts.VariableDeclarationList);
            } else if (node.kind === ts.SyntaxKind.CatchClause) {
                if ((node as ts.CatchClause).variableDeclaration !== undefined) {
                    this.handleBindingName((node as ts.CatchClause).variableDeclaration!.name, {
                        canBeConst: false,
                        isBlockScoped: true,
                    });
                }
            } else if (node.kind === ts.SyntaxKind.Parameter) {
                if (node.parent.kind !== ts.SyntaxKind.IndexSignature) {
                    this.handleBindingName((node as ts.ParameterDeclaration).name, {
                        canBeConst: false,
                        isBlockScoped: true,
                    });
                }
            } else if (
                utils.isPostfixUnaryExpression(node) ||
                (utils.isPrefixUnaryExpression(node) &&
                    (node.operator === ts.SyntaxKind.PlusPlusToken ||
                        node.operator === ts.SyntaxKind.MinusMinusToken))
            ) {
                if (utils.isIdentifier(node.operand)) {
                    this.scope.reassigned.add(node.operand.text);
                }
            } else if (
                utils.isBinaryExpression(node) &&
                utils.isAssignmentKind(node.operatorToken.kind)
            ) {
                this.handleExpression(node.left);
            }

            if (boundary !== utils.ScopeBoundary.None) {
                ts.forEachChild(node, cb);
                this.onScopeEnd(savedScope);
                this.scope = savedScope;
            } else {
                return ts.forEachChild(node, cb);
            }
        };

        if (ts.isExternalModule(sourceFile)) {
            ts.forEachChild(sourceFile, cb);
            this.onScopeEnd();
        } else {
            return ts.forEachChild(sourceFile, cb);
        }
    }

    private handleExpression(node: ts.Expression): void {
        switch (node.kind) {
            case ts.SyntaxKind.Identifier:
                this.scope.reassigned.add((node as ts.Identifier).text);
                break;
            case ts.SyntaxKind.ParenthesizedExpression:
                this.handleExpression((node as ts.ParenthesizedExpression).expression);
                break;
            case ts.SyntaxKind.ArrayLiteralExpression:
                for (const element of (node as ts.ArrayLiteralExpression).elements) {
                    if (element.kind === ts.SyntaxKind.SpreadElement) {
                        this.handleExpression((element as ts.SpreadElement).expression);
                    } else {
                        this.handleExpression(element);
                    }
                }
                break;
            case ts.SyntaxKind.ObjectLiteralExpression:
                for (const property of (node as ts.ObjectLiteralExpression).properties) {
                    switch (property.kind) {
                        case ts.SyntaxKind.ShorthandPropertyAssignment:
                            this.scope.reassigned.add(property.name.text);
                            break;
                        case ts.SyntaxKind.SpreadAssignment:
                            if (property.name !== undefined) {
                                this.scope.reassigned.add((property.name as ts.Identifier).text);
                            } else {
                                // handle `...(variable)`
                                this.handleExpression(property.expression);
                            }
                            break;
                        default:
                            this.handleExpression((property as ts.PropertyAssignment).initializer);
                    }
                }
        }
    }

    private handleBindingName(name: ts.BindingName, declarationInfo: DeclarationInfo) {
        if (name.kind === ts.SyntaxKind.Identifier) {
            this.scope.addVariable(name, declarationInfo);
        } else {
            const destructuringInfo: DestructuringInfo = {
                reassignedSiblings: false,
            };
            utils.forEachDestructuringIdentifier(name, declaration =>
                this.scope.addVariable(declaration.name, declarationInfo, destructuringInfo),
            );
        }
    }

    private handleVariableDeclaration(declarationList: ts.VariableDeclarationList) {
        let declarationInfo: DeclarationInfo;
        const kind = utils.getVariableDeclarationKind(declarationList);
        if (
            kind === utils.VariableDeclarationKind.Const ||
            utils.hasModifier(
                declarationList.parent.modifiers,
                ts.SyntaxKind.ExportKeyword,
                ts.SyntaxKind.DeclareKeyword,
            )
        ) {
            declarationInfo = {
                canBeConst: false,
                isBlockScoped: kind !== utils.VariableDeclarationKind.Var,
            };
        } else {
            declarationInfo = {
                allInitialized:
                    declarationList.parent.kind === ts.SyntaxKind.ForOfStatement ||
                    declarationList.parent.kind === ts.SyntaxKind.ForInStatement ||
                    declarationList.declarations.every(
                        declaration => declaration.initializer !== undefined,
                    ),
                canBeConst: true,
                declarationList,
                isBlockScoped: kind === utils.VariableDeclarationKind.Let,
                isForLoop:
                    declarationList.parent.kind === ts.SyntaxKind.ForStatement ||
                    declarationList.parent.kind === ts.SyntaxKind.ForOfStatement,
                reassignedSiblings: false,
            };
        }

        for (const declaration of declarationList.declarations) {
            this.handleBindingName(declaration.name, declarationInfo);
        }
    }

    private settle(parent?: Scope) {
        const { variables, reassigned } = this.scope;
        reassigned.forEach(name => {
            const variableInfo = variables.get(name);
            if (variableInfo !== undefined) {
                if (variableInfo.declarationInfo.canBeConst) {
                    variableInfo.reassigned = true;
                    variableInfo.declarationInfo.reassignedSiblings = true;
                    if (variableInfo.destructuringInfo !== undefined) {
                        variableInfo.destructuringInfo.reassignedSiblings = true;
                    }
                }
            } else if (parent !== undefined) {
                // if the reassigned variable was not declared in this scope we defer to the parent scope
                parent.reassigned.add(name);
            }
        });
        reassigned.clear();
    }

    private onScopeEnd(parent?: Scope) {
        this.settle(parent);
        const appliedFixes = new Set<ts.VariableDeclarationList>();
        this.scope.variables.forEach((info, name) => {
            if (
                info.declarationInfo.canBeConst &&
                !info.reassigned &&
                // don't add failures for reassigned variables in for loop initializer
                !(info.declarationInfo.reassignedSiblings && info.declarationInfo.isForLoop) &&
                // if {destructuring: "all"} is set, only add a failure if all variables in a destructuring assignment can be const
                (!this.options.destructuringAll ||
                    info.destructuringInfo === undefined ||
                    !info.destructuringInfo.reassignedSiblings)
            ) {
                let fix: Lint.Fix | undefined;
                // only apply fixes if the VariableDeclarationList has no reassigned variables
                // and the variable is block scoped aka `let` and initialized
                if (
                    info.declarationInfo.allInitialized &&
                    !info.declarationInfo.reassignedSiblings &&
                    info.declarationInfo.isBlockScoped &&
                    !appliedFixes.has(info.declarationInfo.declarationList)
                ) {
                    fix = new Lint.Replacement(
                        info.declarationInfo.declarationList.getStart(this.sourceFile),
                        3,
                        "const",
                    );
                    // add only one fixer per VariableDeclarationList
                    appliedFixes.add(info.declarationInfo.declarationList);
                }
                this.addFailureAtNode(
                    info.identifier,
                    Rule.FAILURE_STRING_FACTORY(name, info.declarationInfo.isBlockScoped),
                    fix,
                );
            }
        });
    }
}
