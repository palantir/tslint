import * as formatters from "./formatters";
import * as configuration from "./configuration";
import * as rules from "./rules";
import * as Linter from "./tslint";

export * from "./language/rule/rule";
export * from "./enableDisableRules";
export * from "./formatterLoader";
export * from "./ruleLoader";
export * from "./language/utils";
export * from "./language/languageServiceHost";
export * from "./language/walker";
export * from "./language/formatter/formatter";

export var Formatters = formatters;
export var Configuration = configuration;
export var Rules = rules;

type LintResult = Linter.LintResult;
type ILinterOptions = Linter.ILinterOptions;

export {Linter, LintResult, ILinterOptions};
