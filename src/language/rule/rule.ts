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

import {IWalker} from "../walker";

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
     * A rule deprecation message, if applicable.
     */
    deprecationMessage?: string;

    /**
     * A short, one line description of what the rule does.
     */
    description: string;

    /**
     * More elaborate details about the rule.
     */
    descriptionDetails?: string;

    /**
     * Whether or not the rule will provide fix suggestions.
     */
    hasFix?: boolean;

    /**
     * An explanation of the available options for the rule.
     */
    optionsDescription: string;

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

    /**
     * Whether or not the rule use for TypeScript only. If `false`, this rule may be used with .js files.
     */
    typescriptOnly: boolean;
}

export type RuleType = "functionality" | "maintainability" | "style" | "typescript";

export interface IOptions {
    ruleArguments: any[];
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
    apply(sourceFile: ts.SourceFile, languageService: ts.LanguageService): RuleFailure[];
    applyWithWalker(walker: IWalker): RuleFailure[];
}

export class Replacement {
    public static applyAll(content: string, replacements: Replacement[]) {
        // sort in reverse so that diffs are properly applied
        replacements.sort((a, b) => b.end - a.end);
        return replacements.reduce((text, r) => r.apply(text), content);
    }

    public static replaceFromTo(start: number, end: number, text: string) {
        return new Replacement(start, end - start, text);
    }

    public static deleteText(start: number, length: number) {
        return new Replacement(start, length, "");
    }

    public static deleteFromTo(start: number, end: number) {
        return new Replacement(start, end - start, "");
    }

    public static appendText(start: number, text: string) {
        return new Replacement(start, 0, text);
    }

    constructor(private innerStart: number, private innerLength: number, private innerText: string) {
    }

    get start() {
        return this.innerStart;
    }

    get length() {
        return this.innerLength;
    }

    get end() {
        return this.innerStart + this.innerLength;
    }

    get text() {
        return this.innerText;
    }

    public apply(content: string) {
        return content.substring(0, this.start) + this.text + content.substring(this.start + this.length);
    }
}

export class Fix {
    public static applyAll(content: string, fixes: Fix[]) {
        // accumulate replacements
        let replacements: Replacement[] = [];
        for (const fix of fixes) {
            replacements = replacements.concat(fix.replacements);
        }
        return Replacement.applyAll(content, replacements);
    }

    constructor(private innerRuleName: string, private innerReplacements: Replacement[]) {
    }

    get ruleName() {
        return this.innerRuleName;
    }

    get replacements() {
        return this.innerReplacements;
    }

    public apply(content: string) {
        return Replacement.applyAll(content, this.innerReplacements);
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
    private rawLines: string;

    constructor(private sourceFile: ts.SourceFile,
                start: number,
                end: number,
                private failure: string,
                private ruleName: string,
                private fix?: Fix) {

        this.fileName = sourceFile.fileName;
        this.startPosition = this.createFailurePosition(start);
        this.endPosition = this.createFailurePosition(end);
        this.rawLines = sourceFile.text;
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

    public hasFix() {
        return this.fix !== undefined;
    }

    public getFix() {
        return this.fix;
    }

    public getRawLines() {
        return this.rawLines;
    }

    public toJson(): any {
        return {
            endPosition: this.endPosition.toJson(),
            failure: this.failure,
            fix: this.fix,
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
