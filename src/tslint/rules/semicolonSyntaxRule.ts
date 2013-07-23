/// <reference path='baseSyntaxRule.ts'/>

module Lint.Rules {

  export class SemicolonSyntaxRule extends BaseSyntaxRule {
    constructor(name, type) {
      super(name, type);
    }

    public getFailureString(): string {
      return "missing semicolon";
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      return [];
    }
  }

}
