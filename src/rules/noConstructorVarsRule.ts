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
    public static FAILURE_STRING_PART = " cannot be declared in the constructor";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoConstructorVariableDeclarationsWalker(syntaxTree, this.getOptions()));
    }
}

export class NoConstructorVariableDeclarationsWalker extends Lint.RuleWalker {

    public visitConstructorDeclaration(node: TypeScript.ConstructorDeclarationSyntax): void {
        var position = this.positionAfter(node.modifiers, node.constructorKeyword,
            node.parameterList.openParenToken);
        var list = node.parameterList.parameters;
        for (var i = 0; i < list.childCount(); i++) {
            var element = list.childAt(i);
            if (element.kind() !== TypeScript.SyntaxKind.Parameter) {
                // trivia is also part of this list
                position += element.fullWidth();
                continue;
            }
            var parameter = <TypeScript.ParameterSyntax> element;
            if (parameter.modifiers.childCount() > 0) {
                this.addFailure(this.createFailure(position, parameter.modifiers.fullWidth(),
                    "'" + parameter.identifier.text() + "'" + Rule.FAILURE_STRING_PART));
            }
            position += parameter.fullWidth();
        }
        super.visitConstructorDeclaration(node);
    }
}
