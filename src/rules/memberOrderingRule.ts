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
import * as Lint from "../lint";
import * as ts from "typescript";

const OPTION_VARIABLES_BEFORE_FUNCTIONS = "variables-before-functions";
const OPTION_STATIC_BEFORE_INSTANCE = "static-before-instance";
const OPTION_PUBLIC_BEFORE_PRIVATE = "public-before-private";

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MemberOrderingWalker(sourceFile, this.getOptions()));
    }
}

interface IModifiers {
    isMethod: boolean;
    isPrivate: boolean;
    isInstance: boolean;
}

function getModifiers(isMethod: boolean, modifiers?: ts.ModifiersArray): IModifiers {
    return {
        isInstance: !Lint.hasModifier(modifiers, ts.SyntaxKind.StaticKeyword),
        isMethod: isMethod,
        isPrivate: Lint.hasModifier(modifiers, ts.SyntaxKind.PrivateKeyword)
    };
}

function toString(modifiers: IModifiers): string {
    return [
        modifiers.isPrivate ? "private" : "public",
        modifiers.isInstance ? "instance" : "static",
        "member",
        modifiers.isMethod ? "function" : "variable"
    ].join(" ");
}

export class MemberOrderingWalker extends Lint.RuleWalker {
    private previousMember: IModifiers;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
    }

    public visitClassDeclaration(node: ts.ClassDeclaration) {
        this.resetPreviousModifiers();
        super.visitClassDeclaration(node);
    }

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        this.resetPreviousModifiers();
        super.visitInterfaceDeclaration(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.checkModifiersAndSetPrevious(node, getModifiers(true, node.modifiers));
        super.visitMethodDeclaration(node);
    }

    public visitMethodSignature(node: ts.SignatureDeclaration) {
        this.checkModifiersAndSetPrevious(node, getModifiers(true, node.modifiers));
        super.visitMethodSignature(node);
    }

    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        const { initializer } = node;
        const isFunction = initializer != null
            && (initializer.kind === ts.SyntaxKind.ArrowFunction || initializer.kind === ts.SyntaxKind.FunctionExpression);
        this.checkModifiersAndSetPrevious(node, getModifiers(isFunction, node.modifiers));
        super.visitPropertyDeclaration(node);
    }

    public visitPropertySignature(node: ts.PropertyDeclaration) {
        const isFunction = node.type != null && node.type.kind === ts.SyntaxKind.FunctionType;
        this.checkModifiersAndSetPrevious(node, getModifiers(isFunction, node.modifiers));
        super.visitPropertySignature(node);
    }

    public visitTypeLiteral(node: ts.TypeLiteralNode) {
        // don't call super from here -- we want to skip the property declarations in type literals
    }

    private resetPreviousModifiers() {
        this.previousMember = {
            isInstance: false,
            isMethod: false,
            isPrivate: false
        };
    }

    private checkModifiersAndSetPrevious(node: ts.Node, currentMember: IModifiers) {
        if (!this.canAppearAfter(this.previousMember, currentMember)) {
            const failure = this.createFailure(
                node.getStart(),
                node.getWidth(),
                `Declaration of ${toString(currentMember)} not allowed to appear after declaration of ${toString(this.previousMember)}`
            );
            this.addFailure(failure);
        }
        this.previousMember = currentMember;
    }

    private canAppearAfter(previousMember: IModifiers, currentMember: IModifiers) {
        if (previousMember == null || currentMember == null) {
            return true;
        }

        if (this.hasOption(OPTION_VARIABLES_BEFORE_FUNCTIONS) && previousMember.isMethod !== currentMember.isMethod) {
            return Number(previousMember.isMethod) < Number(currentMember.isMethod);
        }

        if (this.hasOption(OPTION_STATIC_BEFORE_INSTANCE) && previousMember.isInstance !== currentMember.isInstance) {
            return Number(previousMember.isInstance) < Number(currentMember.isInstance);
        }

        if (this.hasOption(OPTION_PUBLIC_BEFORE_PRIVATE) && previousMember.isPrivate !== currentMember.isPrivate) {
            return Number(previousMember.isPrivate) < Number(currentMember.isPrivate);
        }

        return true;
    }
}
