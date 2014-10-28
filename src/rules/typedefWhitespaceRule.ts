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
        this.checkSpace("callSignature", node, node.typeAnnotation);

        super.visitCallSignature(node);
    }

    public visitCatchClause(node: TypeScript.CatchClauseSyntax): void {
        this.checkSpace("catchClause", node, node.typeAnnotation);

        super.visitCatchClause(node);
    }

    public visitIndexSignature(node: TypeScript.IndexSignatureSyntax): void {
        this.checkSpace("indexSignature", node, node.typeAnnotation);

        super.visitIndexSignature(node);
    }

    public visitParameter(node: TypeScript.ParameterSyntax): void {
        this.checkSpace("parameter", node, node.typeAnnotation);

        super.visitParameter(node);
    }

    public visitPropertySignature(node: TypeScript.PropertySignatureSyntax): void {
        this.checkSpace("propertySignature", node, node.typeAnnotation);

        super.visitPropertySignature(node);
    }

    public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
        this.checkSpace("variableDeclarator", node, node.typeAnnotation);

        super.visitVariableDeclarator(node);
    }

    public checkSpace(option: string, node: TypeScript.ISyntaxElement, typeAnnotation: TypeScript.TypeAnnotationSyntax) : void {
        if (this.hasOption(option) && typeAnnotation) {
            var typeAnnotationChildIndex = this.getTypeAnnotationIndex(node);
            var precedingChild = this.findPrecedingChild(node, typeAnnotationChildIndex);
            var trailingTrivia = TypeScript.trailingTrivia(precedingChild);
            var hasLeadingWhitespace = this.hasLeadingWhitespace(trailingTrivia);

            if (hasLeadingWhitespace !== (this.getOption(option) === "space")) {
                this.addFailure(
                    this.createFailure(
                        this.positionAfter(precedingChild),
                        1,
                        "expected " + this.getOption(option) + " in " + option + "."
                    )
                );
            }
        }
    }

    public hasOption(option: string): boolean {
        var allOptions = this.getOptions();
        if (!allOptions || allOptions.length === 0) {
            return false;
        }

        var options = allOptions[0];

        if (!options) {
            return false;
        }

        return !!options[option];
    }

    private getOption(option: string): string {
        var allOptions = this.getOptions();
        if (!allOptions || allOptions.length === 0) {
            return undefined;
        }

        var options = allOptions[0];

        return options[option];
    }

    private getTypeAnnotationIndex(node: TypeScript.ISyntaxElement): number {
        var index = 0;
        var current = TypeScript.childAt(node, index);

        while (!(current instanceof TypeScript.Syntax.Concrete.TypeAnnotationSyntax)) {
            index++;
            current = TypeScript.childAt(node, index);
        }
        return index;
    }

    private findPrecedingChild(node: TypeScript.ISyntaxElement, startIndex: number): TypeScript.ISyntaxElement {
        var offset = 0;
        var precedingChild: TypeScript.ISyntaxElement;

        while (!precedingChild) {
            offset++;
            precedingChild = TypeScript.childAt(node, startIndex - offset);
        }

        return precedingChild;
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
