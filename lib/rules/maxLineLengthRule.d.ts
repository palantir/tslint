import * as Lint from "../lint";
import * as ts from "typescript";
export declare class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING: string;
    isEnabled(): boolean;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
