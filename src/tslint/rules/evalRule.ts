/// <reference path='rule.ts'/>
/// <reference path='abstractRule.ts'/>

module Lint.Rules {

    export class EvalRule extends AbstractRule {
        constructor() {
            super("eval");
        }

        public isEnabled() : boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new EvalWalker(syntaxTree));
        }
    }

    class EvalWalker extends Lint.RuleWalker {
        static FAILURE_STRING = "forbidden eval";

        public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): void {
            var expression = node.expression;
            if (expression.isToken() && expression.kind() === TypeScript.SyntaxKind.IdentifierName) {
                if (expression.firstToken().text() === "eval") {
                    var position = this.position() + node.leadingTriviaWidth();
                    this.addFailure(this.createFailure(position, EvalWalker.FAILURE_STRING));
                }
            }

            super.visitInvocationExpression(node);
        }
    }

}
