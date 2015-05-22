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

export class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING = "default access modifier on member/method not allowed";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MemberAccessWalker(sourceFile, this.getOptions()));
    }
}

interface IModifiers {
    hasAccessModifier: boolean;
}

function getModifiers(modifiers?: ts.ModifiersArray): IModifiers {
    let modifierStrings: string[] = [];
    if (modifiers != null) {
        modifierStrings = modifiers.map((x) => {
            return x.getText();
        });
    }

    let hasAccessModifier = modifierStrings.indexOf("public") !== -1;
    hasAccessModifier = hasAccessModifier || modifierStrings.indexOf("private") !== -1;
    hasAccessModifier = hasAccessModifier || modifierStrings.indexOf("protected") !== -1;

    return {
        hasAccessModifier: hasAccessModifier
    };
}

export class MemberAccessWalker extends Lint.RuleWalker {
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.checkModifiers(node, getModifiers(node.modifiers));
        super.visitMethodDeclaration(node);
    }

    public visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
        this.checkModifiers(node, getModifiers(node.modifiers));
        super.visitPropertyDeclaration(node);
    }

    private checkModifiers(node: ts.Node, current: IModifiers): void {
        if (!this.followsRules(current)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
    }

    private followsRules(current: IModifiers): boolean {
        return current.hasAccessModifier;
    }
}
