import * as Lint from "../../lint";
import { SyntaxWalker } from "./syntaxWalker";
import * as ts from "typescript";
export declare class RuleWalker extends SyntaxWalker {
    private limit;
    private position;
    private options;
    private failures;
    private sourceFile;
    private disabledIntervals;
    private ruleName;
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions);
    getSourceFile(): ts.SourceFile;
    getFailures(): Lint.RuleFailure[];
    getLimit(): number;
    getOptions(): any;
    hasOption(option: string): boolean;
    skip(node: ts.Node): void;
    createFailure(start: number, width: number, failure: string): Lint.RuleFailure;
    addFailure(failure: Lint.RuleFailure): void;
    private existsFailure(failure);
}
