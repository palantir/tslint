/// <reference path='rule.ts'/>
/// <reference path='abstractRule.ts'/>

module Lint.Rules {

    export class TripleComparisonRule extends AbstractRule {
        constructor() {
            super("triple_eq_neq");
        }

        public isEnabled() : boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new ComparisonWalker(syntaxTree));
        }
    }

    class ComparisonWalker extends Lint.RuleWalker {
        static EQ_FAILURE = "== should be ===";
        static NEQ_FAILURE = "!= should be !==";

        public visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): void {
            var position = this.positionAfter(node.left);
            this.handleOperatorToken(position, node.operatorToken);
            super.visitBinaryExpression(node);
        }

        private handleOperatorToken(position: number, operatorToken: TypeScript.ISyntaxToken) {
            var failure = null;
            var operatorKind = operatorToken.kind();

            if (operatorKind === TypeScript.SyntaxKind.EqualsEqualsToken) {
                failure = this.createFailure(position, ComparisonWalker.EQ_FAILURE);
            } else if (operatorKind === TypeScript.SyntaxKind.ExclamationEqualsToken) {
                failure = this.createFailure(position, ComparisonWalker.NEQ_FAILURE);
            }

            if (failure) {
                this.addFailure(failure);
            }
        }
    }

}
