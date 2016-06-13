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

import * as ts from "typescript";
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING_FACTORY = (memberType: string, memberName: string, publicOnly: boolean) => {
        memberName = memberName == null ? "" : ` '${memberName}'`;
        if (publicOnly) {
            return `The ${memberType}${memberName} must be marked as 'public'`;
        }
        return `The ${memberType}${memberName} must be marked either 'private', 'public', or 'protected'`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MemberAccessWalker(sourceFile, this.getOptions()));
    }
}

export class MemberAccessWalker extends Lint.RuleWalker {
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
    }

    public visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
        if (this.hasOption("check-constructor")) {
            // constructor is only allowed to have public or nothing, but the compiler will catch this
            this.validateVisibilityModifiers(node);
        }

        super.visitConstructorDeclaration(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.validateVisibilityModifiers(node);
        super.visitMethodDeclaration(node);
    }

    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        this.validateVisibilityModifiers(node);
        super.visitPropertyDeclaration(node);
    }

    public visitGetAccessor(node: ts.AccessorDeclaration) {
        if (this.hasOption("check-accessor")) {
            this.validateVisibilityModifiers(node);
        }
        super.visitGetAccessor(node);
    }

    public visitSetAccessor(node: ts.AccessorDeclaration) {
        if (this.hasOption("check-accessor")) {
            this.validateVisibilityModifiers(node);
        }
        super.visitSetAccessor(node);
    }

    private validateVisibilityModifiers(node: ts.Node) {
        if (node.parent.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            return;
        }

        const hasAnyVisibilityModifiers = Lint.hasModifier(
            node.modifiers,
            ts.SyntaxKind.PublicKeyword,
            ts.SyntaxKind.PrivateKeyword,
            ts.SyntaxKind.ProtectedKeyword
        );

        if (!hasAnyVisibilityModifiers) {
            let memberType: string;
            let publicOnly = false;

            if (node.kind === ts.SyntaxKind.MethodDeclaration) {
                memberType = "class method";
            } else if (node.kind === ts.SyntaxKind.PropertyDeclaration) {
                memberType = "class property";
            } else if (node.kind === ts.SyntaxKind.Constructor) {
                memberType = "class constructor";
                publicOnly = true;
            } else if (node.kind === ts.SyntaxKind.GetAccessor) {
                memberType = "get property accessor";
            } else if (node.kind === ts.SyntaxKind.SetAccessor) {
                memberType = "set property accessor";
            }

            // look for the identifier and get it's text
            let memberName: string;
            node.getChildren().forEach((n: ts.Node) => {
                if (n.kind === ts.SyntaxKind.Identifier) {
                    memberName = n.getText();
                }
            });

            const failureString = Rule.FAILURE_STRING_FACTORY(memberType, memberName, publicOnly);
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), failureString));
        }
    }
}
