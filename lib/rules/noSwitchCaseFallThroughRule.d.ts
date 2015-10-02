import * as Lint from "../lint";
import * as ts from "typescript";
export declare class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING_PART: string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
export declare class NoSwitchCaseFallThroughWalker extends Lint.RuleWalker {
    visitSwitchStatement(node: ts.SwitchStatement): void;
    private fallThroughAllowed(nextCaseOrDefaultStatement);
    private fallsThrough(statements);
}
