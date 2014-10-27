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

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "block is empty";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new BlockWalker(syntaxTree, this.getOptions()));
    }
}

class BlockWalker extends Lint.RuleWalker {
    private ignoredBlocks: TypeScript.BlockSyntax[] = [];

    public visitBlock(node: TypeScript.BlockSyntax): void {
        var hasCommentAfter = node.openBraceToken.trailingTrivia().hasComment();
        var hasCommentBefore = node.closeBraceToken.leadingTrivia().hasComment();
        var isSkipped = this.ignoredBlocks.indexOf(node) !== -1;

        if (TypeScript.childCount(node.statements) <= 0 && !hasCommentAfter && !hasCommentBefore && !isSkipped) {
            var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
            var width = TypeScript.width(node);
            this.addFailure(this.createFailure(position, width, Rule.FAILURE_STRING));
        }

        super.visitBlock(node);
    }

    public visitConstructorDeclaration(node: TypeScript.ConstructorDeclarationSyntax): void {
        var isSkipped = false;
        var parameters = node.callSignature.parameterList.parameters;

        for (var i = 0; i < parameters.length; i++) {
            var param = <TypeScript.ParameterSyntax> parameters[i];

            for (var j = 0; j < TypeScript.childCount(param.modifiers); j++) {
                var modifier = TypeScript.childAt(param.modifiers, j).kind();

                if (modifier === TypeScript.SyntaxKind.PublicKeyword || modifier === TypeScript.SyntaxKind.PrivateKeyword) {
                    isSkipped = true;

                    this.ignoredBlocks.push(node.block);

                    break;
                }
            }

            if (isSkipped) {
                break;
            }
        }

        super.visitConstructorDeclaration(node);
    }
}
