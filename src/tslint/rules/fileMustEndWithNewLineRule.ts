/// <reference path='rule.ts'/>
/// <reference path='baseRule.ts'/>
/// <reference path='../language/lastTokenAwareRuleWalker.ts'/>

module Lint.Rules {

    export class FileMustEndWithNewLineRule extends BaseRule {
        static FAILURE_STRING = "the file doesn't end with a newline";

        constructor() {
            super("file_must_end_with_newline");
        }

        public isEnabled(): boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            var sourceUnit = syntaxTree.sourceUnit();
            var eofWalker = new EOFWalker(syntaxTree.fileName());

            sourceUnit.accept(eofWalker);

            return eofWalker.getFailures();
        }
    }

    class EOFWalker extends Lint.LastTokenAwareRuleWalker {
        static EOF_Failure = "File should end with newline";
        public visitToken(token: TypeScript.ISyntaxToken): void {
            this.handleToken(token);
            super.visitToken(token);
        }

        private handleToken(operatorToken: TypeScript.ISyntaxToken) {
            var failure = null;

            var operatorKind = operatorToken.kind();
            if (operatorKind === TypeScript.SyntaxKind.EndOfFileToken) {
                var endsWithNewLine = false;

                // Begin by looking at the penultimate token to see if it contains a newline
                var previousToken = this.getLastState().token;
                if (previousToken !== null && previousToken.hasTrailingNewLine()) {
                    endsWithNewLine = true;
                }

                // Next, ensure that there are no spaces after the last newline
                if (operatorToken.hasLeadingTrivia()) {
                    endsWithNewLine = false;
                }

                if (!endsWithNewLine) {
                    failure = this.createFailure(EOFWalker.EOF_Failure);
                }
            }

            if (failure) {
                this.addFailure(failure);
            }
        }
    }
}
