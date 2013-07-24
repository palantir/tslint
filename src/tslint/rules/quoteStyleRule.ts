/// <reference path='rule.ts'/>
/// <reference path='baseRule.ts'/>
module Lint.Rules {

  enum QuoteStyle {
    SINGLE_QUOTES,
    DOUBLE_QUOTES
  };

  export class QuoteStyleRule extends BaseRule {
    constructor() {
      super("quote_style");
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      var sourceUnit = syntaxTree.sourceUnit();
      var quoteStyleString : string = this.getValue();
      var quoteStyle : QuoteStyle;
      if (quoteStyleString === "single") {
       quoteStyle = QuoteStyle.SINGLE_QUOTES;
      } else if (quoteStyleString === "double") {
        quoteStyle = QuoteStyle.DOUBLE_QUOTES;
      } else {
		throw new Error("Unknown quote style " + quoteStyle);
      }
      var quoteWalker = new QuoteWalker(syntaxTree.fileName(), quoteStyle);

      sourceUnit.accept(quoteWalker);

      return quoteWalker.getFailures();
    }
  }

  class QuoteWalker extends Lint.RuleWalker {
    static DOUBLE_QUOTE_FAILURE = "' should be \"";
    static SINGLE_QUOTE_FAILURE = "\" should be '";

	private quoteStyle : QuoteStyle;

    constructor (fileName: string, quoteStyle: QuoteStyle) {
      this.quoteStyle = quoteStyle;
	  return super(fileName);
    }

    public visitToken(token : TypeScript.ISyntaxToken): void {
      super.visitToken(token);
      this.handleToken(token);
    }

    private handleToken(operatorToken: TypeScript.ISyntaxToken) {
      var failure = null;

      var operatorKind = operatorToken.kind();

      if (operatorKind === TypeScript.SyntaxKind.StringLiteral) {
        var fullText = operatorToken.fullText();
        var fullTextLength = fullText.length;
        if (fullTextLength < 1) {
          return;
        }
        if (this.quoteStyle === QuoteStyle.SINGLE_QUOTES) {
          if (fullText.charAt(0) !== "'" || fullText.charAt(fullTextLength - 1) !== "'") {
	        failure = new Lint.RuleFailure(this.getFileName(), this.position(), QuoteWalker.SINGLE_QUOTE_FAILURE);
          }
        } else if (this.quoteStyle === QuoteStyle.DOUBLE_QUOTES) {
          if (fullText.charAt(0) !== "\"" || fullText.charAt(fullTextLength - 1) !== "\"") {
            failure = new Lint.RuleFailure(this.getFileName(), this.position(), QuoteWalker.DOUBLE_QUOTE_FAILURE);
          }
        }
      }

      if(failure) {
        this.addFailure(failure);
      }
    }
  }

}
