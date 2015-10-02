import * as Lint from "../lint";
import * as ts from "typescript";
export declare class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING: string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
export declare class SwitchDefaultWalker extends Lint.RuleWalker {
    visitSwitchStatement(node: ts.SwitchStatement): void;
}
