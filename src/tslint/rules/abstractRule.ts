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

/// <reference path='../../typescript/src/compiler/core/errors.ts'/>
/// <reference path='rule.ts'/>
/// <reference path='../language/ruleWalker.ts'/>

module Lint.Rules {

    export class AbstractRule implements Lint.Rule {
        private name: string;
        private value: any;

        constructor(name: string) {
            this.name = name;
        }

        public getName() {
            return this.name;
        }

        public getValue() {
            return this.value;
        }

        public setValue(value: any): void {
            this.value = value;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            throw TypeScript.Errors.abstract();
        }

        public applyWithWalker(walker: Lint.RuleWalker) {
            var sourceUnit = walker.getSyntaxTree().sourceUnit();
            sourceUnit.accept(walker);
            return walker.getFailures();
        }

        public isEnabled() : boolean {
            return true;
        }
    }

}
