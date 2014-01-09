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
/// <reference path='../walker/ruleWalker.ts'/>
/// <reference path='rule.ts'/>

module Lint.Rules {
    export class AbstractRule implements Lint.Rule {
        private value: any;
        private disabledIntervals: Lint.IDisabledInterval[];

        constructor(value: any, disabledIntervals: Lint.IDisabledInterval[]) {
            this.value = value;
            this.disabledIntervals = disabledIntervals;
        }

        public getOptions(): Lint.IOptions {
            var value = this.value;
            var options = [];
            if (Array.isArray(value) && value.length > 1) {
                options = value.slice(1);
            }
            return {disabledIntervals: this.disabledIntervals, ruleArguments: options};

        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            throw TypeScript.Errors.abstract();
        }

        public applyWithWalker(walker: Lint.RuleWalker): RuleFailure[] {
            var sourceUnit = walker.getSyntaxTree().sourceUnit();
            sourceUnit.accept(walker);
            return walker.getFailures();
        }

        public isEnabled(): boolean {
            var value = this.value;

            if (typeof value === "boolean") {
                return value;
            }

            if (Array.isArray(value) && value.length > 0) {
                return value[0];
            }

            return false;
        }
    }

}
