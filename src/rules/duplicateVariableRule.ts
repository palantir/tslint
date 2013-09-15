/// <reference path='rule.ts'/>
/// <reference path='abstractRule.ts'/>

module Lint.Rules {

    export class DuplicateVariableRule extends AbstractRule {
        public static FAILURE_STRING = "duplicate variable: '";

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new DuplicateVariableWalker(syntaxTree));
        }
    }

    class DuplicateVariableWalker extends Lint.RuleWalker {
        private scopeStack: ScopeInfo[];

        constructor(syntaxTree: TypeScript.SyntaxTree) {
            super(syntaxTree);

            // initialize stack with global scope
            this.scopeStack = [new ScopeInfo()];
        }

        public visitNode(node: TypeScript.SyntaxNode): void {
            var isNewScope = this.isScopeBoundary(node);

            if (isNewScope) {
                this.scopeStack.push(new ScopeInfo());
            }
            
            super.visitNode(node);

            if (isNewScope) {
                this.scopeStack.pop();
            }
        }

        public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
            var identifier = node.identifier,
                variableName = identifier.text(),
                position = this.position() + identifier.leadingTriviaWidth(),
                currentScope = this.scopeStack[this.scopeStack.length - 1];

            if (currentScope.variableNames.indexOf(variableName) >= 0) {
                var failureString = DuplicateVariableRule.FAILURE_STRING + variableName + "'";
                this.addFailure(this.createFailure(position, identifier.width(), failureString));
            } else {
                currentScope.variableNames.push(variableName);
            }

            super.visitVariableDeclarator(node);
        }

        private isScopeBoundary(node: TypeScript.SyntaxNode): boolean {
            return node instanceof TypeScript.FunctionDeclarationSyntax
                || node instanceof TypeScript.MemberFunctionDeclarationSyntax
                || node instanceof TypeScript.SimpleArrowFunctionExpressionSyntax
                || node instanceof TypeScript.ParenthesizedArrowFunctionExpressionSyntax;
        }
    }

    class ScopeInfo {
        public variableNames: string[] = [];
    }
}
