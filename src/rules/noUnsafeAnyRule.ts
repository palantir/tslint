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

import { isExpression } from "tsutils";
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
        return this.applyWithFunction(sourceFile, (ctx) => walk(ctx, program.getTypeChecker()));
    }
}

function walk(ctx: Lint.WalkContext<void>, checker: ts.TypeChecker): void {
    if (ctx.sourceFile.isDeclarationFile) {
        // Not possible in a declaration file.
        return;
    }
    return ts.forEachChild(ctx.sourceFile, cb);

    /** @param anyOk If true, this node will be allowed to be of type *any*. (But its children might not.) */
    function cb(node: ts.Node, anyOk?: boolean): void {
        switch (node.kind) {
            case ts.SyntaxKind.ParenthesizedExpression:
                // Don't warn on a parenthesized expression, warn on its contents.
                return cb((node as ts.ParenthesizedExpression).expression, anyOk);

            case ts.SyntaxKind.Parameter: {
                const { type, initializer } = node as ts.ParameterDeclaration;
                // TODO handle destructuring
                if (initializer !== undefined) {
                    return cb(initializer, /*anyOk*/ type !== undefined && type.kind === ts.SyntaxKind.AnyKeyword);
                }
                return;
            }

            case ts.SyntaxKind.LabeledStatement:
                // Ignore label
                return cb((node as ts.LabeledStatement).statement);

            case ts.SyntaxKind.BreakStatement: // Ignore label
            case ts.SyntaxKind.ContinueStatement:
            // Ignore types
            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.TypeAliasDeclaration:
            case ts.SyntaxKind.QualifiedName:
            case ts.SyntaxKind.TypePredicate:
            case ts.SyntaxKind.TypeOfExpression:
            // Ignore imports
            case ts.SyntaxKind.ImportEqualsDeclaration:
            case ts.SyntaxKind.ImportDeclaration:
            case ts.SyntaxKind.ExportDeclaration:
            // These show as type "any" if in type position.
            case ts.SyntaxKind.NumericLiteral:
            case ts.SyntaxKind.StringLiteral:
                return;

            // Recurse through these, but ignore the immediate child because it is allowed to be 'any'.
            case ts.SyntaxKind.DeleteExpression:
            case ts.SyntaxKind.ExpressionStatement:
            case ts.SyntaxKind.TypeAssertionExpression:
            case ts.SyntaxKind.AsExpression:
            case ts.SyntaxKind.TemplateSpan: // Allow stringification (works on all values). Note: tagged templates handled differently.
            case ts.SyntaxKind.ThrowStatement: {
                const { expression } =
                    node as ts.ExpressionStatement | ts.TypeAssertion | ts.AsExpression | ts.TemplateSpan | ts.ThrowStatement;
                return cb(expression, /*anyOk*/ true);
            }

            case ts.SyntaxKind.PropertyAssignment: {
                // Only check RHS.
                const { name, initializer } = node as ts.PropertyAssignment;
                // The LHS will be 'any' if the RHS is, so just handle the RHS.
                // Still need to check the LHS in case it is a computed key.
                cb(name, /*anyOk*/ true);
                cb(initializer);
                return;
            }

            case ts.SyntaxKind.PropertyDeclaration: {
                const { name, initializer } = node as ts.PropertyDeclaration;
                if (initializer !== undefined) {
                    return cb(initializer, /*anyOk*/ isNodeAny(name, checker));
                }
                return;
            }

            case ts.SyntaxKind.TaggedTemplateExpression: {
                const { tag, template } = node as ts.TaggedTemplateExpression;
                cb(tag);
                if (template.kind === ts.SyntaxKind.TemplateExpression) {
                    for (const { expression } of template.templateSpans) {
                        checkContextual(expression);
                    }
                }
                // Also check the template expression itself
                check();
                return;
            }

            case ts.SyntaxKind.CallExpression:
            case ts.SyntaxKind.NewExpression: {
                const { expression, arguments: args } = node as ts.CallExpression | ts.NewExpression;
                cb(expression);
                if (args !== undefined) {
                    for (const arg of args) {
                        checkContextual(arg);
                    }
                }
                // Also check the call expression itself
                check();
                return;
            }

            case ts.SyntaxKind.PropertyAccessExpression:
                // Don't warn for right hand side; this is redundant if we warn for the access itself.
                cb((node as ts.PropertyAccessExpression).expression);
                check();
                return;

            case ts.SyntaxKind.VariableDeclaration:
                return checkVariableDeclaration(node as ts.VariableDeclaration);

            case ts.SyntaxKind.BinaryExpression:
                return checkBinaryExpression(node);

            case ts.SyntaxKind.ReturnStatement: {
                const { expression } = node as ts.ReturnStatement;
                if (expression !== undefined) {
                    return checkContextual(expression);
                }
                return;
            }

            case ts.SyntaxKind.SwitchStatement: {
                const { expression, caseBlock: { clauses } } = node as ts.SwitchStatement;
                // Allow `switch (x) {}` where `x` is any
                cb(expression, /*anyOk*/ true);
                for (const clause of clauses) {
                    if (clause.kind === ts.SyntaxKind.CaseClause) {
                        // Allow `case x:` where `x` is any
                        cb(clause.expression, /*anyOk*/ true);
                    }
                    for (const statement of clause.statements) {
                        cb(statement);
                    }
                }
                break;
            }

            case ts.SyntaxKind.ModuleDeclaration: {
                // In `declare global { ... }`, don't mark `global` as unsafe any.
                const { body } = node as ts.ModuleDeclaration;
                if (body !== undefined) { cb(body); }
                return;
            }

            case ts.SyntaxKind.IfStatement: {
                const { expression, thenStatement, elseStatement } = node as ts.IfStatement;
                cb(expression, true); // allow truthyness check
                cb(thenStatement);
                if (elseStatement !== undefined) { cb(elseStatement); }
                return;
            }

            case ts.SyntaxKind.PrefixUnaryExpression: {
                const {operator, operand} = node as ts.PrefixUnaryExpression;
                cb(operand, operator === ts.SyntaxKind.ExclamationToken); // allow falsyness check
                check();
                return;
            }

            case ts.SyntaxKind.ForStatement: {
                const { initializer, condition, incrementor, statement } = node as ts.ForStatement;
                if (initializer !== undefined) { cb(initializer); }
                if (condition !== undefined) { cb(condition, true); } // allow truthyness check
                if (incrementor !== undefined) { cb(incrementor); }
                return cb(statement);
            }

            default:
                if (!(isExpression(node) && check())) {
                    return ts.forEachChild(node, cb);
                }
                return;
        }

        function check(): boolean {
            const isUnsafe = !anyOk && isNodeAny(node, checker);
            if (isUnsafe) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
            return isUnsafe;
        }
    }

    /** OK for this value to be 'any' if that's its contextual type. */
    function checkContextual(arg: ts.Expression): void {
        return cb(arg, /*anyOk*/ isAny(checker.getContextualType(arg)));
    }

    // Allow `const x = foo;` and `const x: any = foo`, but not `const x: Foo = foo;`.
    function checkVariableDeclaration({ type, initializer }: ts.VariableDeclaration): void {
        // Always allow the LHS to be `any`. Just don't allow RHS to be `any` when LHS isn't.
        // TODO: handle destructuring
        if (initializer !== undefined) {
            return cb(initializer, /*anyOk*/ type === undefined || type.kind === ts.SyntaxKind.AnyKeyword);
        }
        return;
    }

    function checkBinaryExpression(node: ts.Node): void {
        const { left, right, operatorToken } = node as ts.BinaryExpression;
        // Allow equality since all values support equality.
        if (Lint.getEqualsKind(operatorToken) !== undefined) {
            return;
        }

        switch (operatorToken.kind) {
            case ts.SyntaxKind.InstanceOfKeyword: // Allow test
                return cb(right);

            case ts.SyntaxKind.CommaToken: // Allow `any, any`
            case ts.SyntaxKind.BarBarToken: // Allow `any || any`
            case ts.SyntaxKind.AmpersandAmpersandToken: // Allow `any && any`
                cb(left, /*anyOk*/ true);
                return cb(right, /*anyOk*/ true);

            case ts.SyntaxKind.EqualsToken:
                // Allow assignment if the lhs is also *any*.
                // TODO: handle destructuring
                cb(right, /*anyOk*/ isNodeAny(left, checker));
                return;

            case ts.SyntaxKind.PlusToken: // Allow implicit stringification
            case ts.SyntaxKind.PlusEqualsToken:
                const anyOk = isStringLike(left, checker)
                    || (isStringLike(right, checker) && operatorToken.kind === ts.SyntaxKind.PlusToken);
                cb(left, anyOk);
                return cb(right, anyOk);

            default:
                cb(left);
                return cb(right);
        }
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
