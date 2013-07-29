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

/// <reference path='../typescript/src/compiler/core/errors.ts'/>
/// <reference path='../typescript/src/compiler/syntax/positionTrackingWalker.ts'/>
/// <reference path='../typescript/src/compiler/syntax/syntaxKind.ts'/>
/// <reference path='../rules/rule.ts'/>

module Lint {

    export class RuleWalker extends TypeScript.PositionTrackingWalker {
        private fileName: string;
        private failures: RuleFailure[];
        private syntaxTree: TypeScript.SyntaxTree;

        constructor(syntaxTree: TypeScript.SyntaxTree) {
            super();

            this.syntaxTree = syntaxTree;
            this.failures = [];
        }

        public getSyntaxTree(): TypeScript.SyntaxTree {
            return this.syntaxTree;
        }

        public getFailures(): RuleFailure[] {
            return this.failures;
        }

        public positionAfter(...elements: TypeScript.ISyntaxElement[]): number {
            var position = this.position();

            for (var i = 0; i < elements.length; ++i) {
                var element = elements[i];
                if (element !== null) {
                    position += element.fullWidth();
                }
              }

            return position;
        }

        // create a failure at the given position
        public createFailure(start: number, width: number, failure: string): Lint.RuleFailure {
            var failurePosition = new Lint.RuleFailurePosition(start, start + width);
            return new Lint.RuleFailure(this.syntaxTree.fileName(), failurePosition, failure);
        }

        public addFailure(failure: RuleFailure) {
            if (!this.existsFailure(failure)) {
                this.failures.push(failure);
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
