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

/// <reference path='../walker/ruleWalker.ts'/>
/// <reference path='rule.ts'/>

module Lint.Rules {
    export class AbstractRule implements Lint.IRule {
        private value: any;
        private options: Lint.IOptions;

        constructor(ruleName: string, value: any, disabledIntervals: Lint.IDisabledInterval[]) {
            var ruleArguments: any[] = [];

            if (Array.isArray(value) && value.length > 1) {
                ruleArguments = value.slice(1);
            }

            this.value = value;
            this.options = {
                ruleArguments: ruleArguments,
                ruleName: ruleName,
                disabledIntervals: disabledIntervals
            };
        }

        public getOptions(): Lint.IOptions {
            return this.options;
        }

        /* tslint:disable:no-unused-variable */
        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            throw TypeScript.Errors.abstract();
        }
        /* tslint:enable:no-unused-variable */

        public applyWithWalker(walker: Lint.RuleWalker): RuleFailure[] {
            var sourceUnit = walker.getSyntaxTree().sourceUnit();
            walker.visitSourceUnit(sourceUnit);
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
