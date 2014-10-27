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

    public visitVariableDeclaration(node: TypeScript.VariableDeclarationSyntax): void {
        for (var i = 0, n = node.variableDeclarators.length; i < n; i++) {
            var item = <TypeScript.VariableDeclaratorSyntax>node.variableDeclarators[i];
            this.checkTypeAnnotation("variableDeclarator", node, item.typeAnnotation, item.propertyName);
        }

        super.visitVariableDeclaration(node);
    }

    public visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): void {
        var variableDeclarator =  node.variableDeclarator;
        this.checkTypeAnnotation("memberVariableDeclarator", variableDeclarator, variableDeclarator.typeAnnotation,
            variableDeclarator.propertyName);

        super.visitMemberVariableDeclaration(node);
    }

    public checkTypeAnnotation(option: string,
                               node: TypeScript.ISyntaxNode,
                               typeAnnotation: TypeScript.TypeAnnotationSyntax,
                               name?: TypeScript.ISyntaxToken): void {

        if (this.hasOption(option) && !typeAnnotation) {
            var ns = name ? ": '" + name.text() + "'" : "";
            var failure = this.createFailure(this.positionAfter(node), 1, "expected " + option + ns + " to have a typedef.");
            this.addFailure(failure);
        }
    }
}
