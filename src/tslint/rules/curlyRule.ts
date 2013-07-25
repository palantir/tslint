/// <reference path='rule.ts'/>
/// <reference path='baseRule.ts'/>

module Lint.Rules {

    export class CurlyRule extends BaseRule {
        constructor() {
            super("curly");
        }

        public isEnabled(): boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new CurlyWalker(syntaxTree));
        }
    }

    class CurlyWalker extends Lint.RuleWalker {
        static CURLY_FAILURE = "if/for/do/while statements must be braced";

        public visitForInStatement(node: TypeScript.ForInStatementSyntax): void {
            super.visitForInStatement(node);
            this.verifyStatementIsBraced(node.statement);
        }

        public visitForStatement(node: TypeScript.ForStatementSyntax): void {
            super.visitForStatement(node);
            this.verifyStatementIsBraced(node.statement);
        }

        public visitIfStatement(node: TypeScript.IfStatementSyntax): void {
            super.visitIfStatement(node);
            this.verifyStatementIsBraced(node.statement);
        }

        public visitElseClause(node: TypeScript.ElseClauseSyntax): void {
            super.visitElseClause(node);
            this.verifyStatementIsBraced(node.statement);
        }

        public visitDoStatement(node: TypeScript.DoStatementSyntax): void {
            super.visitDoStatement(node);
            this.verifyStatementIsBraced(node.statement);
        }

        public visitWhileStatement(node: TypeScript.WhileStatementSyntax): void {
            super.visitWhileStatement(node);
            this.verifyStatementIsBraced(node.statement);
        }

        private verifyStatementIsBraced(node: TypeScript.IExpressionSyntax) {
            var failure = null;
            var hasBraces = false;


            var childCount = node.childCount();
            if (childCount == 3) {
                if (node.childAt(0).kind() === TypeScript.SyntaxKind.FirstPunctuation &&
                    node.childAt(1).kind() === TypeScript.SyntaxKind.List &&
                    node.childAt(2).kind() === TypeScript.SyntaxKind.CloseBraceToken) {
                    hasBraces = true;
                }
            }

            if (!hasBraces) {
                failure = this.createFailure(this.position(), CurlyWalker.CURLY_FAILURE);
            }

            if (failure) {
                this.addFailure(failure);
            }
        }
    }

}
