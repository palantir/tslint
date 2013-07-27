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

    export class ClassNameRule extends AbstractRule {
        constructor() {
            super("classname");
        }

        public isEnabled() : boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new ClassNameWalker(syntaxTree));
        }
    }

    class ClassNameWalker extends Lint.RuleWalker {
        static FAILURE_STRING = "class name must start with an uppercase character";

        public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): void {
            var position = this.positionAfter(node.modifiers, node.classKeyword);
            var className = node.identifier.text();
            if (className.length > 0) {
                var firstCharacter = className.charAt(0);
                if (firstCharacter !== firstCharacter.toUpperCase()) {
                    this.addFailure(this.createFailure(position, ClassNameWalker.FAILURE_STRING));
                }
              }

            super.visitClassDeclaration(node);
        }
    }

}
