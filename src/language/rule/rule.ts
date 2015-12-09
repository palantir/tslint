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
    */
    options: IRuleOption;

   /**
    * Examples of what a standard config for the rule might look like.
    */
    optionExamples?: string[];

   /**
    * An explanation of why the rule is useful.
    */
    rationale?: string;
}

export type RuleType = "functionality" | "maintainability" | "style" | "typescript";

export type RuleOptionType = "array" | "enum" | "list" | "number" | "object" | "string";

export interface IBaseRuleOption { type?: RuleOptionType; }

export interface IArrayRuleOption extends IBaseRuleOption { arrayMembers: IRuleOption[]; }
export interface IEmptyRuleOption extends IBaseRuleOption { }
export interface IEnumRuleOption extends IBaseRuleOption { enumValues: string[]; }
export interface IListRuleOption extends IBaseRuleOption { listType: IRuleOption; }
export interface INumberRuleOption extends IBaseRuleOption { }
export interface IObjectRuleOption extends IBaseRuleOption { properties: { [key: string]: IRuleOption }; }
export interface IStringRuleOption extends IBaseRuleOption { }

export type IRuleOption = IArrayRuleOption | IEmptyRuleOption | IEnumRuleOption | IListRuleOption
                        | INumberRuleOption | IObjectRuleOption | IStringRuleOption;


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
    private sourceFile: ts.SourceFile;
    private fileName: string;
    private startPosition: RuleFailurePosition;
    private endPosition: RuleFailurePosition;
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
