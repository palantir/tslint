/// <reference path='../../typescript/compiler/syntax/syntaxTree.ts'/>

module Lint {

  // TODO: Make this immutable somehow
  export interface Rule {
    getName(): string;

    getType(): RuleType;

    getValue(): any;

    setValue(value: any): void;

    apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[];
  }

  export enum RuleType {
    BufferBased,
    LineBased
  }

  export class RuleFailure {
    private fileName: string;
    private position: number;
    private failure: string;

    constructor(fileName: string, position: number, failure: string) {
      this.fileName = fileName;
      this.position = position;
      this.failure = failure;
    }

    public getFileName() {
      return this.fileName;
    }

    public getPosition() {
      return this.position;
    }

    public getFailure() {
      return this.failure;
    }
  }

}
