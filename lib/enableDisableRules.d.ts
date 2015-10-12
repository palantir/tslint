import * as Lint from "./lint";
import { SkippableTokenAwareRuleWalker } from "./language/walker/skippableTokenAwareRuleWalker";
import * as ts from "typescript";
export declare class EnableDisableRulesWalker extends SkippableTokenAwareRuleWalker {
    enableDisableRuleMap: {
        [rulename: string]: Lint.IEnableDisablePosition[];
    };
    visitSourceFile(node: ts.SourceFile): void;
    private handlePossibleTslintSwitch(commentText, startingPosition);
}
