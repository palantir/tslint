import * as Lint from "../lint";
import * as ts from "typescript";
import BanRule = require("./banRule");
export declare class Rule extends BanRule.Rule {
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
