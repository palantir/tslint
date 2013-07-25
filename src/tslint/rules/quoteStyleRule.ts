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

      return this.applyWithWalker(syntaxTree, new QuoteWalker(syntaxTree.fileName(), quoteStyle));
    }
  }

  class QuoteWalker extends Lint.RuleWalker {
    static DOUBLE_QUOTE_FAILURE = "' should be \"";
    static SINGLE_QUOTE_FAILURE = "\" should be '";

	private quoteStyle : QuoteStyle;

    constructor (fileName: string, quoteStyle: QuoteStyle) {
      super(fileName);
      this.quoteStyle = quoteStyle;
    }

    public visitToken(token : TypeScript.ISyntaxToken): void {
      this.handleToken(token);
      super.visitToken(token);
    }

    private handleToken(operatorToken: TypeScript.ISyntaxToken) {
      var failure = null;
      var operatorKind = operatorToken.kind();

      if (operatorKind === TypeScript.SyntaxKind.StringLiteral) {
        var fullText = operatorToken.fullText();
        var textStart = operatorToken.leadingTriviaWidth();
        var textEnd = textStart + operatorToken.width() - 1;
        var firstChar = fullText.charAt(textStart);
        var lastChar = fullText.charAt(textEnd);

        if (this.quoteStyle === QuoteStyle.SINGLE_QUOTES) {
          if (firstChar !== "'" || lastChar !== "'") {
  	        failure = this.createFailure(QuoteWalker.SINGLE_QUOTE_FAILURE);
          }
        } else if (this.quoteStyle === QuoteStyle.DOUBLE_QUOTES) {
          if (firstChar !== "\"" || lastChar !== "\"") {
            failure = this.createFailure(QuoteWalker.DOUBLE_QUOTE_FAILURE);
          }
        }
      }

      if(failure) {
        this.addFailure(failure);
      }
    }
  }

}
