/// <reference path='ruleWalker.ts'/>

module Lint {

    export interface RuleWalkerState {
        position: number;
        token: TypeScript.ISyntaxToken;
    }

    export class StateAwareRuleWalker extends RuleWalker {
        private lastState: RuleWalkerState;

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

        public getLastState(): RuleWalkerState {
            return this.lastState;
        }
    }

}
