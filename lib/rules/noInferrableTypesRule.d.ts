import * as Lint from "../lint";
import * as ts from "typescript";
export declare class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING_FACTORY: (type: string) => string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
