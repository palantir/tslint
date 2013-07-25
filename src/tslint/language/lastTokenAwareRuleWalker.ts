/// <reference path='ruleWalker.ts'/>

module Lint {

  export interface LastTokenAwareWalkerState {
    position: number;
    token: TypeScript.ISyntaxToken;
  }

  export class LastTokenAwareRuleWalker extends RuleWalker {
    private lastState: LastTokenAwareWalkerState = null;

    public visitToken(token: TypeScript.ISyntaxToken): void {
      // Skip compiler insertions of empty tokens
      if (token.value() !== null) {
        this.lastState = {
          position: this.position() + token.leadingTriviaWidth(),
          token: token
        };
      }

      super.visitToken(token);
    }

    public getLastState(): LastTokenAwareWalkerState {
      return this.lastState;
    }
  }

}
