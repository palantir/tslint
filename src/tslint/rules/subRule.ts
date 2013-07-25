/// <reference path='rule.ts'/>
/// <reference path='baseRule.ts'/>

module Lint.Rules {

  export class SubRule extends BaseRule {
    constructor() {
      super("sub");
    }

    public isEnabled() : boolean {
      return this.getValue() === true;
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      return this.applyWithWalker(syntaxTree, new SubWalker(syntaxTree.fileName()));
    }
  }

  class SubWalker extends Lint.RuleWalker {
    static SUB_FAILURE = "object access via string literals is disallowed";

    public visitElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax): void {
      super.visitElementAccessExpression(node);
      this.handleElementAccessExpression(node);
    }

    private handleElementAccessExpression(operatorToken: TypeScript.ElementAccessExpressionSyntax) {
      var failure = null;
      var argumentExpressionKind = operatorToken.argumentExpression.kind()

      if (argumentExpressionKind === TypeScript.SyntaxKind.StringLiteral) {
        failure = new Lint.RuleFailure(this.getFileName(), this.position(), SubWalker.SUB_FAILURE);
      }

      if(failure) {
        this.addFailure(failure);
      }
    }
  }

}
