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

import { arrayify, flatMap } from "../../utils";
import { IWalker } from "../walker";

export interface RuleConstructor {
    metadata: IRuleMetadata;
    new(options: IOptions): IRule;
}

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
     * Using a string[] here is deprecated. Write the options as a JSON object instead.
     */
    optionExamples?: Array<true | any[]> | string[];

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

export type RuleSeverity = "warning" | "error" | "off";

export interface IOptions {
    ruleArguments: any[];
    ruleSeverity: RuleSeverity;
    ruleName: string;
    /**
     * @deprecated
     * Tslint now handles disables itself.
     * This will be empty.
     */
    disabledIntervals: IDisabledInterval[]; // tslint:disable-line deprecation
}

/**
 * @deprecated
 * These are now handled internally.
 */
export interface IDisabledInterval {
    startPosition: number;
    endPosition: number;
}

export interface IRule {
    getOptions(): IOptions;
    isEnabled(): boolean;
    apply(sourceFile: ts.SourceFile): RuleFailure[];
    applyWithWalker(walker: IWalker): RuleFailure[];
}

export interface ITypedRule extends IRule {
    applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): RuleFailure[];
}

export interface IRuleFailureJson {
    endPosition: IRuleFailurePositionJson;
    failure: string;
    fix?: FixJson;
    name: string;
    ruleSeverity: string;
    ruleName: string;
    startPosition: IRuleFailurePositionJson;
}

export interface IRuleFailurePositionJson {
    character: number;
    line: number;
    position: number;
}

export function isTypedRule(rule: IRule): rule is ITypedRule {
    return "applyWithProgram" in rule;
}

export interface ReplacementJson {
    innerStart: number;
    innerLength: number;
    innerText: string;
}
export class Replacement {
    public static applyFixes(content: string, fixes: Fix[]): string {
        return this.applyAll(content, flatMap(fixes, arrayify));
    }

    public static applyAll(content: string, replacements: Replacement[]) {
        // sort in reverse so that diffs are properly applied
        replacements.sort((a, b) => b.end !== a.end ? b.end - a.end : b.start - a.start);
        return replacements.reduce((text, r) => r.apply(text), content);
    }

    public static replaceNode(node: ts.Node, text: string, sourceFile?: ts.SourceFile): Replacement {
        return this.replaceFromTo(node.getStart(sourceFile), node.getEnd(), text);
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

    public constructor(readonly start: number, readonly length: number, readonly text: string) {
    }

    get end() {
        return this.start + this.length;
    }

    public apply(content: string) {
        return content.substring(0, this.start) + this.text + content.substring(this.start + this.length);
    }

    public toJson(): ReplacementJson {
        // tslint:disable object-literal-sort-keys
        return {
            innerStart: this.start,
            innerLength: this.length,
            innerText: this.text,
        };
        // tslint:enable object-literal-sort-keys
    }
}

export class RuleFailurePosition {
    public constructor(private readonly position: number, private readonly lineAndCharacter: ts.LineAndCharacter) {
    }

    public getPosition() {
        return this.position;
    }

    public getLineAndCharacter() {
        return this.lineAndCharacter;
    }

    public toJson(): IRuleFailurePositionJson {
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

export type Fix = Replacement | Replacement[];
export type FixJson = ReplacementJson | ReplacementJson[];

export class RuleFailure {
    private readonly fileName: string;
    private readonly startPosition: RuleFailurePosition;
    private readonly endPosition: RuleFailurePosition;
    private readonly rawLines: string;
    private ruleSeverity: RuleSeverity;

    public static compare(a: RuleFailure, b: RuleFailure): number {
        if (a.fileName !== b.fileName) {
            return a.fileName < b.fileName ? -1 : 1;
        }
        return a.startPosition.getPosition() - b.startPosition.getPosition();
    }

    public constructor(private readonly sourceFile: ts.SourceFile,
                       start: number,
                       end: number,
                       private readonly failure: string,
                       private readonly ruleName: string,
                       private readonly fix?: Fix) {

        this.fileName = sourceFile.fileName;
        this.startPosition = this.createFailurePosition(start);
        this.endPosition = this.createFailurePosition(end);
        this.rawLines = sourceFile.text;
        this.ruleSeverity = "error";
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

    public getRuleSeverity() {
        return this.ruleSeverity;
    }

    public setRuleSeverity(value: RuleSeverity) {
        this.ruleSeverity = value;
    }

    public toJson(): IRuleFailureJson {
        return {
            endPosition: this.endPosition.toJson(),
            failure: this.failure,
            fix: this.fix === undefined ? undefined : Array.isArray(this.fix) ? this.fix.map((r) => r.toJson()) : this.fix.toJson(),
            name: this.fileName,
            ruleName: this.ruleName,
            ruleSeverity: this.ruleSeverity.toUpperCase(),
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
