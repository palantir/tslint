/// <reference path='rule.ts'/>
/// <reference path='baseRule.ts'/>

module Lint.Rules {

  export class TripleComparisonSyntaxRule extends BaseRule {
    constructor() {
      super("triple_eq_neq", Lint.RuleType.BufferBased);
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      var sourceUnit = syntaxTree.sourceUnit();
      var comparisonWalker = new ComparisonWalker(syntaxTree.fileName());

      sourceUnit.accept(comparisonWalker);

      return comparisonWalker.getFailures();
    }
  }

  class ComparisonWalker extends Lint.RuleWalker {
    static EQ_FAILURE = "== should be ===";
    static NEQ_FAILURE = "!= should be !==";

    public visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): void {
      this.visitNodeOrToken(node.left);

      this.handleOperatorToken(node.operatorToken);
      this.visitToken(node.operatorToken);

      this.visitNodeOrToken(node.right);
    }

    private handleOperatorToken(operatorToken: TypeScript.ISyntaxToken) {
      var failure = null;
      var operatorKind = operatorToken.kind();

      if (operatorKind === TypeScript.SyntaxKind.EqualsEqualsToken) {
        failure = new Lint.RuleFailure(this.getFileName(), this.position(), ComparisonWalker.EQ_FAILURE);
      } else if (operatorKind === TypeScript.SyntaxKind.ExclamationEqualsToken) {
        failure = new Lint.RuleFailure(this.getFileName(), this.position(), ComparisonWalker.NEQ_FAILURE);
      }

      if(failure) {
        this.addFailure(failure);
      }
    }
  }

}
