/*
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

/// <reference path='../../lib/tslint.d.ts' />

var OPTION_VARIABLES_BEFORE_FUNCTIONS = "variables-before-functions";
var OPTION_STATIC_BEFORE_INSTANCE = "static-before-instance";
var OPTION_PUBLIC_BEFORE_PRIVATE = "public-before-private";

export class Rule extends Lint.Rules.AbstractRule {
    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new MemberOrderingWalker(syntaxTree, this.getOptions()));
    }
}

interface IModifiers {
    isMethod: boolean;
    isPrivate: boolean;
    isInstance: boolean;
}

function getModifiers(isMethod: boolean, modifiers?: TypeScript.ISyntaxToken[]): IModifiers {
    var modifierStrings = modifiers.map((x) => {
        return x.text();
    });

    return {
        isMethod: isMethod,
        isPrivate: modifierStrings.indexOf("private") !== -1,
        isInstance: modifierStrings.indexOf("static") === -1
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
    private previous: IModifiers;

    constructor(syntaxTree: TypeScript.SyntaxTree, options: Lint.IOptions) {
        super(syntaxTree, options);
    }

    public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): void {
        this.previous = {
            isMethod: false,
            isPrivate: false,
            isInstance: false
        };
        super.visitClassDeclaration(node);
    }

    public visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): void {
        this.checkAndSetModifiers(node, getModifiers(true, node.modifiers));
        super.visitMemberFunctionDeclaration(node);
    }

    public visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): void {
        this.checkAndSetModifiers(node, getModifiers(false, node.modifiers));
        super.visitMemberVariableDeclaration(node);
    }

    private checkAndSetModifiers(node: TypeScript.ISyntaxElement, current: IModifiers): void {
        if (!this.canAppearAfter(this.previous, current)) {
            var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
            var message = "Declaration of " + toString(current) +
                " not allowed to appear after declaration of " + toString(this.previous);
            this.addFailure(this.createFailure(position, TypeScript.width(node), message));
        }
        this.previous = current;
    }

    private canAppearAfter(previous: IModifiers, current: IModifiers): boolean {
        if (this.hasOption(OPTION_VARIABLES_BEFORE_FUNCTIONS) && previous.isMethod !== current.isMethod) {
            return Number(previous.isMethod) < Number(current.isMethod);
        }

        if (this.hasOption(OPTION_STATIC_BEFORE_INSTANCE) && previous.isInstance !== current.isInstance) {
            return Number(previous.isInstance) < Number(current.isInstance);
        }

        if (this.hasOption(OPTION_PUBLIC_BEFORE_PRIVATE) && previous.isPrivate !== current.isPrivate) {
            return Number(previous.isPrivate) < Number(current.isPrivate);
        }

        return true;
    }
}
