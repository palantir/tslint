import * as Lint from "../lint";
import * as ts from "typescript";
export declare class Rule extends Lint.Rules.AbstractRule {
    static SINGLE_QUOTE_FAILURE: string;
    static DOUBLE_QUOTE_FAILURE: string;
    isEnabled(): boolean;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
