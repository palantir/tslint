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

var OPTION_LEADING_UNDERSCORE = "allow-leading-underscore";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "variable name must be in camelcase or uppercase";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new VariableNameWalker(syntaxTree, this.getOptions()));
    }
}

class VariableNameWalker extends Lint.RuleWalker {
    public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
        var propertyName = node.propertyName;
        var variableName = propertyName.text();
        var position = this.getPosition() + propertyName.leadingTriviaWidth();

        if (!this.isCamelCase(variableName) && !this.isUpperCase(variableName)) {
            this.addFailure(this.createFailure(position, TypeScript.width(propertyName), Rule.FAILURE_STRING));
        }

        super.visitVariableDeclarator(node);
    }

    public visitVariableStatement(node: TypeScript.VariableStatementSyntax): void {
        for (var i = 0; i < TypeScript.childCount(node.modifiers); i++) {
            // skip declaration statements
            if (TypeScript.childAt(node.modifiers, i).kind() === TypeScript.SyntaxKind.DeclareKeyword) {
                return;
            }
        }

        super.visitVariableStatement(node);
    }

    private isCamelCase(name: string): boolean {
        if (name.length <= 0) {
            return true;
        }

        var firstCharacter = name.charAt(0);
        var rest = name.substring(1);
        return (firstCharacter === firstCharacter.toLowerCase() && rest.indexOf("_") === -1 &&
               (firstCharacter !== "_" || this.hasOption(OPTION_LEADING_UNDERSCORE)));
    }

    private isUpperCase(name: string): boolean {
        return (name === name.toUpperCase());
    }
}
