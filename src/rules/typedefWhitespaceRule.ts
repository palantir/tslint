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
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new TypedefWhitespaceWalker(sourceFile, this.getOptions()));
    }
}

class TypedefWhitespaceWalker extends Lint.RuleWalker {
    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        const positionBeforeColon = this.positionBeforeColon(node);
        this.checkSpace("call-signature", node, node.type, positionBeforeColon);
        super.visitFunctionDeclaration(node);
    }

    public visitFunctionExpression(node: ts.FunctionExpression) {
        const positionBeforeColon = this.positionBeforeColon(node);
        this.checkSpace("call-signature", node, node.type, positionBeforeColon);
        super.visitFunctionExpression(node);
    }

    public visitGetAccessor(node: ts.AccessorDeclaration) {
        const positionBeforeColon = this.positionBeforeColon(node);
        this.checkSpace("call-signature", node, node.type, positionBeforeColon);
        super.visitGetAccessor(node);
    }

    public visitIndexSignatureDeclaration(node: ts.IndexSignatureDeclaration) {
        const indexParameter = node.parameters[0];

        if (indexParameter != null) {
            this.checkSpace("index-signature", indexParameter, indexParameter.type, indexParameter.name.getEnd());
        }

        super.visitIndexSignatureDeclaration(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        const positionBeforeColon = this.positionBeforeColon(node);
        this.checkSpace("call-signature", node, node.type, positionBeforeColon);
        super.visitMethodDeclaration(node);
    }

    public visitMethodSignature(node: ts.SignatureDeclaration) {
        const positionBeforeColon = this.positionBeforeColon(node);
        this.checkSpace("call-signature", node, node.type, positionBeforeColon);
        super.visitMethodSignature(node);
    }

    public visitParameterDeclaration(node: ts.ParameterDeclaration) {
        this.checkSpace("parameter", node, node.type, node.name.getEnd());
        super.visitParameterDeclaration(node);
    }

    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        this.checkSpace("property-declaration", node, node.type, node.name.getEnd());
        super.visitPropertyDeclaration(node);
    }

    public visitPropertySignature(node: ts.PropertyDeclaration) {
        this.checkSpace("property-declaration", node, node.type, node.name.getEnd());
        super.visitPropertySignature(node);
    }

    public visitSetAccessor(node: ts.AccessorDeclaration) {
        const positionBeforeColon = this.positionBeforeColon(node);
        this.checkSpace("call-signature", node, node.type, positionBeforeColon);
        super.visitSetAccessor(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        this.checkSpace("variable-declaration", node, node.type, node.name.getEnd());
        super.visitVariableDeclaration(node);
    }

    public checkSpace(option: string, node: ts.Node, typeNode: ts.TypeNode | ts.StringLiteral, positionBeforeColon: number) {
        if (this.hasOption(option) && typeNode != null && positionBeforeColon != null) {
            const scanner = ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, node.getText());
            let hasLeadingWhitespace: boolean;

            scanner.setTextPos(positionBeforeColon - node.getStart());
            hasLeadingWhitespace = scanner.scan() === ts.SyntaxKind.WhitespaceTrivia;

            if (hasLeadingWhitespace !== (this.getOption(option) === "space")) {
                const message = "expected " + this.getOption(option) + " in " + option;
                this.addFailure(this.createFailure(positionBeforeColon, 1, message));
            }
        }
    }

    public hasOption(option: string) {
        const allOptions = this.getOptions();
        if (allOptions == null || allOptions.length === 0) {
            return false;
        }

        const options = allOptions[0];
        return options == null || options[option] != null;
    }

    private getOption(option: string) {
        const allOptions = this.getOptions();
        if (allOptions == null || allOptions.length === 0) {
            return null;
        }

        const options = allOptions[0];
        return options[option];
    }

    private positionBeforeColon(node: ts.FunctionDeclaration | ts.FunctionExpression | ts.AccessorDeclaration |
                                        ts.MethodDeclaration | ts.SignatureDeclaration | ts.AccessorDeclaration) {
        const children = node.getChildren();
        for (let i = 0; i < children.length; ++i) {
            if (children[i].getText() === ":") {
                return children[i].pos;
            }
        }
        return 0;
    }
}
