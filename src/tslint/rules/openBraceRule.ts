/// <reference path='rule.ts'/>
/// <reference path='../language/lastTokenAwareRuleWalker.ts'/>

module Lint.Rules {

  export class OpenBraceRule extends BaseRule {
    constructor() {
      super("opening_brace_on_same_line");
    }

    public isEnabled(): boolean {
      return this.getValue() === true;
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      var sourceUnit = syntaxTree.sourceUnit();
      var braceWalker = new BraceWalker(syntaxTree.lineMap(), syntaxTree.fileName());

      sourceUnit.accept(braceWalker);

      return braceWalker.getFailures();
    }
  }

  class BraceWalker extends Lint.LastTokenAwareRuleWalker {
    static FAILURE_STRING = "misplaced opening brace";

    private lineMap: TypeScript.LineMap;

    constructor(lineMap: TypeScript.LineMap, fileName: string) {
      super(fileName);
      this.lineMap = lineMap;
    }

    public visitToken(token: TypeScript.ISyntaxToken): void {
      var kind = token.kind();
      var lastState = this.getLastState();

      if (kind === TypeScript.SyntaxKind.OpenBraceToken && lastState !== null) {
        var lastKind = lastState.token.kind();
        if (lastKind !== TypeScript.SyntaxKind.SemicolonToken) {
          var lastLine = this.getLine(lastState.position);
          var currentLine = this.getLine(this.position());

          if(currentLine !== lastLine) {
            this.addFailure(this.createFailure(BraceWalker.FAILURE_STRING));
          }
        }
      }

      super.visitToken(token);
    }

    private getLine(position): number {
      return this.lineMap.getLineAndCharacterFromPosition(position).line();
    }
  }

}
