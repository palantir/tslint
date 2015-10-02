import * as Lint from "../../lint";
import { RuleWalker } from "./ruleWalker";
import * as ts from "typescript";
export declare class SkippableTokenAwareRuleWalker extends RuleWalker {
    protected tokensToSkipStartEndMap: {
        [start: number]: number;
    };
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions);
    protected visitRegularExpressionLiteral(node: ts.Node): void;
    protected visitIdentifier(node: ts.Identifier): void;
    protected visitTemplateExpression(node: ts.TemplateExpression): void;
    protected addTokenToSkipFromNode(node: ts.Node): void;
}
