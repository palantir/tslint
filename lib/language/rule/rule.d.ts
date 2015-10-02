import * as Lint from "../../lint";
import * as ts from "typescript";
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
export declare class RuleFailurePosition {
    private position;
    private lineAndCharacter;
    constructor(position: number, lineAndCharacter: ts.LineAndCharacter);
    getPosition(): number;
    getLineAndCharacter(): ts.LineAndCharacter;
    toJson(): {
        character: number;
        line: number;
        position: number;
    };
    equals(ruleFailurePosition: RuleFailurePosition): boolean;
}
export declare class RuleFailure {
    private sourceFile;
    private fileName;
    private startPosition;
    private endPosition;
    private failure;
    private ruleName;
    constructor(sourceFile: ts.SourceFile, start: number, end: number, failure: string, ruleName: string);
    getFileName(): string;
    getRuleName(): string;
    getStartPosition(): RuleFailurePosition;
    getEndPosition(): RuleFailurePosition;
    getFailure(): string;
    toJson(): any;
    equals(ruleFailure: RuleFailure): boolean;
    private createFailurePosition(position);
}
