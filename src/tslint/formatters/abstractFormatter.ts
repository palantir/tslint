/// <reference path='../../typescript/src/compiler/core/errors.ts' />

/// <reference path='formatter.ts' />

module Lint.Formatters {

    export class AbstractFormatter implements Lint.Formatter {
        private name: string;

        constructor(name) {
            this.name = name;
        }

        public getName() {
            return this.name;
        }

        public format(failures: Lint.RuleFailure[]): string {
            throw TypeScript.Errors.abstract();
        }
    }

}
