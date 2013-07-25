/// <reference path='rule.ts'/>
/// <reference path='baseRule.ts'/>

module Lint.Rules {

  export class TrailingWhitespaceRule extends BaseRule {
    constructor() {
      super("no_trailing_whitespace");
    }

    public isEnabled() : boolean {
      return this.getValue() === true;
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      return this.applyWithWalker(new TrailingWalker(syntaxTree));
    }
  }

  class TrailingWalker extends Lint.RuleWalker {
    static FAILURE_STRING = "trailing whitespace";

    public visitToken(token: TypeScript.ISyntaxToken): void {
      super.visitToken(token);
      this.checkForTrailingWhitespace(token.trailingTrivia());
    }

    public visitNode(node: TypeScript.SyntaxNode): void {
      super.visitNode(node);
      this.checkForTrailingWhitespace(node.trailingTrivia());
    }

    private checkForTrailingWhitespace(triviaList: TypeScript.ISyntaxTriviaList) {
      if(triviaList.count() < 2) {
        return;
      }

      var lastButOne = triviaList.count() - 2;
      var triviaKind = triviaList.syntaxTriviaAt(lastButOne).kind();
      if(triviaList.hasNewLine() && triviaKind === TypeScript.SyntaxKind.WhitespaceTrivia) {
        this.createAndAddFailure();
      }
    }

    // create a failure at the end of the previous line and add it
    private createAndAddFailure() {
      var failure = this.createFailure(this.position() - 1, TrailingWalker.FAILURE_STRING);
      this.addFailure(failure);
    }
  }

}
