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
    var OPTION_LEADING_UNDERSCORE = "allow-leading-underscore";
    var OPTION_INNER_UNDERSCORE = "allow-inner-underscore";

    export class VarNameRule extends AbstractRule {
        public static FAILURE_STRING = "variable name must be in camelcase or uppercase";

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new VarNameWalker(syntaxTree, this.getOptions()));
        }
    }

    class VarNameWalker extends Lint.RuleWalker {
        private options: any;
        
        constructor(syntaxTree: TypeScript.SyntaxTree, options: any) {
            super(syntaxTree);
            this.options = options;
        }
        
        public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
            var identifier = node.identifier;
            var variableName = identifier.text();
            var position = this.position() + identifier.leadingTriviaWidth();

            if (!this.isCamelCase(variableName) && !this.isUpperCase(variableName)) {
                this.addFailure(this.createFailure(position, identifier.width(), VarNameRule.FAILURE_STRING));
            }

            super.visitVariableDeclarator(node);
        }

        private isCamelCase(name: string): boolean {
            if (name.length <= 0) {
                return true;
            }

            var firstCharacter = name.charAt(0);
            return (firstCharacter === firstCharacter.toLowerCase() &&
                (firstCharacter !== "_" || this.hasOption(OPTION_LEADING_UNDERSCORE)) &&
                (name.indexOf("_", 1) === -1 || this.hasOption(OPTION_INNER_UNDERSCORE)));
        }

        private isUpperCase(name: string): boolean {
            return (name === name.toUpperCase());
        }
        
        private hasOption(option: string): boolean {
            if (this.options) {
                return this.options.indexOf(option) !== -1;
            } else {
                return false;
            }
        }
    }

}
