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

import * as ts from "typescript";
import * as Lint from "../../lint";

export interface IOptions {
    ruleArguments?: any[];
    ruleName: string;
    disabledIntervals: Lint.IDisabledInterval[];
}

export interface IDisabledInterval {
    startPosition: number;
    endPosition: number;
}

export interface IRule {
    getOptions(): IOptions;
    isEnabled(): boolean;
    apply(sourceFile: ts.SourceFile): RuleFailure[];
    applyWithWalker(walker: Lint.RuleWalker): RuleFailure[];
}

export class RuleFailurePosition {
    private position: number;
    private lineAndCharacter: ts.LineAndCharacter;

    constructor(position: number, lineAndCharacter: ts.LineAndCharacter) {
        this.position = position;
        this.lineAndCharacter = lineAndCharacter;
    }

    public getPosition() {
        return this.position;
    }

    public getLineAndCharacter() {
        return this.lineAndCharacter;
    }

    public toJson() {
        return {
            character: this.lineAndCharacter.character,
            line: this.lineAndCharacter.line,
            position: this.position
        };
    }

    public equals(ruleFailurePosition: RuleFailurePosition) {
        const ll = this.lineAndCharacter;
        const rr = ruleFailurePosition.lineAndCharacter;

        return this.position === ruleFailurePosition.position
            && ll.line === rr.line
            && ll.character === rr.character;
    }
}

export class RuleFailure {
    private sourceFile: ts.SourceFile;
    private fileName: string;
    private startPosition: Lint.RuleFailurePosition;
    private endPosition: Lint.RuleFailurePosition;
    private failure: string;
    private ruleName: string;

    constructor(sourceFile: ts.SourceFile,
                start: number,
                end: number,
                failure: string,
                ruleName: string) {

        this.sourceFile = sourceFile;
        this.fileName = sourceFile.fileName;
        this.startPosition = this.createFailurePosition(start);
        this.endPosition = this.createFailurePosition(end);
        this.failure = failure;
        this.ruleName = ruleName;
    }

    public getFileName() {
        return this.fileName;
    }

    public getRuleName() {
        return this.ruleName;
    }

    public getStartPosition(): RuleFailurePosition {
        return this.startPosition;
    }

    public getEndPosition(): RuleFailurePosition {
        return this.endPosition;
    }

    public getFailure() {
        return this.failure;
    }

    public toJson(): any {
        return {
            endPosition: this.endPosition.toJson(),
            failure: this.failure,
            name: this.fileName,
            ruleName: this.ruleName,
            startPosition: this.startPosition.toJson()
        };
    }

    public equals(ruleFailure: RuleFailure) {
        return this.failure  === ruleFailure.getFailure()
            && this.fileName === ruleFailure.getFileName()
            && this.startPosition.equals(ruleFailure.getStartPosition())
            && this.endPosition.equals(ruleFailure.getEndPosition());
    }

    private createFailurePosition(position: number) {
        const lineAndCharacter = this.sourceFile.getLineAndCharacterOfPosition(position);
        return new RuleFailurePosition(position, lineAndCharacter);
    }
}
