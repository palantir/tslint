import * as Lint from "./lint";
export interface IEnableDisablePosition {
    isEnabled: boolean;
    position: number;
}
export declare function loadRules(ruleConfiguration: {
    [name: string]: any;
}, enableDisableRuleMap: {
    [rulename: string]: Lint.IEnableDisablePosition[];
}, rulesDirectory?: string): Lint.IRule[];
export declare function findRule(name: string, rulesDirectory?: string): any;
