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

/// <reference path='rule.ts'/>
/// <reference path='abstractRule.ts'/>

module Lint.Rules {

    export class VariableNameRule extends AbstractRule {
        constructor() {
            super("variable_name");
        }

        public isEnabled() : boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new VariableNameWalker(syntaxTree));
        }
    }

    class VariableNameWalker extends Lint.RuleWalker {
        static FAILURE_STRING = "variable name must be in camelcase or uppercase";

        public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
            var identifier = node.identifier;
            var variableName = identifier.text();
            var position = this.position() + identifier.leadingTriviaWidth();

            if (!this.isCamelCase(variableName) && !this.isUpperCase(variableName)) {
                this.addFailure(this.createFailure(position, VariableNameWalker.FAILURE_STRING));
            }

            super.visitVariableDeclarator(node);
        }

        private isCamelCase(name: string): boolean {
            if (name.length < 0) {
                return true;
            }

            var firstCharacter = name.charAt(0);
            return (firstCharacter === firstCharacter.toLowerCase());
        }

        private isUpperCase(name: string): boolean {
            return (name === name.toUpperCase());
        }
    }

}
