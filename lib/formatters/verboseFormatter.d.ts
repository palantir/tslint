import * as Lint from "../lint";
import { AbstractFormatter } from "../language/formatter/abstractFormatter";
export declare class Formatter extends AbstractFormatter {
    format(failures: Lint.RuleFailure[]): string;
}
