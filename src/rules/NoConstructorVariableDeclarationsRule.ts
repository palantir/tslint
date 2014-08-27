export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING_PART = "No constructor variable declarations";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoConstructorVariableDeclarationsWalker(syntaxTree, this.getOptions()));
    }
}

export class NoConstructorVariableDeclarationsWalker extends Lint.RuleWalker {

 
}
