/// <reference path='abstractFormatter.ts' />

module Lint.Formatters {

    export class ProseFormatter extends AbstractFormatter {
        constructor() {
            super("prose");
        }

        public format(failures: Lint.RuleFailure[]): string {
            var output = "";
            for (var i = 0; i < failures.length; ++i) {
                var failure = failures[i];
                var fileName = failure.getFileName();
                var lineAndCharacter = failure.getLineAndCharacter();
                var line = lineAndCharacter.line() + 1;
                var character = lineAndCharacter.character() + 1;
                var failureString = failure.getFailure();

                output += fileName + "[" + line + ", " + character + "]: " + failureString + "\n";
            }
            return output;
        }
    }

}
