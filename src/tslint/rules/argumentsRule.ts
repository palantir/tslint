/// <reference path='rule.ts'/>
/// <reference path='abstractRule.ts'/>

module Lint.Rules {

    export class ArgumentsRule extends AbstractRule {
        constructor() {
            super("arguments");
        }

        public isEnabled() : boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new ArgumentsWalker(syntaxTree));
        }
      }

    class ArgumentsWalker extends Lint.RuleWalker {
        static FAILURE_STRING = "access forbidden to arguments property";

        public visitMemberAccessExpression(node: TypeScript.MemberAccessExpressionSyntax): void {
            var expression = node.expression;
            var name = node.name;
            var position = this.position() + node.expression.leadingTriviaWidth();

            if (expression.isToken() && name.text() === "callee") {
                var tokenExpression = <TypeScript.ISyntaxToken> expression;
                if (tokenExpression.text() === "arguments") {
                    this.addFailure(this.createFailure(position, ArgumentsWalker.FAILURE_STRING));
                }
              }

            super.visitMemberAccessExpression(node);
        }
    }

}
