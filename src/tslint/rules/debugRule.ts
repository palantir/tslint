/// <reference path='rule.ts'/>
/// <reference path='baseRule.ts'/>

module Lint.Rules {

  export class DebugRule extends BaseRule {

    constructor() {
      super("debug");
    }

  /**
   * @param test
   */
    public isEnabled() : boolean {
      return this.getValue() === true;
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      var sourceUnit = syntaxTree.sourceUnit();
      var debugWalker = new DebugWalker(syntaxTree.fileName());

      sourceUnit.accept(debugWalker);

      return debugWalker.getFailures();
    }
  }

  class DebugWalker extends Lint.RuleWalker {
    static DEBUG_FAILURE = "use of debugger statements is disallowed";

    public visitToken(token : TypeScript.ISyntaxToken): void {
      this.handleToken(token);
      super.visitToken(token);
    }

    private handleToken(operatorToken: TypeScript.ISyntaxToken) {
      var failure = null;
      var operatorKind = operatorToken.kind();

      if (operatorKind === TypeScript.SyntaxKind.DebuggerKeyword) {
        failure = new Lint.RuleFailure(this.getFileName(), this.position(), DebugWalker.DEBUG_FAILURE);
      }

      if(failure) {
        this.addFailure(failure);
      }
    }
  }

}
