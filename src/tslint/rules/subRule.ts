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
      var sourceUnit = syntaxTree.sourceUnit();
      var comparisonWalker = new SubWalker(syntaxTree.fileName());

      sourceUnit.accept(comparisonWalker);

      return comparisonWalker.getFailures();
    }
  }

  class SubWalker extends Lint.RuleWalker {
    static SUB_FAILURE = "dictionary access via string literals is disallowed";

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
