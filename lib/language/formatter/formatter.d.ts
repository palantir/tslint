import * as Lint from "../../lint";
export interface IFormatter {
    format(failures: Lint.RuleFailure[]): string;
}
