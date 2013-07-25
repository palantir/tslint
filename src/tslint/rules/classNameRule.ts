/// <reference path='rule.ts'/>
/// <reference path='baseRule.ts'/>

module Lint.Rules {

  export class ClassNameRule extends BaseRule {
    constructor() {
      super("class_name");
    }

    public isEnabled() : boolean {
      return this.getValue() === true;
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      var sourceUnit = syntaxTree.sourceUnit();
      var classNameWalker = new ClassNameWalker(syntaxTree.fileName());

      sourceUnit.accept(classNameWalker);

      return classNameWalker.getFailures();
    }
  }

  class ClassNameWalker extends Lint.RuleWalker {
    static FAILURE_STRING = "class name must start with an uppercase character";

    public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): void {
      var position = this.positionAfter(node.modifiers, node.classKeyword);
      var className = node.identifier.text();
      if(className.length > 0) {
        var firstCharacter = className.charAt(0);
        if(firstCharacter !== firstCharacter.toUpperCase()) {
          this.addFailure(new Lint.RuleFailure(this.getFileName(), position, ClassNameWalker.FAILURE_STRING));
        }
      }

      super.visitClassDeclaration(node);
    }
  }

}
