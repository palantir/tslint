/// <reference path='rule.ts'/>
/// <reference path='abstractRule.ts'/>

module Lint.Rules {

    export class SubRule extends AbstractRule {
        constructor() {
            super("sub");
        }

        public isEnabled() : boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new SubWalker(syntaxTree));
        }
      }

    class SubWalker extends Lint.RuleWalker {
        static SUB_FAILURE = "object access via string literals is disallowed";

        public visitElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax): void {
            super.visitElementAccessExpression(node);
            this.handleElementAccessExpression(node);
        }

        private handleElementAccessExpression(operatorToken: TypeScript.ElementAccessExpressionSyntax) {
            var argumentExpressionKind = operatorToken.argumentExpression.kind();

            if (argumentExpressionKind === TypeScript.SyntaxKind.StringLiteral) {
                this.addFailure(this.createFailure(this.position(), SubWalker.SUB_FAILURE));
            }
        }
  }

}
