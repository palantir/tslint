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
            var typeAnnotationChildIndex = this.getTypeAnnotationIndex(<TypeScript.SyntaxNode>node),
                preceedingChild = this.findPreceedingChild(<TypeScript.SyntaxNode>node, typeAnnotationChildIndex),
                hasLeadingWhitespace = this.hasLeadingWhitespace(preceedingChild.trailingTrivia());

            if (hasLeadingWhitespace !== (this.getOption("callSignature") === "space")) {
                this.addFailure(
                    this.createFailure(
                        this.positionAfter(node.childAt(typeAnnotationChildIndex - 1)),
                        1,
                        "expected " + this.getOption("callSignature") + " in call signature."
                    )
                );
            }
        }
    }

    public visitCatchClause(node: TypeScript.CatchClauseSyntax): void {
        if (this.hasOption("catchClause") && node.typeAnnotation) {
            var typeAnnotationChildIndex = this.getTypeAnnotationIndex(<TypeScript.SyntaxNode>node),
                preceedingChild = this.findPreceedingChild(<TypeScript.SyntaxNode>node, typeAnnotationChildIndex),
                hasLeadingWhitespace = this.hasLeadingWhitespace(preceedingChild.trailingTrivia());

            if (hasLeadingWhitespace !== (this.getOption("catchClause") === "space")) {
                this.addFailure(
                    this.createFailure(
                        this.positionAfter(node.childAt(typeAnnotationChildIndex - 1)),
                        1,
                        "expected " + this.getOption("catchClause") + " in catch clause."
                    )
                );
            }
        }
    }

    public visitGetAccessorPropertyAssignment(node: TypeScript.GetAccessorPropertyAssignmentSyntax): void {
        if (this.hasOption("getAccessorPropertyAssignment") && node.typeAnnotation) {
            var typeAnnotationChildIndex = this.getTypeAnnotationIndex(<TypeScript.SyntaxNode>node),
                preceedingChild = this.findPreceedingChild(<TypeScript.SyntaxNode>node, typeAnnotationChildIndex),
                hasLeadingWhitespace = this.hasLeadingWhitespace(preceedingChild.trailingTrivia());

            if (hasLeadingWhitespace !== (this.getOption("getAccessorPropertyAssignment") === "space")) {
                this.addFailure(
                    this.createFailure(
                        this.positionAfter(node.childAt(typeAnnotationChildIndex - 1)),
                        1,
                        "expected " + this.getOption("getAccessorPropertyAssignment") + " in get accessor property assignment."
                    )
                );
            }
        }
    }

    public visitGetMemberAccessorDeclaration(node: TypeScript.GetMemberAccessorDeclarationSyntax): void {
        if (this.hasOption("getMemberAccessorDeclaration") && node.typeAnnotation) {
            var typeAnnotationChildIndex = this.getTypeAnnotationIndex(<TypeScript.SyntaxNode>node),
                preceedingChild = this.findPreceedingChild(<TypeScript.SyntaxNode>node, typeAnnotationChildIndex),
                hasLeadingWhitespace = this.hasLeadingWhitespace(preceedingChild.trailingTrivia());

            if (hasLeadingWhitespace !== (this.getOption("getMemberAccessorDeclaration") === "space")) {
                this.addFailure(
                    this.createFailure(
                        this.positionAfter(node.childAt(typeAnnotationChildIndex - 1)),
                        1,
                        "expected " + this.getOption("getMemberAccessorDeclaration") + " in get member accessor declaration."
                    )
                );
            }
        }
    }

    public visitIndexSignature(node: TypeScript.IndexSignatureSyntax): void {
        if (this.hasOption("indexSignature") && node.typeAnnotation) {
            var typeAnnotationChildIndex = this.getTypeAnnotationIndex(<TypeScript.SyntaxNode>node),
                preceedingChild = this.findPreceedingChild(<TypeScript.SyntaxNode>node, typeAnnotationChildIndex),
                hasLeadingWhitespace = this.hasLeadingWhitespace(preceedingChild.trailingTrivia());

            if (hasLeadingWhitespace !== (this.getOption("indexSignature") === "space")) {
                this.addFailure(
                    this.createFailure(
                        this.positionAfter(node.childAt(typeAnnotationChildIndex - 1)),
                        1,
                        "expected " + this.getOption("indexSignature") + " in index signature."
                    )
                );
            }
        }
    }

    public visitParameter(node: TypeScript.ParameterSyntax): void {
        if (this.hasOption("parameter") && node.typeAnnotation) {
            var typeAnnotationChildIndex = this.getTypeAnnotationIndex(<TypeScript.SyntaxNode>node),
                preceedingChild = this.findPreceedingChild(<TypeScript.SyntaxNode>node, typeAnnotationChildIndex),
                hasLeadingWhitespace = this.hasLeadingWhitespace(preceedingChild.trailingTrivia());

            if (hasLeadingWhitespace !== (this.getOption("parameter") === "space")) {
                this.addFailure(
                    this.createFailure(
                        this.positionAfter(node.childAt(typeAnnotationChildIndex - 1)),
                        1,
                        "expected " + this.getOption("parameter") + " in parameter."
                    )
                );
            }
        }
    }

    public visitPropertySignature(node: TypeScript.PropertySignatureSyntax): void {
        if (this.hasOption("propertySignature") && node.typeAnnotation) {
            var typeAnnotationChildIndex = this.getTypeAnnotationIndex(<TypeScript.SyntaxNode>node),
                preceedingChild = this.findPreceedingChild(<TypeScript.SyntaxNode>node, typeAnnotationChildIndex),
                hasLeadingWhitespace = this.hasLeadingWhitespace(preceedingChild.trailingTrivia());

            if (hasLeadingWhitespace !== (this.getOption("propertySignature") === "space")) {
                this.addFailure(
                    this.createFailure(
                        this.positionAfter(node.childAt(typeAnnotationChildIndex - 1)),
                        1,
                        "expected " + this.getOption("propertySignature") + " in property signature."
                    )
                );
            }
        }
    }

    public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
        if (this.hasOption("variableDeclarator") && node.typeAnnotation) {
            var typeAnnotationChildIndex = this.getTypeAnnotationIndex(<TypeScript.SyntaxNode>node),
                preceedingChild = this.findPreceedingChild(<TypeScript.SyntaxNode>node, typeAnnotationChildIndex),
                hasLeadingWhitespace = this.hasLeadingWhitespace(preceedingChild.trailingTrivia());

            if (hasLeadingWhitespace !== (this.getOption("variableDeclarator") === "space")) {
                this.addFailure(
                    this.createFailure(
                        this.positionAfter(node.childAt(typeAnnotationChildIndex - 1)),
                        1,
                        "expected " + this.getOption("variableDeclarator") + " in variable declarator."
                    )
                );
            }
        }
    }

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

    private getTypeAnnotationIndex(node: TypeScript.SyntaxNode): number {
        var index = 0,
            current = node.childAt(index);

        while (!(current instanceof TypeScript.TypeAnnotationSyntax)) {
            index++;
            current = node.childAt(index);
        }
        return index;
    }

    private findPreceedingChild(node: TypeScript.SyntaxNode, startIndex: number): TypeScript.ISyntaxElement {
        var preceedingChild,
            offset = 0;

        while (!preceedingChild) {
            offset++;
            preceedingChild = node.childAt(startIndex - offset);
        }
        return preceedingChild;
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
