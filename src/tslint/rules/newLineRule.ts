/// <reference path='rule.ts'/>
/// <reference path='abstractRule.ts'/>
/// <reference path='../language/stateAwareRuleWalker.ts'/>

module Lint.Rules {

    export class NewLineRule extends AbstractRule {
        constructor() {
            super("file_must_end_with_newline");
        }

        public isEnabled(): boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new EOFWalker(syntaxTree));
        }
    }

    class EOFWalker extends Lint.StateAwareRuleWalker {
        static FAILURE_STRING = "file should end with a newline";
        public visitToken(token: TypeScript.ISyntaxToken): void {
            this.handleToken(token);
            super.visitToken(token);
        }

        private handleToken(operatorToken: TypeScript.ISyntaxToken) {
            var lastState = this.getLastState();
            var operatorKind = operatorToken.kind();
            if (lastState !== undefined && operatorKind === TypeScript.SyntaxKind.EndOfFileToken) {
                var endsWithNewLine = false;

                // Begin by looking at the penultimate token to see if it contains a newline
                var previousToken = lastState.token;
                if (previousToken !== null && previousToken.hasTrailingNewLine()) {
                    endsWithNewLine = true;
                }

                // Next, ensure that there are no spaces after the last newline
                if (operatorToken.hasLeadingTrivia()) {
                    endsWithNewLine = false;
                }

                if (!endsWithNewLine) {
                    this.addFailure(this.createFailure(this.position(), EOFWalker.FAILURE_STRING));
                }
            }
        }
    }
}
