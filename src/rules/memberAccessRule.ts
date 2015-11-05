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
import * as Lint from "../lint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "default access modifier on member/method not allowed";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MemberAccessWalker(sourceFile, this.getOptions()));
    }
}

export class MemberAccessWalker extends Lint.RuleWalker {
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.validateVisibilityModifiers(node);
    }

    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        this.validateVisibilityModifiers(node);
    }

    private validateVisibilityModifiers(node: ts.Node) {
        const hasAnyVisibilityModifiers = Lint.hasModifier(
            node.modifiers,
            ts.SyntaxKind.PublicKeyword,
            ts.SyntaxKind.PrivateKeyword,
            ts.SyntaxKind.ProtectedKeyword
        );

        if (!hasAnyVisibilityModifiers) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
    }
}
