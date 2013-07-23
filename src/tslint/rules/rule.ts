module Lint {

  export interface Rule {
    getName(): string;

    getType(): RuleType;

    getFailureString(): string;

    getValue(): any;

    apply(contents: string): RuleFailure[];
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
