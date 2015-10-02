import * as Lint from "../../lint";
import { RuleWalker } from "../walker/ruleWalker";
import * as ts from "typescript";
export declare abstract class AbstractRule implements Lint.IRule {
    private value;
    private options;
    constructor(ruleName: string, value: any, disabledIntervals: Lint.IDisabledInterval[]);
    getOptions(): Lint.IOptions;
    abstract apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
    applyWithWalker(walker: RuleWalker): Lint.RuleFailure[];
    isEnabled(): boolean;
}
