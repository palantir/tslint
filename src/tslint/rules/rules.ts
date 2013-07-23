/// <reference path='rule.ts'/>

module Lint {

  export class BaseRule {
    private name: any;
    private type: any;
    private value: any;

    constructor(name: any, type: any, value: any) {
      this.name = name;
      this.type = type;
      this.value = value;
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

    public getFailureString() {
      throw new Error("Unsupported Operation");
    }

    public apply(contents: string) {
      throw new Error("Unsupported Operation");
    }
  }

  export function getAllRules(): Rule[] {
    return [];
  }

}
