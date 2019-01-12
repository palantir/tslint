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

import {
    isIdentifier,
    isReassignmentTarget,
    isSymbolFlagSet,
    isTokenKind,
    isTypeFlagSet,
    isTypeNodeKind,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { isLowerCase } from "../utils";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unsafe-any",
        description: Lint.Utils.dedent`
            Warns when using an expression of type 'any' in a dynamic way.
            Uses are only allowed if they would work for \`{} | null | undefined\`.
            Downcasting to unknown is always safe.
            Type casts and tests are allowed.
            Expressions that work on all values (such as \`"" + x\`) are allowed.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        rationale: Lint.Utils.dedent`
            If you're dealing with data of unknown or "any" types, you shouldn't be accessing members of it.
            Either add type annotations for properties that may exist or change the data type to the empty object type \`{}\`.

            Alternately, if you're creating storage or handling for consistent but unknown types, such as in data structures
            or serialization, use \`<T>\` template types for generic type handling.

            Also see the \`no-any\` rule.
        `,
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Unsafe use of expression of type 'any'.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new NoUnsafeAnyWalker(sourceFile, this.ruleName, program.getTypeChecker()),
        );
    }
}

class NoUnsafeAnyWalker extends Lint.AbstractWalker<void> {
    constructor(
        sourceFile: ts.SourceFile,
        ruleName: string,
        private readonly checker: ts.TypeChecker,
    ) {
        super(sourceFile, ruleName, undefined);
    }

    public walk(sourceFile: ts.SourceFile) {
        if (sourceFile.isDeclarationFile) {
            return; // Not possible in a declaration file.
        }
        sourceFile.statements.forEach(this.visitNodeCallback);
    }

