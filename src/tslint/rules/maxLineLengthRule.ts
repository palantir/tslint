/// <reference path='rule.ts'/>
/// <reference path='abstractRule.ts'/>

module Lint.Rules {

  export class MaxLineLengthRule extends AbstractRule {
    static FAILURE_STRING = "exceeds maximum line length of ";

    constructor() {
      super("max_line_length");
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      var ruleFailures = [];
      var lineLimit = this.getValue();
      var lineMap = syntaxTree.lineMap();
      var lineStarts = lineMap.lineStarts();
      var errorString = MaxLineLengthRule.FAILURE_STRING + lineLimit;

      for (var i = 0; i < lineStarts.length - 1; ++i) {
        var from = lineStarts[i], to = lineStarts[i + 1];
        if ((to - from - 1) > lineLimit) {
          var lineAndCharacter = lineMap.getLineAndCharacterFromPosition(to - 1);
          var ruleFailure = new Lint.RuleFailure(syntaxTree.fileName(), lineAndCharacter, errorString);
          ruleFailures.push(ruleFailure);
        }
      }

      return ruleFailures;
    }
  }

}
