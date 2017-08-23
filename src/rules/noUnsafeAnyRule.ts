/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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

import { isReassignmentTarget, isTypeNodeKind } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unsafe-any",
        description: Lint.Utils.dedent`
            Warns when using an expression of type 'any' in a dynamic way.
            Uses are only allowed if they would work for \`{} | null | undefined\`.
            Type casts and tests are allowed.
            Expressions that work on all values (such as \`"" + x\`) are allowed.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Unsafe use of expression of type 'any'.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnsafeAnyWalker(sourceFile, this.ruleName, program.getTypeChecker()));
    }
}

class NoUnsafeAnyWalker extends Lint.AbstractWalker<void> {
    constructor(sourceFile: ts.SourceFile, ruleName: string, private checker: ts.TypeChecker) {
        super(sourceFile, ruleName, undefined);
    }

    public walk(sourceFile: ts.SourceFile) {
        if (sourceFile.isDeclarationFile) {
            return; // Not possible in a declaration file.
        }
        sourceFile.statements.forEach(this.noCheck);
    }

    private noCheck = (node: ts.Node) => void this.visitNode(node);

    private visitNode(node: ts.Node, anyOk?: boolean): boolean | undefined {
        switch (node.kind) {
            case ts.SyntaxKind.ParenthesizedExpression:
                // Don't warn on a parenthesized expression, warn on its contents.
                return this.visitNode((node as ts.ParenthesizedExpression).expression, anyOk);
            case ts.SyntaxKind.LabeledStatement:
                // Ignore label
                return this.visitNode((node as ts.LabeledStatement).statement);
            // ignore labels
            case ts.SyntaxKind.BreakStatement:
            case ts.SyntaxKind.ContinueStatement:
            // Ignore types
            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.TypeAliasDeclaration:
            case ts.SyntaxKind.TypeParameter:
            // Ignore imports
            case ts.SyntaxKind.ImportEqualsDeclaration: // TODO import Foo from Bar.Foo, where Bar is any
            case ts.SyntaxKind.ImportDeclaration:
            case ts.SyntaxKind.ExportDeclaration:
            case ts.SyntaxKind.ExportAssignment:
            case ts.SyntaxKind.SuperKeyword:
                return false;
            case ts.SyntaxKind.ThisKeyword:
            case ts.SyntaxKind.Identifier:
                return anyOk ? false : this.check(node as ts.Expression);
            // Recurse through these, but ignore the immediate child because it is allowed to be 'any'.
            case ts.SyntaxKind.DeleteExpression:
            case ts.SyntaxKind.ExpressionStatement:
            case ts.SyntaxKind.TypeAssertionExpression:
            case ts.SyntaxKind.AsExpression:
            case ts.SyntaxKind.TemplateSpan: // Allow stringification (works on all values). Note: tagged templates handled differently.
            case ts.SyntaxKind.ThrowStatement:
            case ts.SyntaxKind.TypeOfExpression:
            case ts.SyntaxKind.VoidExpression:
                return this.visitNode(
                    (node as ts.ExpressionStatement | ts.AssertionExpression | ts.TemplateSpan | ts.ThrowStatement | ts.TypeOfExpression |
                             ts.VoidExpression).expression,
                    /*anyOk*/ true,
                );
            case ts.SyntaxKind.PropertyAssignment: {
                const {name, initializer} = (node as ts.PropertyAssignment);
                this.visitNode(name, /*anyOk*/ true);
                if (isReassignmentTarget(node.parent as ts.ObjectLiteralExpression)) {
                    return this.visitNode(initializer, true);
                }
                return this.checkContextual(initializer);
            }
            case ts.SyntaxKind.ShorthandPropertyAssignment: {
                const { name, objectAssignmentInitializer} = node as ts.ShorthandPropertyAssignment;
                if (objectAssignmentInitializer !== undefined) {
                    return this.checkContextual(objectAssignmentInitializer);
                }
                const type = this.checker.getContextualType(name);
                return this.visitNode(name, type === undefined || isAny(type));
            }
            case ts.SyntaxKind.PropertyDeclaration: {
                const { name, initializer } = node as ts.PropertyDeclaration;
                this.visitNode(name, true);
                if (initializer !== undefined) {
                    // TODO verify this
                    return this.visitNode(initializer, /*anyOk*/ isNodeAny(name, this.checker));
                }
                return false;
            }
            case ts.SyntaxKind.Parameter: {
                const { name, type, initializer } = node as ts.ParameterDeclaration;
                this.visitNode(name, true);
                if (initializer !== undefined) {
                    // TODO verify this
                    return this.visitNode(initializer, /*anyOk*/ type !== undefined && type.kind === ts.SyntaxKind.AnyKeyword);
                }
                return false;
            }
            case ts.SyntaxKind.TaggedTemplateExpression: {
                const { tag, template } = node as ts.TaggedTemplateExpression;
                if (template.kind === ts.SyntaxKind.TemplateExpression) {
                    for (const { expression } of template.templateSpans) {
                        this.checkContextual(expression);
                    }
                }
                // Also check the template expression itself
                if (this.visitNode(tag)) {
                    return true;
                }
                return anyOk ? false : this.check(node as ts.Expression);
            }
            case ts.SyntaxKind.CallExpression:
            case ts.SyntaxKind.NewExpression: {
                const { expression, arguments: args } = node as ts.CallExpression | ts.NewExpression;
                if (args !== undefined) {
                    for (const arg of args) {
                        this.checkContextual(arg);
                    }
                }
                if (this.visitNode(expression)) {
                    return true;
                }
                // Also check the call expression itself
                return anyOk ? false : this.check(node as ts.Expression);
            }
            case ts.SyntaxKind.PropertyAccessExpression:
                // Don't warn for right hand side; this is redundant if we warn for the access itself.
                if (this.visitNode((node as ts.PropertyAccessExpression).expression)) {
                    return true;
                }
                return anyOk ? false : this.check(node as ts.Expression);
            case ts.SyntaxKind.ElementAccessExpression: {
                const { expression, argumentExpression } = node as ts.ElementAccessExpression;
                if (argumentExpression !== undefined) {
                    this.visitNode(argumentExpression, true);
                }
                if (this.visitNode(expression)) {
                    return true;
                }
                return anyOk ? false : this.check(node as ts.Expression);
            }
            case ts.SyntaxKind.ReturnStatement: {
                const { expression } = node as ts.ReturnStatement;
                return expression !== undefined  && this.checkContextual(expression);
            }
            case ts.SyntaxKind.ReturnStatement: {
                const { expression } = node as ts.ReturnStatement;
                return expression !== undefined  && this.checkContextual(expression);
            }
            case ts.SyntaxKind.SwitchStatement: {
                const { expression, caseBlock: { clauses } } = node as ts.SwitchStatement;
                // Allow `switch (x) {}` where `x` is any
                this.visitNode(expression, /*anyOk*/ true);
                for (const clause of clauses) {
                    if (clause.kind === ts.SyntaxKind.CaseClause) {
                        // Allow `case x:` where `x` is any
                        this.visitNode(clause.expression, /*anyOk*/ true);
                    }
                    for (const statement of clause.statements) {
                        this.visitNode(statement);
                    }
                }
                return false;
            }
            case ts.SyntaxKind.ModuleDeclaration: {
                // In `declare global { ... }`, don't mark `global` as unsafe any.
                const { body } = node as ts.ModuleDeclaration;
                return body !== undefined && this.visitNode(body);
            }
            case ts.SyntaxKind.IfStatement: {
                const { expression, thenStatement, elseStatement } = node as ts.IfStatement;
                this.visitNode(expression, true); // allow truthyness check
                this.visitNode(thenStatement);
                return elseStatement !== undefined && this.visitNode(elseStatement);
            }
            case ts.SyntaxKind.PrefixUnaryExpression: {
                const {operator, operand} = node as ts.PrefixUnaryExpression;
                this.visitNode(operand, operator === ts.SyntaxKind.ExclamationToken); // allow falsyness check
                return false;
            }
            case ts.SyntaxKind.ForStatement: {
                const { initializer, condition, incrementor, statement } = node as ts.ForStatement;
                if (initializer !== undefined) { this.visitNode(initializer, true); }
                if (condition !== undefined) { this.visitNode(condition, true); } // allow truthyness check
                if (incrementor !== undefined) { this.visitNode(incrementor, true); }
                return this.visitNode(statement);
            }
            case ts.SyntaxKind.DoStatement:
            case ts.SyntaxKind.WhileStatement:
                this.visitNode((node as ts.DoStatement | ts.WhileStatement).expression, true);
                return this.visitNode((node as ts.IterationStatement).statement);
            case ts.SyntaxKind.ConditionalExpression: {
                const { condition, whenTrue, whenFalse } = node as ts.ConditionalExpression;
                this.visitNode(condition, true);
                const left = this.visitNode(whenTrue, anyOk);
                return this.visitNode(whenFalse, anyOk) || left;
            }
            case ts.SyntaxKind.VariableDeclaration:
                return this.checkVariableDeclaration(node as ts.VariableDeclaration);
            case ts.SyntaxKind.BinaryExpression:
                return this.checkBinaryExpression(node as ts.BinaryExpression, anyOk);
            case ts.SyntaxKind.BindingElement: {
                const {name, initializer} = node as ts.BindingElement;
                if (name.kind !== ts.SyntaxKind.Identifier) {
                    if (isAny(this.checker.getTypeAtLocation(name))) {
                        this.addFailureAtNode(name, Rule.FAILURE_STRING);
                    }
                    this.visitNode(name);
                }
                return initializer !== undefined && this.checkContextual(initializer);
            }
            case ts.SyntaxKind.AwaitExpression:
                this.visitNode((node as ts.AwaitExpression).expression);
                return anyOk ? false : this.check(node as ts.Expression);
            case ts.SyntaxKind.YieldExpression:
                return this.checkYieldExpression(node as ts.YieldExpression, anyOk);
            case ts.SyntaxKind.ClassExpression:
                this.checkClassLikeDeclaration(node as ts.ClassExpression);
                return anyOk ? false : this.check(node as ts.Expression);
            case ts.SyntaxKind.ClassDeclaration:
                this.checkClassLikeDeclaration(node as ts.ClassDeclaration);
                return false;
            case ts.SyntaxKind.ArrayLiteralExpression: {
                for (const element of (node as ts.ArrayLiteralExpression).elements) {
                    this.checkContextual(element);
                }
                return false;
            }
            // TODO JsxExpression
            // TODO JsxElement

        }
        if (isTypeNodeKind(node.kind) || node.kind >= ts.SyntaxKind.FirstKeyword && node.kind <= ts.SyntaxKind.LastKeyword) {
            return false;
        }
        return ts.forEachChild(node, this.noCheck);
    }

    private check(node: ts.Expression): boolean {
        if (!isNodeAny(node, this.checker)) {
            return false;
        }
        this.addFailureAtNode(node, Rule.FAILURE_STRING);
        return true;
    }

    private checkContextual(node: ts.Expression) {
        return this.visitNode(node, isAny(this.checker.getContextualType(node)));
    }

    // Allow `const x = foo;` and `const x: any = foo`, but not `const x: Foo = foo;`.
    private checkVariableDeclaration({ name, type, initializer }: ts.VariableDeclaration) {
        if (name.kind !== ts.SyntaxKind.Identifier) {
            if (isAny(this.checker.getTypeAtLocation(name))) {
                this.addFailureAtNode(name, Rule.FAILURE_STRING);
            }
            this.visitNode(name);
        }
        // Always allow the LHS to be `any`. Just don't allow RHS to be `any` when LHS isn't.
        return initializer !== undefined &&
            this.visitNode(
                initializer,
                /*anyOk*/ name.kind === ts.SyntaxKind.Identifier && (type === undefined || type.kind === ts.SyntaxKind.AnyKeyword) ||
                type !== undefined && type.kind === ts.SyntaxKind.AnyKeyword,
            );
    }

    private checkBinaryExpression(node: ts.BinaryExpression, anyOk: boolean | undefined) {
        let allowAnyLeft = false;
        let allowAnyRight = false;
        switch (node.operatorToken.kind) {
            case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            case ts.SyntaxKind.ExclamationEqualsToken:
            case ts.SyntaxKind.EqualsEqualsEqualsToken:
            case ts.SyntaxKind.EqualsEqualsToken:
            case ts.SyntaxKind.CommaToken: // Allow `any, any`
            case ts.SyntaxKind.BarBarToken: // Allow `any || any`
            case ts.SyntaxKind.AmpersandAmpersandToken: // Allow `any && any`
                allowAnyLeft = allowAnyRight = true;
                break;
            case ts.SyntaxKind.InstanceOfKeyword: // Allow test
                allowAnyLeft = true;
                break;
            case ts.SyntaxKind.EqualsToken:
                // Allow assignment if the lhs is also *any*.
                // TODO: handle destructuring
                allowAnyLeft = true;
                allowAnyRight = isNodeAny(node.left, this.checker);
                break;
            case ts.SyntaxKind.PlusToken: // Allow implicit stringification
            case ts.SyntaxKind.PlusEqualsToken:
                allowAnyLeft = allowAnyRight = isStringLike(node.left, this.checker)
                    || (isStringLike(node.right, this.checker) && node.operatorToken.kind === ts.SyntaxKind.PlusToken);
        }
        this.visitNode(node.left, allowAnyLeft);
        this.visitNode(node.right, allowAnyRight);
        return anyOk ? false : this.check(node);
    }

    private checkYieldExpression(node: ts.YieldExpression, anyOk: boolean | undefined) {
        if (node.expression !== undefined) {
            this.visitNode(node.expression, true); // TODO get return type
        }
        if (anyOk) {
            return false;
        }
        this.addFailureAtNode(node, Rule.FAILURE_STRING);
        return true;
    }

    private checkClassLikeDeclaration(node: ts.ClassLikeDeclaration) {
        if (node.decorators !== undefined) {
            node.decorators.forEach(this.noCheck);
        }
        if (node.heritageClauses !== undefined) {
            node.heritageClauses.forEach(this.noCheck);
        }
        return node.members.forEach(this.noCheck);
    }
}

function isNodeAny(node: ts.Node, checker: ts.TypeChecker): boolean {
    return isAny(checker.getTypeAtLocation(node));
}

function isStringLike(expr: ts.Expression, checker: ts.TypeChecker): boolean {
    return Lint.isTypeFlagSet(checker.getTypeAtLocation(expr), ts.TypeFlags.StringLike);
}

function isAny(type: ts.Type | undefined): boolean {
    return type !== undefined && Lint.isTypeFlagSet(type, ts.TypeFlags.Any);
}
