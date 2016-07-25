/**
 * @license
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

import {RuleWalker} from "../walker/ruleWalker";

export interface IRuleMetadata {
    /**
     * The kebab-case name of the rule.
     */
    ruleName: string;

    /**
     * The type of the rule - its overall purpose
     */
    type: RuleType;

    /**
     * A short, one line description of what the rule does.
     */
    description: string;

    /**
     * More elaborate details about the rule.
     */
    descriptionDetails?: string;

    /**
     * An explanation of the available options for the rule.
     */
    optionsDescription?: string;

    /**
     * Schema of the options the rule accepts.
     * The first boolean for whether the rule is enabled or not is already implied.
     * This field describes the options after that boolean.
     * If null, this rule has no options and is not configurable.
     */
    options: any;

    /**
     * Examples of what a standard config for the rule might look like.
     */
    optionExamples?: string[];

    /**
     * An explanation of why the rule is useful.
     */
    rationale?: string;

    /**
     * Whether or not the rule requires type info to run.
     */
    requiresTypeInfo?: boolean;
}

export type RuleType = "functionality" | "maintainability" | "style" | "typescript";

export interface IOptions {
    ruleArguments?: any[];
    ruleName: string;
    disabledIntervals: IDisabledInterval[];
}

export interface IDisabledInterval {
    startPosition: number;
    endPosition: number;
}

export interface IRule {
    getOptions(): IOptions;
    isEnabled(): boolean;
    apply(sourceFile: ts.SourceFile): RuleFailure[];
    applyWithWalker(walker: RuleWalker): RuleFailure[];
}

export class Replacement {
    constructor(private start: number, private length: number, private text: string) {
    }

    public getStart() {
        return this.start;
    }

    public getLength() {
        return this.length;
    }

    public getEnd() {
        return this.start + this.length;
    }

    public getText() {
        return this.text;
    }

    public apply(content: string) {
        return content.substring(0, this.start) + this.text + content.substring(this.start + this.length);
    }
}

export class Fix {
    constructor(private ruleName: string, private description: string, private replacements: Replacement[]) {
    }

    public getRuleName() {
        return this.ruleName;
    }

    public getDescription() {
        return this.description;
    }

    public getReplacements() {
        return this.replacements;
    }

    public apply(content: string) {
        // sort replacements in reverse so that diffs are properly applied
        this.replacements.sort((a, b) => b.getEnd() - a.getEnd());
        return this.replacements.reduce((text, r) => r.apply(text), content);
    }
}

export class RuleFailurePosition {
    constructor(private position: number, private lineAndCharacter: ts.LineAndCharacter) {
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
            position: this.position,
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
    private fileName: string;
    private startPosition: RuleFailurePosition;
    private endPosition: RuleFailurePosition;

    constructor(private sourceFile: ts.SourceFile,
                start: number,
                end: number,
                private failure: string,
                private ruleName: string,
                private fixes: Fix[] = []) {

        this.fileName = sourceFile.fileName;
        this.startPosition = this.createFailurePosition(start);
        this.endPosition = this.createFailurePosition(end);
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

    public getFixes() {
        return this.fixes;
    }

    public toJson(): any {
        return {
            endPosition: this.endPosition.toJson(),
            failure: this.failure,
            fixes: this.fixes,
            name: this.fileName,
            ruleName: this.ruleName,
            startPosition: this.startPosition.toJson(),
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
