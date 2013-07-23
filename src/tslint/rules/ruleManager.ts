/// <reference path='../../typescript/compiler/syntax/syntaxTree.ts'/>

/// <reference path='rule.ts'/>
/// <reference path='rules.ts'/>

module Lint {

  export class RuleManager {
    private bufferBasedRules: Rule[];
    private lineBasedRules: Rule[];

    constructor(rules: Rule[]) {
      this.bufferBasedRules = [];
      this.lineBasedRules = [];

      for(var i = 0; i < rules.length; ++i) {
        var rule = rules[i];
        if(rule.getType() === RuleType.BufferBased) {
          this.bufferBasedRules.push(rule);
        } else {
          this.lineBasedRules.push(rule);
        }
      }
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
      var ruleFailures = [];

      for(var i = 0; i < this.bufferBasedRules.length; ++i) {
        var rule = this.bufferBasedRules[i];
        ruleFailures = ruleFailures.concat(rule.apply(syntaxTree));
      }

      return ruleFailures;
    }
  }

}
