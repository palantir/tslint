import * as Lint from "./lint";
import * as ts from "typescript";
export declare class EnableDisableRulesWalker extends Lint.SkippableTokenAwareRuleWalker {
    enableDisableRuleMap: {
        [rulename: string]: Lint.IEnableDisablePosition[];
    };
    visitSourceFile(node: ts.SourceFile): void;
    private handlePossibleTslintSwitch(commentText, startingPosition);
}
