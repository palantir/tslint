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

var OPTION_VARIABLES_BEFORE_FUNCTIONS = "variables-before-functions";
var OPTION_STATIC_BEFORE_INSTANCE = "static-before-instance";
var OPTION_PUBLIC_BEFORE_PRIVATE = "public-before-private";

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
    var modifierStrings: string[] = [];
    if (modifiers != null) {
        modifierStrings = modifiers.map((x) => {
            return x.getText();
        });
    }

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

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
    }

    public visitClassDeclaration(node: ts.ClassDeclaration): void {
        this.resetPreviousModifiers();
        super.visitClassDeclaration(node);
    }

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void {
        this.resetPreviousModifiers();
        super.visitInterfaceDeclaration(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.checkAndSetModifiers(node, getModifiers(true, node.modifiers));
        super.visitMethodDeclaration(node);
    }

    public visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
        this.checkAndSetModifiers(node, getModifiers(false, node.modifiers));
        super.visitPropertyDeclaration(node);
    }

    public visitTypeLiteral(node: ts.TypeLiteralNode) {
        // don't call super from here -- we want to skip the property declarations in type literals
    }

    private resetPreviousModifiers(): void {
        this.previous = {
            isMethod: false,
            isPrivate: false,
            isInstance: false
        };
    }

    private checkAndSetModifiers(node: ts.Declaration, current: IModifiers): void {
        if (!this.canAppearAfter(this.previous, current)) {
            var message = "Declaration of " + toString(current) +
                " not allowed to appear after declaration of " + toString(this.previous);
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), message));
        }
        this.previous = current;
    }

    private canAppearAfter(previous: IModifiers, current: IModifiers): boolean {
        if (previous == null || current == null) {
            return true;
        }
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
