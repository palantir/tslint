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

    public visitGetAccessorPropertyAssignment(node: TypeScript.GetAccessorPropertyAssignmentSyntax): void {
        // TODO: The following check was not accurate/working.  Since the notation
        //       is esoteric, this subrule is marked as not implemented until
        //       the functionality is needed and the bugs worked out. 
        //this.checkSpace("getAccessorPropertyAssignment", node, node.typeAnnotation);

        this.addNotImplementedFailure("getAccessorPropertyAssignment");

        super.visitGetAccessorPropertyAssignment(node);
    }

    public visitGetMemberAccessorDeclaration(node: TypeScript.GetMemberAccessorDeclarationSyntax): void {
        // TODO: The following check was not accurate/working.  Since the notation
        //       is esoteric, this subrule is marked as not implemented until
        //       the functionality is needed and the bugs worked out. 
        //this.checkSpace("getMemberAccessorDeclaration", node, node.typeAnnotation);

        this.addNotImplementedFailure("getMemberAccessorDeclaration");

        super.visitGetMemberAccessorDeclaration(node);
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

    public checkSpace(option: string, node: TypeScript.SyntaxNode, typeAnnotation: TypeScript.TypeAnnotationSyntax) : void {
        if (this.hasOption(option) && typeAnnotation) {
            var typeAnnotationChildIndex = this.getTypeAnnotationIndex(node),
                preceedingChild = this.findPreceedingChild(node, typeAnnotationChildIndex),
                hasLeadingWhitespace = this.hasLeadingWhitespace(preceedingChild.trailingTrivia());

            if (hasLeadingWhitespace !== (this.getOption(option) === "space")) {
                this.addFailure(
                    this.createFailure(
                        this.positionAfter(preceedingChild),
                        1,
                        "expected " + this.getOption(option) + " in " + option + "."
                    )
                );
            }
        }
    }

    private addNotImplementedFailure(option: string) : void {
        if (this.hasOption(option)) {
            this.addFailure(this.createFailure(0, 1, option + " not implemented."));
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
