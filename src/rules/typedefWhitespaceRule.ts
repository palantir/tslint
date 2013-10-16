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

/// <reference path="../../lib/tslint.d.ts" />

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "missing type declaration";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(<Lint.RuleWalker>(new TypedefWhitespaceWalker(syntaxTree, this.getOptions())));
    }
}

class TypedefWhitespaceWalker extends Lint.RuleWalker {

    public visitCallSignature(node: TypeScript.CallSignatureSyntax): void {
        if (this.hasOption("callSignature") && node.typeAnnotation) {
            var typeAnnotationChildIndex = this.getHasLeadingWhitespace(<TypeScript.SyntaxNode>node),
                preceedingChild,
                offset = 0;

            while (!preceedingChild) {
                offset++;
                preceedingChild = node.childAt(typeAnnotationChildIndex - offset);
            }

            var hasLeadingWhitespace = this.hasLeadingWhitespace(preceedingChild.trailingTrivia());

            if (hasLeadingWhitespace !== (this.getOption("callSignature") === "space")) {
                this.addFailure(
                    this.createFailure(
                        this.positionAfter(node.childAt(typeAnnotationChildIndex - 1)),
                        1,
                        "failed expected whitespace rule."
                    )
                );
            }
        }
    }

    public visitCatchClause(node: TypeScript.CatchClauseSyntax): void {
        if (this.hasOption("catchClause") && node.typeAnnotation) {
            var typeAnnotationChildIndex = this.getHasLeadingWhitespace(<TypeScript.SyntaxNode>node),
                hasLeadingWhitespace = this.hasLeadingWhitespace(node.childAt(typeAnnotationChildIndex - 1).trailingTrivia());

            if (hasLeadingWhitespace !== (this.getOption("catchClause") === "space")) {
                this.addFailure(
                    this.createFailure(
                        this.positionAfter(node.childAt(typeAnnotationChildIndex - 1)),
                        1,
                        "failed expected whitespace rule."
                    )
                );
            }
        }
    }

//    public visitGetAccessorPropertyAssignment(node: TypeScript.GetAccessorPropertyAssignmentSyntax): void {
//        var current = node.findToken(node.childCount());
//        while (!(current.token() instanceof TypeScript.TypeAnnotationSyntax)) {
//            current = current.previousToken();
//        }
//        console.log(this.hasLeadingWhitespace(current.token().trailingTrivia()));
//    }
//
//    public visitGetMemberAccessorDeclaration(node: TypeScript.GetMemberAccessorDeclarationSyntax): void {
//        var current = node.findToken(node.childCount());
//        while (!(current.token() instanceof TypeScript.TypeAnnotationSyntax)) {
//            current = current.previousToken();
//        }
//        console.log(this.hasLeadingWhitespace(current.token().trailingTrivia()));
//    }
//
//    public visitIndexSignature(node: TypeScript.IndexSignatureSyntax): void {
//        var current = node.findToken(node.childCount());
//        while (!(current.token() instanceof TypeScript.TypeAnnotationSyntax)) {
//            current = current.previousToken();
//        }
//        console.log(this.hasLeadingWhitespace(current.token().trailingTrivia()));
//    }
//
    public visitParameter(node: TypeScript.ParameterSyntax): void {
        if (this.hasOption("parameter") && node.typeAnnotation) {
            var typeAnnotationChildIndex = this.getHasLeadingWhitespace(<TypeScript.SyntaxNode>node),
                preceedingChild,
                offset = 0;

            while (!preceedingChild) {
                offset++;
                preceedingChild = node.childAt(typeAnnotationChildIndex - offset);
            }

            var hasLeadingWhitespace = this.hasLeadingWhitespace(preceedingChild.trailingTrivia());

            if (hasLeadingWhitespace !== (this.getOption("parameter") === "space")) {
                this.addFailure(
                    this.createFailure(
                        this.positionAfter(node.childAt(typeAnnotationChildIndex - 1)),
                        1,
                        "failed expected whitespace rule."
                    )
                );
            }
        }
    }

//    public visitPropertySignature(node: TypeScript.PropertySignatureSyntax): void {
//        var current = node.findToken(node.childCount());
//        while (!(current.token() instanceof TypeScript.TypeAnnotationSyntax)) {
//            current = current.previousToken();
//        }
//        console.log(this.hasLeadingWhitespace(current.token().trailingTrivia()));
//    }
//
//    public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
//        var current = node.findToken(node.childCount());
//        while (!(current.token() instanceof TypeScript.TypeAnnotationSyntax)) {
//            current = current.previousToken();
//        }
//        console.log(this.hasLeadingWhitespace(current.token().trailingTrivia()));
//    }

    public hasOption(option: string): boolean {
        var options = this.getOptions()[0];

        if (!options) {
            return false;
        }

        return !!options[option];
    }

    private getOption(option: string): string {
        var options = this.getOptions()[0];

        return options[option];
    }

    private getHasLeadingWhitespace(node: TypeScript.SyntaxNode): number {
        var index = 0,
            current = node.childAt(index);
        while (!(current instanceof TypeScript.TypeAnnotationSyntax)) {
            index++;
            current = node.childAt(index);
        }
        return index
    }

    private hasLeadingWhitespace(trivia: TypeScript.ISyntaxTriviaList): boolean {
        if (trivia.count() < 1) {
            return false;
        } else {
            var kind = trivia.syntaxTriviaAt(0).kind();
            if (kind !== TypeScript.SyntaxKind.WhitespaceTrivia && kind !== TypeScript.SyntaxKind.NewLineTrivia) {
                return false;
            }
        }
        return true;
    }
}
