/// <reference path='rule.ts'/>
/// <reference path='abstractRule.ts'/>

module Lint.Rules {

    export class BitwiseOperatorRule extends AbstractRule {
        constructor() {
            super("bitwise");
        }

        public isEnabled() : boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new BitwiseWalker(syntaxTree));
        }
    }

    class BitwiseWalker extends Lint.RuleWalker {
        static FAILURE_STRING = "forbidden bitwise operation";

        public visitNode(node: TypeScript.SyntaxNode): void {
            if (node.kind() === TypeScript.SyntaxKind.BitwiseAndExpression ||
                node.kind() === TypeScript.SyntaxKind.AndAssignmentExpression ||
                node.kind() === TypeScript.SyntaxKind.BitwiseOrExpression ||
                node.kind() === TypeScript.SyntaxKind.OrAssignmentExpression ||
                node.kind() === TypeScript.SyntaxKind.BitwiseExclusiveOrExpression ||
                node.kind() === TypeScript.SyntaxKind.ExclusiveOrAssignmentExpression ||
                node.kind() === TypeScript.SyntaxKind.LeftShiftExpression ||
                node.kind() === TypeScript.SyntaxKind.LeftShiftAssignmentExpression ||
                node.kind() === TypeScript.SyntaxKind.SignedRightShiftExpression ||
                node.kind() === TypeScript.SyntaxKind.SignedRightShiftAssignmentExpression ||
                node.kind() === TypeScript.SyntaxKind.UnsignedRightShiftExpression ||
                node.kind() === TypeScript.SyntaxKind.UnsignedRightShiftAssignmentExpression ||
                node.kind() === TypeScript.SyntaxKind.BitwiseNotExpression) {

                this.addFailure(this.createFailure(
                    this.position() + node.leadingTriviaWidth(),
                    BitwiseWalker.FAILURE_STRING));
            }

            super.visitNode(node);
        }
    }

}
