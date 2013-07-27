/// <reference path='rule.ts'/>
/// <reference path='abstractRule.ts'/>

module Lint.Rules {

    export class ForInRule extends AbstractRule {
        constructor() {
            super("forin");
        }

        public isEnabled() : boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new ForInWalker(syntaxTree));
        }
    }

    class ForInWalker extends Lint.RuleWalker {
        static FOR_IN_FAILURE = "for (... in ...) statements must be filtered with an if statement";

        public visitForInStatement(node: TypeScript.ForInStatementSyntax): void {
            super.visitForInStatement(node);
            this.handleForInStatement(node);
        }

        private handleForInStatement(node: TypeScript.ForInStatementSyntax) {
            var failure = null;

            var statement = node.statement;
            var statementChildCount = statement.childCount();
            for (var i = 0; i < statementChildCount; i++) {
                var child = statement.childAt(i);
                var childKind = child.kind();

                // Ignore the braces surrounding the body
                if (childKind !== TypeScript.SyntaxKind.FirstPunctuation &&
                    childKind !== TypeScript.SyntaxKind.CloseBraceToken) {

                    if (childKind !== TypeScript.SyntaxKind.List) {
                        throw new Error("The only possible children are opening punctuation, a list, and a closing brace");
                    }

                    var grandChildrenCount = child.childCount();
                    // There has to be either no body of the for-in loop or a single if statement
                    if (grandChildrenCount > 1) {
                        failure = this.createFailure(this.position(), ForInWalker.FOR_IN_FAILURE);
                    } else if (grandChildrenCount === 1) {
                        var grandChild = child.childAt(0);
                        // The enclosing statement inside the for-in loop must be a single if statement
                        if (grandChild.kind() !== TypeScript.SyntaxKind.IfStatement) {
                            failure = this.createFailure(this.position(), ForInWalker.FOR_IN_FAILURE);
                        }
                    }
                }
            }

            if (failure) {
                this.addFailure(failure);
            }
        }
    }

}
