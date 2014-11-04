/// <reference path='../../lib/tslint.d.ts' />

var OPTION_USE_TABS = "tabs",
    OPTION_USE_SPACES = "spaces";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING_TABS = "Indent using only tabs";
    public static FAILURE_STRING_SPACES = "Indent using only spaces";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new IndentWalker(syntaxTree, this.getOptions()));
    }
}

// Will visit every token and enforce only that the right char is used to indent 
// (tab/space), will *NOT* check indentation size
class IndentWalker extends Lint.RuleWalker {
    private failureString: string;
    private reg: RegExp;

    constructor(syntaxTree: TypeScript.SyntaxTree, options: Lint.IOptions) {
        super(syntaxTree, options);

        if (this.hasOption(OPTION_USE_TABS)) {
            this.reg = new RegExp(" ");
            this.failureString = Rule.FAILURE_STRING_TABS;
        } else if (this.hasOption(OPTION_USE_SPACES)) {
            this.reg = new RegExp("\t");
            this.failureString = Rule.FAILURE_STRING_SPACES;
        }
    }

    public visitToken(token: TypeScript.ISyntaxToken) {
        if (this.hasOption(OPTION_USE_TABS) || this.hasOption(OPTION_USE_SPACES)) {
            var position = this.getPosition() + token.leadingTriviaWidth();
            if (!token.hasLeadingComment() && token.leadingTrivia().fullText().match(this.reg)) {
                this.addFailure(this.createFailure(position, token.fullWidth(), this.failureString));
            }
        }
        super.visitToken(token);
    }

}
