import * as configuration from "./configuration";
import * as formatters from "./formatters";
import * as linter from "./tslint";
import * as rules from "./rules";


export * from "./language/rule/rule";
export * from "./enableDisableRules";
export * from "./formatterLoader";
export * from "./ruleLoader";
export * from "./language/utils";
export * from "./language/languageServiceHost";
export * from "./language/walker";
export * from "./language/formatter/formatter";

export var Configuration = configuration;
export var Formatters = formatters;
export var Linter = linter;
export var Rules = rules;

import {RuleFailure} from "./language/rule/rule";

export interface LintResult {
    failureCount: number;
    failures: RuleFailure[];
    format: string;
    output: string;
}

export interface ILinterOptions {
    configuration: any;
    formatter: string;
    formattersDirectory: string;
    rulesDirectory: string;
}
