/// <reference-path='../rules/rule.ts'/>

module Lint {

  export interface Formatter {
    getName(): string;

    format(failures: Lint.RuleFailure[]): string;
  }

}
