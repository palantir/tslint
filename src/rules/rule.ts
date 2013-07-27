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

/// <reference path='../typescript/src/compiler/syntax/syntaxTree.ts'/>
/// <reference path='../typescript/src/compiler/text/linePosition.ts'/>

module Lint {

    // TODO: Make this immutable somehow
    export interface Rule {
        getName(): string;

        getValue(): any;

        setValue(value: any): void;

        apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[];
    }

    export class RuleFailure {
        private fileName: string;
        private lineAndCharacter: TypeScript.LineAndCharacter;
        private failure: string;

        constructor(fileName: string, lineAndCharacter: TypeScript.LineAndCharacter, failure: string) {
            this.fileName = fileName;
            this.lineAndCharacter = lineAndCharacter;
            this.failure = failure;
        }

        public getFileName() {
            return this.fileName;
        }

        public getLineAndCharacter(): TypeScript.LineAndCharacter {
            return this.lineAndCharacter;
        }

        public getFailure() {
            return this.failure;
        }

        public toJson(): any {
            return {
                name: this.fileName,
                position: {
                    line: this.lineAndCharacter.line(),
                    character: this.lineAndCharacter.character()
                  },
                failure: this.failure
            };
        }

        public equals(ruleFailure: RuleFailure): boolean {
            return (this.failure  === ruleFailure.getFailure() &&
                    this.fileName === ruleFailure.getFileName() &&
                    this.lineAndCharacter.line() === ruleFailure.getLineAndCharacter().line() &&
                    this.lineAndCharacter.character() === ruleFailure.getLineAndCharacter().character());
        }
    }

}
