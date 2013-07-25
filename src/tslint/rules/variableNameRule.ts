/// <reference path='rule.ts'/>
/// <reference path='baseRule.ts'/>

module Lint.Rules {

  export class VariableNameRule extends BaseRule {
    constructor() {
      super("variable_name");
    }

    public isEnabled() : boolean {
      return this.getValue() === true;
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      var sourceUnit = syntaxTree.sourceUnit();
      var variableNameWalker = new VariableNameWalker(syntaxTree.fileName());

      sourceUnit.accept(variableNameWalker);

      return variableNameWalker.getFailures();
    }
  }

  class VariableNameWalker extends Lint.RuleWalker {
    static FAILURE_STRING = "name must be in camelcase or uppercase";

    public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void {
      var identifier = node.identifier;
      var variableName = identifier.text();
      var position = this.position() + identifier.leadingTriviaWidth();

      if(!this.isCamelCase(variableName) && !this.isUpperCase(variableName)) {
        this.addFailure(new Lint.RuleFailure(this.getFileName(), position, VariableNameWalker.FAILURE_STRING));
      }

      super.visitVariableDeclarator(node);
    }

    private isCamelCase(name: string): boolean {
      if(name.length < 0) {
        return true;
      }

      var firstCharacter = name.charAt(0);
      return (firstCharacter === firstCharacter.toLowerCase());
    }

    private isUpperCase(name: string): boolean {
      return (name === name.toUpperCase());
    }
  }

}
