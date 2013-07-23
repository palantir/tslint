/// <reference path='rule.ts'/>

module Lint.Rules {

  export class BaseRule implements Lint.Rule {
    private name: string;
    private type: Lint.RuleType;
    private value: any;

    constructor(name: string, type: Lint.RuleType) {
      this.name = name;
      this.type = type;
    }

    public getName() {
      return this.name;
    }

    public getType() {
      return this.type;
    }

    public getValue() {
      return this.value;
    }

    public setValue(value: any): void {
      this.value = value;
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      throw new Error("Unsupported Operation");
    }
  }

}
