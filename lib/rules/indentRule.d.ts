import * as Lint from "../lint";
import * as ts from "typescript";
export declare class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING_TABS: string;
    static FAILURE_STRING_SPACES: string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
