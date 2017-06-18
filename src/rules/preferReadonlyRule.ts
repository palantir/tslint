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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { ClassScope, ParameterOrPropertyDeclaration } from "./prefer-readonly/classScope";

export class Rule extends Lint.Rules.TypedRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Requires that private variables are marked as `readonly` if they're never modified outside of the constructor.",
        descriptionDetails: Lint.Utils.dedent`
            If a private variable is only assigned to in the constructor, it should be declared as \`readonly\`.
        `,
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: Lint.Utils.dedent`
            Marking never-modified variables as readonly helps enforce the code's intent of keeping them as never-modified.
            It can also help prevent accidental changes of members not meant to be changed.`,
        requiresTypeInfo: true,
        ruleName: "prefer-readonly",
        type: "maintainability",
        typescriptOnly: true,
    };

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const preferReadonlyWalker = new PreferReadonlyWalker(sourceFile, this.ruleName, program.getTypeChecker());
        return this.applyWithWalker(preferReadonlyWalker);
    }
}

class PreferReadonlyWalker extends Lint.AbstractWalker<void> {
    private scope?: ClassScope;

    public constructor(sourceFile: ts.SourceFile, ruleName: string, private readonly typeChecker: ts.TypeChecker) {
        super(sourceFile, ruleName, undefined);
    }

    public walk(sourceFile: ts.SourceFile) {
        if (sourceFile.isDeclarationFile) {
            return;
        }

        ts.forEachChild(sourceFile, this.visitNode);
    }

    private readonly visitNode = (node: ts.Node) => {
        if (utils.hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword)) {
            return;
        }

        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.ClassExpression:
                this.handleClassDeclarationOrExpression(node as ts.ClassLikeDeclaration);
                break;

            case ts.SyntaxKind.Constructor:
                this.handleConstructor(node as ts.ConstructorDeclaration, this.scope!);
                break;

            case ts.SyntaxKind.PropertyDeclaration:
                this.handlePropertyDeclaration(node as ts.PropertyDeclaration, this.scope!);
                break;

            case ts.SyntaxKind.PropertyAccessExpression:
                if (this.scope !== undefined) {
                    this.handlePropertyAccessExpression(node as ts.PropertyAccessExpression, node.parent!, this.scope);
                }
                break;

            default:
                if (utils.isFunctionScopeBoundary(node)) {
                    this.handleFunctionScopeBoundary(node);
                } else {
                    ts.forEachChild(node, this.visitNode);
                }
        }
    }

    private handleFunctionScopeBoundary(node: ts.Node) {
        if (this.scope === undefined) {
            ts.forEachChild(node, this.visitNode);
            return;
        }

        this.scope.enterNonConstructorScope();
        ts.forEachChild(node, this.visitNode);
        this.scope.exitNonConstructorScope();
    }

    private handleClassDeclarationOrExpression(node: ts.ClassLikeDeclaration) {
        const parentScope = this.scope;
        const childScope = this.scope = new ClassScope(node, this.typeChecker);

        ts.forEachChild(node, this.visitNode);

        this.finalizeScope(childScope);
        this.scope = parentScope;
    }

    private handleConstructor(node: ts.ConstructorDeclaration, scope: ClassScope) {
        scope.enterConstructor();

        for (const parameter of node.parameters) {
            if (utils.isModifierFlagSet(parameter, ts.ModifierFlags.Private)) {
                scope.addDeclaredVariable(parameter);
            }
        }

        ts.forEachChild(node, this.visitNode);

        scope.exitConstructor();
    }

    private handlePropertyDeclaration(node: ts.PropertyDeclaration, scope: ClassScope) {
        scope.addDeclaredVariable(node);

        ts.forEachChild(node, this.visitNode);
    }

    private handlePropertyAccessExpression(node: ts.PropertyAccessExpression, parent: ts.Node, scope: ClassScope) {
        switch (parent.kind) {
            case ts.SyntaxKind.BinaryExpression:
                this.handleParentBinaryExpression(node, parent as ts.BinaryExpression, scope);
                break;

            case ts.SyntaxKind.DeleteExpression:
                this.handleDeleteExpression(node, scope);
                break;

            case ts.SyntaxKind.PostfixUnaryExpression:
            case ts.SyntaxKind.PrefixUnaryExpression:
                this.handleParentPostfixOrPrefixUnaryExpression(parent as ts.PostfixUnaryExpression | ts.PrefixUnaryExpression, scope);
        }

        ts.forEachChild(node, this.visitNode);
    }

    private handleParentBinaryExpression(node: ts.PropertyAccessExpression, parent: ts.BinaryExpression, scope: ClassScope) {
        if (parent.left === node && utils.isAssignmentKind(parent.operatorToken.kind)) {
            scope.addVariableModification(node);
        }
    }

    private handleParentPostfixOrPrefixUnaryExpression(node: ts.PostfixUnaryExpression | ts.PrefixUnaryExpression, scope: ClassScope) {
        if (node.operator === ts.SyntaxKind.PlusPlusToken || node.operator === ts.SyntaxKind.MinusMinusToken) {
            scope.addVariableModification(node.operand as ts.PropertyAccessExpression);
        }
    }

    private handleDeleteExpression(node: ts.PropertyAccessExpression, scope: ClassScope) {
        scope.addVariableModification(node);
    }

    private finalizeScope(scope: ClassScope) {
        for (const violatingNode of scope.finalizeUnmodifiedPrivateNonReadonlys()) {
            this.complainOnNode(violatingNode);
        }
    }

    private complainOnNode(node: ParameterOrPropertyDeclaration) {
        const fix = Lint.Replacement.appendText(node.modifiers!.end, " readonly");

        this.addFailureAtNode(node.name, this.createFailureString(node), fix);
    }

    private createFailureString(node: ParameterOrPropertyDeclaration) {
        const accessibility = utils.isModifierFlagSet(node, ts.ModifierFlags.Static)
            ? "static"
            : "member";

        const text = node.name.getText();

        return `Private ${accessibility} variable '${text}' is never reassigned; mark it as 'readonly'.`;
    }
}
