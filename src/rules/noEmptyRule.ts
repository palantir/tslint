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
    public static FAILURE_STRING = "block is empty";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new BlockWalker(sourceFile, this.getOptions()));
    }
}

class BlockWalker extends Lint.RuleWalker {
    private ignoredBlocks: ts.Block[] = [];

    public visitBlock(node: ts.Block): void {
        var openBrace = node.getChildAt(0);
        var closeBrace = node.getChildAt(node.getChildCount() - 1);

        var sourceFileText = node.getSourceFile().text;

        var hasCommentAfter = ts.getTrailingCommentRanges(sourceFileText, openBrace.getEnd()) != null;
        var hasCommentBefore = ts.getLeadingCommentRanges(sourceFileText, closeBrace.getFullStart()) != null;
        var isSkipped = this.ignoredBlocks.indexOf(node) !== -1;

        if (node.statements.length <= 0 && !hasCommentAfter && !hasCommentBefore && !isSkipped) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }

        super.visitBlock(node);
    }

    public visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
        var isSkipped = false;
        var parameters = node.parameters;

        for (var i = 0; i < parameters.length; i++) {
            var param = parameters[i];

            for (var j = 0; param.modifiers != null && j < param.modifiers.length; j++) {
                var modifier = param.modifiers[j].kind;

                if (this.isPropertyAccessModifier(param.modifiers[j].kind)) {
                    isSkipped = true;
                    this.ignoredBlocks.push(node.body);

                    break;
                }
            }

            if (isSkipped) {
                break;
            }
        }

        super.visitConstructorDeclaration(node);
    }

    private isPropertyAccessModifier(modifier: string): boolean {
        return modifier === ts.SyntaxKind.PrivateKeyword
            || modifier === ts.SyntaxKind.ProtectedKeyword
            || modifier === ts.SyntaxKind.PublicKeyword;
    }
}
