import * as Lint from "../lint";
import * as ts from "typescript";
export declare class Rule extends Lint.Rules.AbstractRule {
    static LOWERCASE_FAILURE: string;
    static UPPERCASE_FAILURE: string;
    static LEADING_SPACE_FAILURE: string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
