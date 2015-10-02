import * as Lint from "../lint";
import * as ts from "typescript";
export declare class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING_PART: string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
export declare class BanFunctionWalker extends Lint.RuleWalker {
    private bannedFunctions;
    addBannedFunction(bannedFunction: string[]): void;
    visitCallExpression(node: ts.CallExpression): void;
}
