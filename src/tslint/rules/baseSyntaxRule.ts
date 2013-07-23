/// <reference path='rule.ts'/>

module Lint.Rules {

  export class BaseSyntaxRule implements Lint.SyntaxRule {
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

    public getFailureString(): string {
      throw new Error("Unsupported Operation");
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
      throw new Error("Unsupported Operation");
    }
  }

}
