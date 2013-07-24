/// <reference path='rule.ts'/>
/// <reference path='../language/lastTokenAwareRuleWalker.ts'/>

module Lint.Rules {

  export class SameLineRule extends BaseRule {
    constructor() {
      super("same_line_brace");
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
    static BRACE_FAILURE_STRING = "misplaced opening brace";
    static CATCH_FAILURE_STRING = "misplaced 'catch'";
    static ELSE_FAILURE_STRING = "misplaced 'else'";
    static WHITESPACE_FAILURE_STRING = "missing whitespace";

    private lineMap: TypeScript.LineMap;

    constructor(lineMap: TypeScript.LineMap, fileName: string) {
      super(fileName);
      this.lineMap = lineMap;
    }

    public visitToken(token: TypeScript.ISyntaxToken): void {
      var kind = token.kind();
      var lastState = this.getLastState();

      if (kind === TypeScript.SyntaxKind.OpenBraceToken && lastState !== undefined) {
        var lastKind = lastState.token.kind();
        if (lastKind === TypeScript.SyntaxKind.CloseParenToken ||
            lastKind === TypeScript.SyntaxKind.DoKeyword ||
            lastKind === TypeScript.SyntaxKind.IdentifierName ||
            lastKind === TypeScript.SyntaxKind.StringLiteral ||
            lastKind === TypeScript.SyntaxKind.TryKeyword) {

          var lastLine = this.getLine(lastState.position);
          var currentLine = this.getLine(this.position());

          if (currentLine !== lastLine) {
            this.addFailure(this.createFailure(BraceWalker.BRACE_FAILURE_STRING));
          } else if (!this.hasTrailingWhiteSpace(lastState.token)) {
            this.addFailure(this.createFailure(BraceWalker.WHITESPACE_FAILURE_STRING));
          }
        }
      }

      super.visitToken(token);
    }

    public visitElseClause(node: TypeScript.ElseClauseSyntax): void {
      var lastState = this.getLastState();
      if(lastState !== undefined && !this.hasTrailingWhiteSpace(lastState.token)) {
        this.addFailure(this.createFailure(BraceWalker.ELSE_FAILURE_STRING));
      }

      super.visitElseClause(node);
    }

    public visitCatchClause(node: TypeScript.CatchClauseSyntax): void {
      var lastState = this.getLastState();
      if(lastState !== undefined && !this.hasTrailingWhiteSpace(lastState.token)) {
        this.addFailure(this.createFailure(BraceWalker.CATCH_FAILURE_STRING));
      }

      super.visitCatchClause(node);
    }

    private getLine(position): number {
      return this.lineMap.getLineAndCharacterFromPosition(position).line();
    }

    private hasTrailingWhiteSpace(token: TypeScript.ISyntaxToken): boolean {
      var trivia = token.trailingTrivia();
      if(trivia.count() < 1) {
        return false;
      }

      var kind = trivia.syntaxTriviaAt(0).kind();
      return (kind === TypeScript.SyntaxKind.WhitespaceTrivia);
    }
  }

}
