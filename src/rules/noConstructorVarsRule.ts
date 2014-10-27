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
        var parameterList = node.callSignature.parameterList;
        var position = this.positionAfter(node.modifiers, node.constructorKeyword, parameterList.openParenToken);
        var parameters = parameterList.parameters;
        for (var i = 0; i < TypeScript.childCount(parameters); i++) {
            var element = TypeScript.childAt(parameters, i);
            if (element.kind() !== TypeScript.SyntaxKind.Parameter) {
                // trivia is also part of this list
                position += TypeScript.fullWidth(element);
                continue;
            }
            var parameter = <TypeScript.ParameterSyntax> element;
            if (TypeScript.childCount(parameter.modifiers) > 0) {
                this.addFailure(this.createFailure(position, TypeScript.fullWidth(parameter.modifiers),
                    "'" + parameter.identifier.text() + "'" + Rule.FAILURE_STRING_PART));
            }
            position += TypeScript.fullWidth(parameter);
        }
        super.visitConstructorDeclaration(node);
    }
}
