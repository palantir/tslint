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

module Lint {
    export class RuleWalker extends Lint.SyntaxWalker {
        private limit: number;
        private position: number;
        private options: any[];
        private failures: RuleFailure[];
        private sourceFile: ts.SourceFile;
        private disabledIntervals: Lint.IDisabledInterval[];
        private ruleName: string;

        constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
            super();

            this.position = 0;
            this.failures = [];
            this.options = options.ruleArguments;
            this.sourceFile = sourceFile;
            this.limit = this.sourceFile.getFullWidth();
            this.disabledIntervals = options.disabledIntervals;
            this.ruleName = options.ruleName;
        }

        public getSourceFile(): ts.SourceFile {
            return this.sourceFile;
        }

        public getFailures(): RuleFailure[] {
            return this.failures;
        }

        /*
        public getPosition() {
            return this.position;
        }
        */

        public getLimit() {
            return this.limit;
        }

        /*
        public positionAfter(...nodes: ts.Node[]): number {
            var position = this.getPosition();
            nodes.forEach((node) => {
                if (node !== null) {
                    position += node.getFullWidth();
                }
            });
            return position;
        }
        */

        public getOptions(): any {
            return this.options;
        }

        public hasOption(option: string): boolean {
            if (this.options) {
                return this.options.indexOf(option) !== -1;
            } else {
                return false;
            }
        }

        public skip(node: ts.Node) {
            this.position += node.getFullWidth();
        }

        // create a failure at the given position
        public createFailure(start: number, width: number, failure: string): Lint.RuleFailure {
            var from = (start > this.limit) ? this.limit : start;
            var to = ((start + width) > this.limit) ? this.limit : (start + width);

            return new Lint.RuleFailure(this.sourceFile, from, to, failure, this.ruleName);
        }

        public addFailure(failure: RuleFailure) {
            if (!this.existsFailure(failure)) {
                // don't add failures for a rule if the failure intersects an interval where that rule is disabled
                if (!Lint.doesIntersect(failure, this.disabledIntervals)) {
                    this.failures.push(failure);
                }
            }
        }

        private existsFailure(failure: RuleFailure) {
            var filteredFailures = this.failures.filter(function(f) {
                return f.equals(failure);
            });

            return (filteredFailures.length > 0);
        }
    }

}
