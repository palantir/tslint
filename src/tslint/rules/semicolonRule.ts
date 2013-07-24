/// <reference path='rule.ts'/>
/// <reference path='baseRule.ts'/>

module Lint.Rules {
  export class SemicolonRule extends BaseRule {
    static FAILURE_STRING = "missing semicolon";

    constructor() {
      super("semicolon");
    }

    public isEnabled() : boolean {
      return this.getValue() === true;
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
          var ruleFailure = new Lint.RuleFailure(fileName, position, SemicolonRule.FAILURE_STRING);

          ruleFailures.push(ruleFailure);
        }
      }

      return ruleFailures;
    }
  }

}
