import * as Lint from "./lint";
declare class Linter {
    static VERSION: string;
    private fileName;
    private source;
    private options;
    constructor(fileName: string, source: string, options: Linter.ILinterOptions);
    lint(): Linter.LintResult;
    private getRelativePath(directory);
    private containsRule(rules, rule);
}
import { findConfiguration as config } from "./configuration";
declare namespace Linter {
    var findConfiguration: typeof config;
    interface LintResult {
        failureCount: number;
        failures: Lint.RuleFailure[];
        format: string;
        output: string;
    }
    interface ILinterOptions {
        configuration: any;
        formatter: string;
        formattersDirectory: string;
        rulesDirectory: string;
    }
}
export = Linter;
