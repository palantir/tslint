/// <reference path='../../typescript/compiler/syntax/syntaxTree.ts'/>

module Lint {

  export interface Rule {
    getName(): string;

    getType(): RuleType;

    getFailureString(): string;

    getValue(): any;
  }

  export interface SyntaxRule extends Rule {
    apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[];
  }

  export enum RuleType {
    BufferBased,
    LineBased
  }

  export class RuleFailure {
    private position: number;
    private context: any;

    constructor(position: number, context: any) {
      this.position = position;
      this.context = context;
    }

    public getPosition(): number {
      return this.position;
    }

    public getContext(): number {
      return this.context;
    }
  }

}
