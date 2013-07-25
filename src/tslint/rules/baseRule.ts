/// <reference path='../../typescript/compiler/core/errors.ts'/>

/// <reference path='rule.ts'/>
/// <reference path='../language/ruleWalker.ts'/>

module Lint.Rules {

  export class BaseRule implements Lint.Rule {
    private name: string;
    private value: any;

    constructor(name: string) {
      this.name = name;
    }

    public getName() {
      return this.name;
    }

    public getValue() {
      return this.value;
    }

    public setValue(value: any): void {
      this.value = value;
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      throw TypeScript.Errors.abstract();
    }

    public applyWithWalker(syntaxTree: TypeScript.SyntaxTree, walker: Lint.RuleWalker) {
      var sourceUnit = syntaxTree.sourceUnit();
      sourceUnit.accept(walker);
      return walker.getFailures();
    }

    public isEnabled() : boolean {
      return true;
    }
  }

}
