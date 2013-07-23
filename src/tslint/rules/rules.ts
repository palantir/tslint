/// <reference path='rule.ts'/>
/// <reference path='semicolonSyntaxRule.ts'/>
/// <reference path='tripleComparisonSyntaxRule.ts'/>

module Lint.Rules {

  var ALL_RULES: Rule[] = [];

  export function createAllRules() {
    ALL_RULES.push(new SemicolonSyntaxRule());
    ALL_RULES.push(new TripleComparisonSyntaxRule());
  }

  export function getRuleForName(name: string): Rule {
    var filteredRules = ALL_RULES.filter(function(rule) {
      return rule.getName() === name;
    });

    if(filteredRules.length > 0) {
      return filteredRules[0];
    } else {
      return undefined;
    }
  }

}
