/// <reference path='rule.ts'/>
/// <reference path='baseRule.ts'/>

module Lint.Rules {

  export class WhitespaceRule extends BaseRule {
    constructor() {
      super("enclosing_whitespace");
    }

    public isEnabled() : boolean {
      return this.getValue() === true;
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      var sourceUnit = syntaxTree.sourceUnit();
      var whitespaceWalker = new WhitespaceWalker(syntaxTree.fileName());

      sourceUnit.accept(whitespaceWalker);

      return whitespaceWalker.getFailures();
    }
  }

  class WhitespaceWalker extends Lint.RuleWalker {
    static FAILURE_STRING = "missing whitespace";

    // check for trailing space for the given tokens
    public visitToken(token: TypeScript.ISyntaxToken): void {
      super.visitToken(token);

      var kind = token.kind();
      if (kind === TypeScript.SyntaxKind.CatchKeyword ||
          kind === TypeScript.SyntaxKind.ColonToken ||
          kind === TypeScript.SyntaxKind.CommaToken ||
          kind === TypeScript.SyntaxKind.EqualsToken ||
          kind === TypeScript.SyntaxKind.ForKeyword ||
          kind === TypeScript.SyntaxKind.IfKeyword ||
          kind === TypeScript.SyntaxKind.SemicolonToken ||
          kind === TypeScript.SyntaxKind.SwitchKeyword ||
          kind === TypeScript.SyntaxKind.WhileKeyword ||
          kind === TypeScript.SyntaxKind.WithKeyword) {
        this.checkForLeadingSpace(token.trailingTrivia());
      }
    }

    // check for spaces between the operator symbol
    public visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): void {
      this.visitNodeOrToken(node.left);
      this.checkForLeadingSpace(node.left.trailingTrivia());

      this.visitToken(node.operatorToken);
      this.checkForLeadingSpace(node.operatorToken.trailingTrivia());

      this.visitNodeOrToken(node.right);
    }

    // check for spaces between ternary operator symbols
    public visitConditionalExpression(node: TypeScript.ConditionalExpressionSyntax): void {
        this.visitNodeOrToken(node.condition);
        this.checkForLeadingSpace(node.condition.trailingTrivia());

        this.visitToken(node.questionToken);
        this.checkForLeadingSpace(node.questionToken.trailingTrivia());

        this.visitNodeOrToken(node.whenTrue);
        this.checkForLeadingSpace(node.whenTrue.trailingTrivia());

        // trailing spaces for the colon token are verified within visitToken
        this.visitToken(node.colonToken);

        this.visitNodeOrToken(node.whenFalse);
    }

    // check for spaces in variable declarations
    public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
        this.visitToken(node.identifier);

        this.visitOptionalNode(node.typeAnnotation);

        if (node.equalsValueClause !== null) {
          if (node.typeAnnotation !== null) {
            this.checkForLeadingSpace(node.typeAnnotation.trailingTrivia());
          } else {
            this.checkForLeadingSpace(node.identifier.trailingTrivia());
          }
        }

        this.visitOptionalNode(node.equalsValueClause);
    }

    // check for spaces within imports
    public visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): void {
        this.visitToken(node.importKeyword);

        this.visitToken(node.identifier);
        this.checkForLeadingSpace(node.identifier.trailingTrivia());

        this.visitToken(node.equalsToken);
        this.visitNode(node.moduleReference);
        this.visitToken(node.semicolonToken);
    }

    // check for spaces within exports
    public visitExportAssignment(node: TypeScript.ExportAssignmentSyntax): void {
        this.visitToken(node.exportKeyword);
        this.checkForLeadingSpace(node.exportKeyword.trailingTrivia());

        this.visitToken(node.equalsToken);
        this.visitToken(node.identifier);
        this.visitToken(node.semicolonToken);
    }

    private checkForLeadingSpace(trivia: TypeScript.ISyntaxTriviaList) {
      var failure = null;

      if(trivia.count() < 1) {
        failure = this.createFailure(WhitespaceWalker.FAILURE_STRING);
      } else {
        var kind = trivia.syntaxTriviaAt(0).kind();
        if(kind !== TypeScript.SyntaxKind.WhitespaceTrivia &&
           kind !== TypeScript.SyntaxKind.NewLineTrivia) {
          failure = this.createFailure(WhitespaceWalker.FAILURE_STRING);
        }
      }

      if(failure) {
        this.addFailure(failure);
      }
    }
  }

}
