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
import { typeIsOrHasBaseType } from "../language/typeUtils";
import { isFunctionScopeBoundary } from "../utils";

const OPTION_ONLY_INLINE_LAMBDAS = "only-inline-lambdas";

type ParameterOrPropertyDeclaration = ts.ParameterDeclaration | ts.PropertyDeclaration;

interface Options {
    onlyInlineLambdas: boolean;
}

export class Rule extends Lint.Rules.TypedRule {
    public static metadata: Lint.IRuleMetadata = {
        description:
            "Requires that private variables are marked as `readonly` if they're never modified outside of the constructor.",
        descriptionDetails: Lint.Utils.dedent`
            If a private variable is only assigned to in the constructor, it should be declared as \`readonly\`.
        `,
        optionExamples: [true, [true, OPTION_ONLY_INLINE_LAMBDAS]],
        options: {
            enum: [OPTION_ONLY_INLINE_LAMBDAS],
            type: "string",
        },
        optionsDescription: Lint.Utils.dedent`
            If \`${OPTION_ONLY_INLINE_LAMBDAS}\` is specified, only immediately-declared arrow functions are checked.`,
        rationale: Lint.Utils.dedent`
            Marking never-modified variables as readonly helps enforce the code's intent of keeping them as never-modified.
            It can also help prevent accidental changes of members not meant to be changed.`,
        requiresTypeInfo: true,
        ruleName: "prefer-readonly",
        type: "maintainability",
        typescriptOnly: true,
    };

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const options = {
            onlyInlineLambdas: this.ruleArguments.indexOf(OPTION_ONLY_INLINE_LAMBDAS) !== -1,
        };

        return this.applyWithFunction(sourceFile, walk, options, program.getTypeChecker());
    }
}

function walk(context: Lint.WalkContext<Options>, typeChecker: ts.TypeChecker) {
    if (context.sourceFile.isDeclarationFile) {
        return;
    }

    let scope: ClassScope;

    ts.forEachChild(context.sourceFile, visitNode);

    function visitNode(node: ts.Node) {
        if (utils.hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword)) {
            return;
        }

        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.ClassExpression:
                handleClassDeclarationOrExpression(node as ts.ClassLikeDeclaration);
                break;

            case ts.SyntaxKind.Constructor:
                handleConstructor(node as ts.ConstructorDeclaration);
                break;

            case ts.SyntaxKind.PropertyDeclaration:
                handlePropertyDeclaration(node as ts.PropertyDeclaration);
                break;

            case ts.SyntaxKind.PropertyAccessExpression:
                if (scope !== undefined) {
                    handlePropertyAccessExpression(
                        node as ts.PropertyAccessExpression,
                        node.parent,
                    );
                }
                break;

            default:
                // tslint:disable:deprecation This is needed for https://github.com/palantir/tslint/pull/4274 and will be fixed once TSLint
                // requires tsutils > 3.0.
                if (isFunctionScopeBoundary(node)) {
                    // tslint:enable:deprecation
                    handleFunctionScopeBoundary(node);
                } else {
                    ts.forEachChild(node, visitNode);
                }
        }
    }

    function handleFunctionScopeBoundary(node: ts.Node) {
        if (scope === undefined) {
            ts.forEachChild(node, visitNode);
            return;
        }

        scope.enterNonConstructorScope();
        ts.forEachChild(node, visitNode);
        scope.exitNonConstructorScope();
    }

    function handleClassDeclarationOrExpression(node: ts.ClassLikeDeclaration) {
        const parentScope = scope;
        const childScope = (scope = new ClassScope(node, typeChecker));

        ts.forEachChild(node, visitNode);

        finalizeScope(childScope);
        scope = parentScope;
    }

    function handleConstructor(node: ts.ConstructorDeclaration) {
        scope.enterConstructor();

        for (const parameter of node.parameters) {
            if (utils.isModifierFlagSet(parameter, ts.ModifierFlags.Private)) {
                scope.addDeclaredVariable(parameter);
            }
        }

        ts.forEachChild(node, visitNode);

        scope.exitConstructor();
    }

    function handlePropertyDeclaration(node: ts.PropertyDeclaration) {
        if (!shouldPropertyDeclarationBeIgnored(node)) {
            scope.addDeclaredVariable(node);
        }

        ts.forEachChild(node, visitNode);
    }

    function handlePropertyAccessExpression(node: ts.PropertyAccessExpression, parent: ts.Node) {
        switch (parent.kind) {
            case ts.SyntaxKind.BinaryExpression:
                handleParentBinaryExpression(node, parent as ts.BinaryExpression);
                break;

            case ts.SyntaxKind.DeleteExpression:
                handleDeleteExpression(node);
                break;

            case ts.SyntaxKind.PostfixUnaryExpression:
            case ts.SyntaxKind.PrefixUnaryExpression:
                handleParentPostfixOrPrefixUnaryExpression(parent as
                    | ts.PostfixUnaryExpression
                    | ts.PrefixUnaryExpression);
        }

        ts.forEachChild(node, visitNode);
    }

    function handleParentBinaryExpression(
        node: ts.PropertyAccessExpression,
        parent: ts.BinaryExpression,
    ) {
        if (parent.left === node && utils.isAssignmentKind(parent.operatorToken.kind)) {
            scope.addVariableModification(node);
        }
    }

    function handleParentPostfixOrPrefixUnaryExpression(
        node: ts.PostfixUnaryExpression | ts.PrefixUnaryExpression,
    ) {
        if (
            node.operator === ts.SyntaxKind.PlusPlusToken ||
            node.operator === ts.SyntaxKind.MinusMinusToken
        ) {
            scope.addVariableModification(node.operand as ts.PropertyAccessExpression);
        }
    }

    function handleDeleteExpression(node: ts.PropertyAccessExpression) {
        scope.addVariableModification(node);
    }

    function shouldPropertyDeclarationBeIgnored(node: ts.PropertyDeclaration) {
        if (!context.options.onlyInlineLambdas) {
            return false;
        }

        return (
            node.initializer === undefined || node.initializer.kind !== ts.SyntaxKind.ArrowFunction
        );
    }

    function finalizeScope(childScope: ClassScope) {
        for (const violatingNode of childScope.finalizeUnmodifiedPrivateNonReadonlys()) {
            complainOnNode(violatingNode);
        }
    }

    function complainOnNode(node: ts.ParameterDeclaration | ts.PropertyDeclaration) {
        const fix = Lint.Replacement.appendText(node.modifiers!.end, " readonly");

        context.addFailureAtNode(node.name, createFailureString(node), fix);
    }
}

