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

    export class SemicolonRule extends AbstractRule {
        static FAILURE_STRING = "missing semicolon";

        constructor() {
            super("semicolon");
        }

        public isEnabled() : boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            var ruleFailures = [];
            var diagnostics = syntaxTree.diagnostics();

            for (var i = 0; i < diagnostics.length; ++i) {
                var diagnostic = diagnostics[i];
                var code = diagnostic.diagnosticCode();

                if (code === TypeScript.DiagnosticCode.Automatic_semicolon_insertion_not_allowed) {
                    var position = diagnostic.start();
                    var lineAndCharacter = syntaxTree.lineMap().getLineAndCharacterFromPosition(position);
                    var ruleFailure = new Lint.RuleFailure(syntaxTree, position, position + 1, SemicolonRule.FAILURE_STRING);

                    ruleFailures.push(ruleFailure);
                }
            }

            return ruleFailures;
        }
    }

}
