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
        return this.applyWithWalker(<Lint.RuleWalker>(new TypedefWalker(syntaxTree, this.getOptions())));
    }
}

class TypedefWalker extends Lint.RuleWalker {

    public visitCallSignature(node: TypeScript.CallSignatureSyntax): void {
        this.checkTypeAnnotation("callSignature", node, node.typeAnnotation);

        super.visitCallSignature(node);
    }

    public visitCatchClause(node: TypeScript.CatchClauseSyntax): void {
        this.checkTypeAnnotation("catchClause", node, node.typeAnnotation, node.identifier);

        super.visitCatchClause(node);
    }

    public visitGetAccessorPropertyAssignment(node: TypeScript.GetAccessorPropertyAssignmentSyntax): void {
        this.checkTypeAnnotation("getAccessorPropertyAssignment", node, node.typeAnnotation, node.propertyName);

        super.visitGetAccessorPropertyAssignment(node);
    }

    public visitGetMemberAccessorDeclaration(node: TypeScript.GetMemberAccessorDeclarationSyntax): void {
        this.checkTypeAnnotation("getMemberAccessorDeclaration", node, node.typeAnnotation, node.propertyName);

        super.visitGetMemberAccessorDeclaration(node);
    }

    public visitIndexSignature(node: TypeScript.IndexSignatureSyntax): void {
        this.checkTypeAnnotation("indexSignature", node, node.typeAnnotation);

        super.visitIndexSignature(node);
    }

    public visitParameter(node: TypeScript.ParameterSyntax): void {
        this.checkTypeAnnotation("parameter", node, node.typeAnnotation, node.identifier);
        super.visitParameter(node);
    }

    public visitPropertySignature(node: TypeScript.PropertySignatureSyntax): void {
        this.checkTypeAnnotation("propertySignature", node, node.typeAnnotation, node.propertyName);

        super.visitPropertySignature(node);
    }

    public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
        this.checkTypeAnnotation("variableDeclarator", node, node.typeAnnotation, node.identifier);

        super.visitVariableDeclarator(node);
    }

    public checkTypeAnnotation(
        option: string,
        node: TypeScript.SyntaxNode,
        typeAnnotation: TypeScript.TypeAnnotationSyntax,
        name?: TypeScript.ISyntaxToken) : void {
        if (this.hasOption(option) && !typeAnnotation) {
            var name = name ? ": '" + name.text() + "'" : "";
            this.addFailure(
                this.createFailure(
                    this.positionAfter(node),
                    1,
                    "expected " + option + name + " to have a typedef."
                )
            );
        }
    }

    private addNotImplementedFailure(option: string) : void {
        if (this.hasOption(option)) {
            this.addFailure(this.createFailure(0, 1, option + " not implemented."));
        }
    }

    public hasOption(option: string): boolean {
        var allOptions = this.getOptions();
        if (!allOptions) {
            return false;
        }
        return allOptions.indexOf(option) > -1;
    }
}
