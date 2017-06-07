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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Requires that private variables are marked as `readonly` if they're never modified outside of the constructor.",
        descriptionDetails: Lint.Utils.dedent`
            If a variable is only assigned to in the constructor, it should be declared as \`readonly\`.
        `,
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        ruleName: "prefer-readonly",
        type: "maintainability",
        typescriptOnly: true,
    };

    public static FAILURE_STRING_FACTORY(identifier: string) {
        return `Private member variable '${identifier}' is never reassigned; mark it as 'readonly'.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const preferReadonlyWalker = new PreferReadonlyWalker(sourceFile, this.ruleName, undefined);
        return this.applyWithWalker(preferReadonlyWalker);
    }
}

class ClassScope {
    public declaredMembers = new Map<string, ts.Identifier>();
    public modifiedMembers = new Set<string>();
    public inConstructor = false;

    // todo: use these
    public inMemberInitializer = false;
}

class PreferReadonlyWalker extends Lint.AbstractWalker<void> {
    private scope: ClassScope;

    public walk(sourceFile: ts.SourceFile) {
        if (sourceFile.isDeclarationFile) {
            return;
        }

        ts.forEachChild(sourceFile, this.visitNode);
    }

    private visitNode = (node: ts.Node) => {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
                this.handleClassDeclaration(node as ts.ClassDeclaration);
                break;

            case ts.SyntaxKind.Constructor:
                this.handleConstructor(node as ts.ConstructorDeclaration);
                break;

            case ts.SyntaxKind.PropertyDeclaration:
                this.handlePropertyDeclaration(node as ts.PropertyDeclaration);
                break;

            case ts.SyntaxKind.PropertyAccessExpression:
                this.handlePropertyAccessExpression(node as ts.PropertyAccessExpression, node.parent);
                break;

            default:
                ts.forEachChild(node, this.visitNode);
        }
    }

    private handleClassDeclaration(node: ts.ClassDeclaration) {
        const parentScope = this.scope;
        const childScope = this.scope = new ClassScope();

        ts.forEachChild(node, this.visitNode);

        this.finalizeScope(childScope);
        this.scope = parentScope;
    }

    private handleConstructor(node: ts.ConstructorDeclaration) {
        this.scope.inConstructor = true;
        ts.forEachChild(node, this.visitNode);
        this.scope.inConstructor = false;
    }

    private handlePropertyDeclaration(node: ts.PropertyDeclaration) {
        if (this.scope !== undefined
            && utils.isModfierFlagSet(node, ts.ModifierFlags.Private)
            && !utils.isModfierFlagSet(node, ts.ModifierFlags.Readonly)) {
            this.scope.declaredMembers.set(node.name.getText(), node.name as ts.Identifier);
        }

        ts.forEachChild(node, this.visitNode);
    }

    private handlePropertyAccessExpression(node: ts.PropertyAccessExpression, parent: ts.Node | undefined) {
        if (parent !== undefined) {
            switch (parent.kind) {
                case ts.SyntaxKind.BinaryExpression:
                    this.handleParentBinaryExpression(node, parent as ts.BinaryExpression);
                    break;

                case ts.SyntaxKind.DeleteExpression:
                    this.handleParentDeleteExpression(node);
            }
        }

        ts.forEachChild(node, this.visitNode);
    }
    private handleParentBinaryExpression(node: ts.PropertyAccessExpression, parent: ts.BinaryExpression) {
        if (parent.left === node && utils.isAssignmentKind(parent.operatorToken.kind)) {
            this.markMemberVariableAsModified(node.name.text);
        }
    }

    private handleParentDeleteExpression(node: ts.PropertyAccessExpression) {
        this.markMemberVariableAsModified(node.name.text);
    }

    private markMemberVariableAsModified(name: string) {
        if (this.scope !== undefined && !this.scope.inConstructor) {
            this.scope.modifiedMembers.add(name);
        }
    }

    private finalizeScope(scope: ClassScope) {
        scope.modifiedMembers.forEach((modifiedMember) => {
            scope.declaredMembers.delete(modifiedMember);
        });

        scope.declaredMembers.forEach((declaredMember, name) => {
            this.complainOnNode(declaredMember, name);
        });
    }

    private complainOnNode(node: ts.Identifier, name: string) {
        const fix = Lint.Replacement.appendText(node.getStart(), "readonly ");

        this.addFailureAtNode(node, Rule.FAILURE_STRING_FACTORY(name), fix);
    }
}