    /** Wraps `visitNode` with the correct `this` binding and discards the return value to prevent `forEachChild` from returning early */
    private readonly visitNodeCallback = (node: ts.Node) => void this.visitNode(node);

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
            case ts.SyntaxKind.IndexSignature:
            // Ignore imports
            case ts.SyntaxKind.ImportEqualsDeclaration:
            case ts.SyntaxKind.ImportDeclaration:
            case ts.SyntaxKind.ExportDeclaration:
            case ts.SyntaxKind.ExportAssignment:
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
            case ts.SyntaxKind.TypeOfExpression:
            case ts.SyntaxKind.VoidExpression:
                return this.visitNode(
                    (node as
                        | ts.ExpressionStatement
                        | ts.AssertionExpression
                        | ts.TemplateSpan
                        | ts.TypeOfExpression
                        | ts.VoidExpression).expression,
                    true,
                );
            case ts.SyntaxKind.ThrowStatement: {
                const { expression } = node as ts.ThrowStatement;
                return expression !== undefined ? this.visitNode(expression, true) : false;
            }
            case ts.SyntaxKind.PropertyAssignment: {
                const { name, initializer } = node as ts.PropertyAssignment;
                this.visitNode(name, /*anyOk*/ true);
                if (isReassignmentTarget(node.parent as ts.ObjectLiteralExpression)) {
                    return this.visitNode(initializer, true);
                }
                return this.checkContextualType(initializer, true);
            }
            case ts.SyntaxKind.ShorthandPropertyAssignment: {
                const {
                    name,
                    objectAssignmentInitializer,
                } = node as ts.ShorthandPropertyAssignment;
                if (objectAssignmentInitializer !== undefined) {
                    return this.checkContextualType(objectAssignmentInitializer);
                }
                return this.checkContextualType(name, true);
            }
            case ts.SyntaxKind.PropertyDeclaration: {
                const { name, initializer } = node as ts.PropertyDeclaration;
                this.visitNode(name, true);
                return (
                    initializer !== undefined &&
                    this.visitNode(
                        initializer,
                        isPropertyAnyOrUnknown(node as ts.PropertyDeclaration, this.checker),
                    )
                );
            }
            case ts.SyntaxKind.SpreadAssignment:
                return this.visitNode(
                    (node as ts.SpreadAssignment).expression,
                    // allow any in object spread, but not in object rest
                    !isReassignmentTarget(node.parent as ts.ObjectLiteralExpression),
                );
            case ts.SyntaxKind.ComputedPropertyName:
                return this.visitNode((node as ts.ComputedPropertyName).expression, true);
            case ts.SyntaxKind.TaggedTemplateExpression: {
                const { tag, template } = node as ts.TaggedTemplateExpression;
                if (template.kind === ts.SyntaxKind.TemplateExpression) {
                    for (const { expression } of template.templateSpans) {
                        this.checkContextualType(expression);
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
                const { expression, arguments: args } = node as
                    | ts.CallExpression
                    | ts.NewExpression;
                if (args !== undefined) {
                    for (const arg of args) {
                        this.checkContextualType(arg);
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
                return expression !== undefined && this.checkContextualType(expression, true);
            }
            case ts.SyntaxKind.SwitchStatement: {
                const {
                    expression,
                    caseBlock: { clauses },
                } = node as ts.SwitchStatement;
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
                const { operator, operand } = node as ts.PrefixUnaryExpression;
                this.visitNode(operand, operator === ts.SyntaxKind.ExclamationToken); // allow falsyness check
                return false;
            }
            case ts.SyntaxKind.ForStatement: {
                const { initializer, condition, incrementor, statement } = node as ts.ForStatement;
                if (initializer !== undefined) {
                    this.visitNode(initializer, true);
                }
                if (condition !== undefined) {
                    this.visitNode(condition, true);
                } // allow truthyness check
                if (incrementor !== undefined) {
                    this.visitNode(incrementor, true);
                }
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
            case ts.SyntaxKind.Parameter:
                return this.checkVariableOrParameterDeclaration(node as
                    | ts.VariableDeclaration
                    | ts.ParameterDeclaration);
            case ts.SyntaxKind.BinaryExpression:
                return this.checkBinaryExpression(node as ts.BinaryExpression, anyOk);
            case ts.SyntaxKind.AwaitExpression:
                this.visitNode((node as ts.AwaitExpression).expression);
                return anyOk ? false : this.check(node as ts.Expression);
            case ts.SyntaxKind.YieldExpression:
                return this.checkYieldExpression(node as ts.YieldExpression, anyOk);
            case ts.SyntaxKind.ClassExpression:
            case ts.SyntaxKind.ClassDeclaration:
                this.checkClassLikeDeclaration(node as ts.ClassLikeDeclaration);
                return false;
            case ts.SyntaxKind.ArrayLiteralExpression: {
                for (const element of (node as ts.ArrayLiteralExpression).elements) {
                    this.checkContextualType(element, true);
                }
                return false;
            }
            case ts.SyntaxKind.JsxExpression:
                return (
                    (node as ts.JsxExpression).expression !== undefined &&
                    this.checkContextualType((node as ts.JsxExpression).expression!)
                );
        }
        if (isTypeNodeKind(node.kind) || isTokenKind(node.kind)) {
            return false;
        }
        return ts.forEachChild(node, this.visitNodeCallback);
    }

    private check(node: ts.Expression): boolean {
        if (!isNodeAny(node, this.checker)) {
            return false;
        }
        this.addFailureAtNode(node, Rule.FAILURE_STRING);
        return true;
    }

    private checkContextualType(node: ts.Expression, allowIfNoContextualType?: boolean) {
        const type = this.checker.getContextualType(node);
        const anyOk = (type === undefined && allowIfNoContextualType) || isAny(type, true);
        return this.visitNode(node, anyOk);
    }

    // Allow `const x = foo;` and `const x: any = foo`, but not `const x: Foo = foo;`.
    private checkVariableOrParameterDeclaration({
        name,
        type,
        initializer,
    }: ts.VariableDeclaration | ts.ParameterDeclaration) {
        this.checkBindingName(name);
        // Always allow the LHS to be `any`. Just don't allow RHS to be `any` when LHS isn't `any` or `unknown`.
        const anyOk =
            (name.kind === ts.SyntaxKind.Identifier &&
                (type === undefined ||
                    type.kind === ts.SyntaxKind.AnyKeyword ||
                    type.kind === ts.SyntaxKind.UnknownKeyword)) ||
            (type !== undefined && type.kind === ts.SyntaxKind.AnyKeyword) ||
            (type !== undefined && type.kind === ts.SyntaxKind.UnknownKeyword);
        return initializer !== undefined && this.visitNode(initializer, anyOk);
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
                allowAnyLeft = true;
                allowAnyRight = isNodeAny(node.left, this.checker, true);
                break;
            case ts.SyntaxKind.PlusToken: // Allow implicit stringification
            case ts.SyntaxKind.PlusEqualsToken:
                allowAnyLeft = allowAnyRight =
                    isStringLike(node.left, this.checker) ||
                    (isStringLike(node.right, this.checker) &&
                        node.operatorToken.kind === ts.SyntaxKind.PlusToken);
        }
        this.visitNode(node.left, allowAnyLeft);
        this.visitNode(node.right, allowAnyRight);
        return anyOk ? false : this.check(node);
    }

    private checkYieldExpression(node: ts.YieldExpression, anyOk: boolean | undefined) {
        if (node.expression !== undefined) {
            this.checkContextualType(node.expression, true);
        }
        if (anyOk) {
            return false;
        }
        this.addFailureAtNode(node, Rule.FAILURE_STRING);
        return true;
    }

    private checkClassLikeDeclaration(node: ts.ClassLikeDeclaration) {
        if (node.decorators !== undefined) {
            node.decorators.forEach(this.visitNodeCallback);
        }
        if (node.heritageClauses !== undefined) {
            node.heritageClauses.forEach(this.visitNodeCallback);
        }
        return node.members.forEach(this.visitNodeCallback);
    }

    private checkBindingName(node: ts.BindingName) {
        if (node.kind !== ts.SyntaxKind.Identifier) {
            if (isNodeAny(node, this.checker)) {
                this.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
            for (const element of node.elements) {
                if (element.kind !== ts.SyntaxKind.OmittedExpression) {
                    if (
                        element.propertyName !== undefined &&
                        element.propertyName.kind === ts.SyntaxKind.ComputedPropertyName
                    ) {
                        this.visitNode(element.propertyName.expression);
                    }
                    this.checkBindingName(element.name);
                    if (element.initializer !== undefined) {
                        this.checkContextualType(element.initializer);
                    }
                }
            }
        }
    }
}

/** Check if property has no type annotation in this class and the base class */
function isPropertyAnyOrUnknown(node: ts.PropertyDeclaration, checker: ts.TypeChecker) {
    if (
        !isNodeAny(node.name, checker, true) ||
        node.name.kind === ts.SyntaxKind.ComputedPropertyName
    ) {
        return false;
    }
    for (const base of checker.getBaseTypes(checker.getTypeAtLocation(
        node.parent,
    ) as ts.InterfaceType)) {
        const prop = base.getProperty(node.name.text);
        if (prop !== undefined && prop.declarations !== undefined) {
            return isAny(checker.getTypeOfSymbolAtLocation(prop, prop.declarations[0]), true);
        }
    }
    return true;
}

/**
 * @param orUnknown If true, this function will also return true when the node is unknown.
 */
function isNodeAny(node: ts.Node, checker: ts.TypeChecker, orUnknown: boolean = false): boolean {
    let symbol = checker.getSymbolAtLocation(node);
    if (symbol !== undefined && isSymbolFlagSet(symbol, ts.SymbolFlags.Alias)) {
        symbol = checker.getAliasedSymbol(symbol);
    }
    if (symbol !== undefined) {
        // NamespaceModule is a type-only namespace without runtime value, its type is 'any' when used as 'ns.Type' -> avoid error
        if (isSymbolFlagSet(symbol, ts.SymbolFlags.NamespaceModule)) {
            return false;
        }
        if (isSymbolFlagSet(symbol, ts.SymbolFlags.Type)) {
            return isAny(checker.getDeclaredTypeOfSymbol(symbol), orUnknown);
        }
    }

    // Lowercase JSX elements are assumed to be allowed by design
    if (isJsxNativeElement(node)) {
        return false;
    }

    return isAny(checker.getTypeAtLocation(node), orUnknown);
}

const jsxElementTypes = new Set<ts.SyntaxKind>([
    ts.SyntaxKind.JsxClosingElement,
    ts.SyntaxKind.JsxOpeningElement,
    ts.SyntaxKind.JsxSelfClosingElement,
]);

function isJsxNativeElement(node: ts.Node): boolean {
    if (!isIdentifier(node) || node.parent === undefined) {
        return false;
    }

    // TypeScript <=2.1 incorrectly parses JSX fragments
    if (node.text === "") {
        return true;
    }

    return jsxElementTypes.has(node.parent.kind) && isLowerCase(node.text[0]);
}

function isStringLike(expr: ts.Expression, checker: ts.TypeChecker): boolean {
    return isTypeFlagSet(checker.getTypeAtLocation(expr), ts.TypeFlags.StringLike);
}

function isAny(type: ts.Type | undefined, orUnknown: boolean = false): boolean {
    return (
        type !== undefined &&
        (isTypeFlagSet(type, ts.TypeFlags.Any) ||
            (orUnknown && isTypeFlagSet(type, ts.TypeFlags.Unknown)))
    );
}
