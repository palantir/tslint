/// <reference path='ruleWalker.ts'/>

module Lint {

  export interface LastTokenAwareWalkerState {
    position: number;
    token: TypeScript.ISyntaxToken;
  }

  export class LastTokenAwareRuleWalker extends RuleWalker {
    private lastState: LastTokenAwareWalkerState;

    public visitToken(token: TypeScript.ISyntaxToken): void {
      this.lastState = {
        position: this.position(),
        token: token
      };

      super.visitToken(token);
    }

    public getLastState(): LastTokenAwareWalkerState {
      return this.lastState;
    }
  }

}