function createFailureString(node: ts.ParameterDeclaration | ts.PropertyDeclaration) {
    const accessibility = utils.isModifierFlagSet(node, ts.ModifierFlags.Static)
        ? "static"
        : "member";

    const text = node.name.getText();

    return `Private ${accessibility} variable '${text}' is never reassigned; mark it as 'readonly'.`;
}

const OUTSIDE_CONSTRUCTOR = -1;
const DIRECTLY_INSIDE_CONSTRUCTOR = 0;

class ClassScope {
    private readonly privateModifiableMembers = new Map<string, ParameterOrPropertyDeclaration>();
    private readonly privateModifiableStatics = new Map<string, ParameterOrPropertyDeclaration>();
    private readonly memberVariableModifications = new Set<string>();
    private readonly staticVariableModifications = new Set<string>();

    private readonly typeChecker: ts.TypeChecker;
    private readonly classType: ts.Type;

    private constructorScopeDepth = OUTSIDE_CONSTRUCTOR;

    public constructor(classNode: ts.Node, typeChecker: ts.TypeChecker) {
        this.classType = typeChecker.getTypeAtLocation(classNode);
        this.typeChecker = typeChecker;
    }

    public addDeclaredVariable(node: ParameterOrPropertyDeclaration) {
        if (
            !utils.isModifierFlagSet(node, ts.ModifierFlags.Private) ||
            utils.isModifierFlagSet(node, ts.ModifierFlags.Readonly) ||
            node.name.kind === ts.SyntaxKind.ComputedPropertyName
        ) {
            return;
        }

        if (utils.isModifierFlagSet(node, ts.ModifierFlags.Static)) {
            this.privateModifiableStatics.set(node.name.getText(), node);
        } else {
            this.privateModifiableMembers.set(node.name.getText(), node);
        }
    }

    public addVariableModification(node: ts.PropertyAccessExpression) {
        const modifierType = this.typeChecker.getTypeAtLocation(node.expression);
        if (
            modifierType.symbol === undefined ||
            !typeIsOrHasBaseType(modifierType, this.classType)
        ) {
            return;
        }

        const toStatic =
            utils.isObjectType(modifierType) &&
            utils.isObjectFlagSet(modifierType, ts.ObjectFlags.Anonymous);
        if (!toStatic && this.constructorScopeDepth === DIRECTLY_INSIDE_CONSTRUCTOR) {
            return;
        }

        const variable = node.name.text;

        (toStatic ? this.staticVariableModifications : this.memberVariableModifications).add(
            variable,
        );
    }

    public enterConstructor() {
        this.constructorScopeDepth = DIRECTLY_INSIDE_CONSTRUCTOR;
    }

    public exitConstructor() {
        this.constructorScopeDepth = OUTSIDE_CONSTRUCTOR;
    }

    public enterNonConstructorScope() {
        if (this.constructorScopeDepth !== OUTSIDE_CONSTRUCTOR) {
            this.constructorScopeDepth += 1;
        }
    }

    public exitNonConstructorScope() {
        if (this.constructorScopeDepth !== OUTSIDE_CONSTRUCTOR) {
            this.constructorScopeDepth -= 1;
        }
    }

    public finalizeUnmodifiedPrivateNonReadonlys() {
        this.memberVariableModifications.forEach(variableName => {
            this.privateModifiableMembers.delete(variableName);
        });

        this.staticVariableModifications.forEach(variableName => {
            this.privateModifiableStatics.delete(variableName);
        });

        return [
            ...Array.from(this.privateModifiableMembers.values()),
            ...Array.from(this.privateModifiableStatics.values()),
        ];
    }
}
