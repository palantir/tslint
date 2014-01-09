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
/// <reference path='../../typescript/src/compiler/syntax/positionTrackingWalker.ts'/>
/// <reference path='../../typescript/src/compiler/syntax/syntaxKind.ts'/>
/// <reference path='../rule/rule.ts'/>

module Lint {

    export class RuleWalker extends TypeScript.PositionTrackingWalker {
        private limit: number;
        private fileName: string;
        private options: any[];
        private failures: RuleFailure[];
        private syntaxTree: TypeScript.SyntaxTree;
        private disabledIntervals: Lint.IDisabledInterval[];

        constructor(syntaxTree: TypeScript.SyntaxTree, options: Lint.IOptions) {
            super();

            this.failures = [];
            this.options = options.ruleArguments;
            this.syntaxTree = syntaxTree;
            this.limit = this.syntaxTree.sourceUnit().fullWidth();
            this.disabledIntervals = options.disabledIntervals;
        }

        public getSyntaxTree(): TypeScript.SyntaxTree {
            return this.syntaxTree;
        }

        public getFailures(): RuleFailure[] {
            return this.failures;
        }

        public positionAfter(...elements: TypeScript.ISyntaxElement[]): number {
            var position = this.position();
            elements.forEach((element) => {
                if (element !== null) {
                    position += element.fullWidth();
                }
            });
            return position;
        }

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

        // create a failure at the given position
        public createFailure(start: number, width: number, failure: string): Lint.RuleFailure {
            var from = (start > this.limit) ? this.limit : start;
            var to = ((start + width) > this.limit) ? this.limit : (start + width);

            return new Lint.RuleFailure(this.syntaxTree, from, to, failure);
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
