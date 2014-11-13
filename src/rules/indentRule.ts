/// <reference path='../../lib/tslint.d.ts' />

var OPTION_USE_TABS = "tabs";
var OPTION_USE_SPACES = "spaces";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING_TABS = "tab indentation expected";
    public static FAILURE_STRING_SPACES = "space indentation expected";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new IndentWalker(syntaxTree, this.getOptions()));
    }
}

// Visit every token and enforce that only the right character is used for indentation
class IndentWalker extends Lint.RuleWalker {
    private failureString: string;
    private regExp: RegExp;

    constructor(syntaxTree: TypeScript.SyntaxTree, options: Lint.IOptions) {
        super(syntaxTree, options);

        if (this.hasOption(OPTION_USE_TABS)) {
            this.regExp = new RegExp(" ");
            this.failureString = Rule.FAILURE_STRING_TABS;
        } else if (this.hasOption(OPTION_USE_SPACES)) {
            this.regExp = new RegExp("\t");
            this.failureString = Rule.FAILURE_STRING_SPACES;
        }
    }

    public visitToken(token: TypeScript.ISyntaxToken) {
        if (this.hasOption(OPTION_USE_TABS) || this.hasOption(OPTION_USE_SPACES)) {
            var position = this.getPosition() + token.leadingTriviaWidth();
            if (!token.hasLeadingComment() && token.leadingTrivia().fullText().match(this.regExp)) {
                this.addFailure(this.createFailure(position, token.fullWidth(), this.failureString));
            }
        }
        super.visitToken(token);
    }
}
