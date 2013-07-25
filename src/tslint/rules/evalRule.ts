/// <reference path='rule.ts'/>
/// <reference path='baseRule.ts'/>

module Lint.Rules {

  export class EvalRule extends BaseRule {
    constructor() {
      super("eval");
    }

    public isEnabled() : boolean {
      return this.getValue() === true;
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      var sourceUnit = syntaxTree.sourceUnit();
      var evalWalker = new EvalWalker(syntaxTree.fileName());

      sourceUnit.accept(evalWalker);

      return evalWalker.getFailures();
    }
  }

  class EvalWalker extends Lint.RuleWalker {
    static FAILURE_STRING = "forbidden eval";

    public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): void {
      var expression = node.expression;
      if (expression.isToken() && expression.kind() === TypeScript.SyntaxKind.IdentifierName) {
        if (expression.firstToken().text() === "eval") {
          var position = this.position() + node.leadingTriviaWidth();
          this.addFailure(new Lint.RuleFailure(this.getFileName(), position, EvalWalker.FAILURE_STRING));
        }
      }

      super.visitInvocationExpression(node);
    }
  }

}
