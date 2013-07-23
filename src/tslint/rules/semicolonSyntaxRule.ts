/// <reference path='rule.ts'/>
/// <reference path='baseRule.ts'/>

module Lint.Rules {

  var FAILURE_STRING = "missing semicolon";

  export class SemicolonSyntaxRule extends BaseRule {
    constructor() {
      super("semicolon", Lint.RuleType.BufferBased);
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      var ruleFailures = [];
      var diagnostics = syntaxTree.diagnostics();

      for (var i = 0; i < diagnostics.length; ++i) {
        var diagnostic = diagnostics[i];
        var code = diagnostic.diagnosticCode();

        if (code === TypeScript.DiagnosticCode.Automatic_semicolon_insertion_not_allowed) {
          var fileName = diagnostic.fileName();
          var position = diagnostic.start();
          var ruleFailure = new Lint.RuleFailure(fileName, position, FAILURE_STRING);

          ruleFailures.push(ruleFailure);
        }
      }

      return ruleFailures;
    }
  }

}
