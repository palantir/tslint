/// <reference path='../../lib/tslint.d.ts' />

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING_TABS = "Indent using only tabs";
    public static FAILURE_STRING_SPACES = "Indent using only spaces";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new IndentWithWalker(syntaxTree, this.getOptions()));
    }
}

class IndentWithWalker extends Lint.RuleWalker {
    private failureString: string;
    private reg: RegExp;

    constructor(syntaxTree: TypeScript.SyntaxTree, options: Lint.IOptions) {
        super(syntaxTree, options);

        if (this.getOptions()[0] === "tabs") {
            this.reg = new RegExp(" ");
            this.failureString = Rule.FAILURE_STRING_TABS;
        } else {
            this.reg = new RegExp("\t");
            this.failureString = Rule.FAILURE_STRING_SPACES;
        }
    }

    public visitToken(token: TypeScript.ISyntaxToken) {
        var position = this.position() + token.leadingTriviaWidth();
        if (!token.hasLeadingComment() && token.leadingTrivia().fullText().match(this.reg)) {
            this.addFailure(this.createFailure(position, token.width(), this.failureString));
        }
        super.visitToken(token);
    }

}
