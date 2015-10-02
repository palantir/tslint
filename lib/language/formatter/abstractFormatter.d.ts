import * as Lint from "../../lint";
export declare abstract class AbstractFormatter implements Lint.IFormatter {
    abstract format(failures: Lint.RuleFailure[]): string;
}
