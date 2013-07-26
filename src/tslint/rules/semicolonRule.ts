/// <reference path='rule.ts'/>
/// <reference path='abstractRule.ts'/>

module Lint.Rules {
  export class SemicolonRule extends AbstractRule {
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
          var lineAndCharacter = syntaxTree.lineMap().getLineAndCharacterFromPosition(position);
          var ruleFailure = new Lint.RuleFailure(fileName, lineAndCharacter, SemicolonRule.FAILURE_STRING);

          ruleFailures.push(ruleFailure);
        }
      }

      return ruleFailures;
    }
  }

}
