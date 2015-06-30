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

module Lint.Rules {
    export class AbstractRule implements Lint.IRule {
        private value: any;
        private options: Lint.IOptions;

        constructor(ruleName: string, value: any, disabledIntervals: Lint.IDisabledInterval[]) {
            let ruleArguments: any[] = [];

            if (Array.isArray(value) && value.length > 1) {
                ruleArguments = value.slice(1);
            }

            this.value = value;
            this.options = {
                disabledIntervals: disabledIntervals,
                ruleArguments: ruleArguments,
                ruleName: ruleName
            };
        }

        public getOptions(): Lint.IOptions {
            return this.options;
        }

        public apply(sourceFile: ts.SourceFile): RuleFailure[] {
            throw Lint.abstract();
        }

        public applyWithWalker(walker: Lint.RuleWalker): RuleFailure[] {
            walker.walk(walker.getSourceFile());
            return walker.getFailures();
        }

        public isEnabled(): boolean {
            const value = this.value;

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
