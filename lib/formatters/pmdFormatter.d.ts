import * as Lint from "../lint";
export declare class Formatter extends Lint.Formatters.AbstractFormatter {
    format(failures: Lint.RuleFailure[]): string;
}
