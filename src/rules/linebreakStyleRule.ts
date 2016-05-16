import * as ts from "typescript";
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRINGS = {
        CRLF: "Expected linebreak to be 'CRLF'",
        LF: "Expected linebreak to be 'LF'",
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const failures = <Lint.RuleFailure[]>[];
        const scanner = ts.createScanner(
            sourceFile.languageVersion,
            false,
            sourceFile.languageVariant,
            sourceFile.getFullText()
        );

        let expectedEOL: string;
        let failureString: string;

        switch (this.getOptions().ruleArguments[0]) {
            case "CRLF":
                expectedEOL = "\r\n";
                failureString = Rule.FAILURE_STRINGS.CRLF;
                break;
            case "LF":
                expectedEOL = "\n";
                failureString = Rule.FAILURE_STRINGS.LF;
                break;
        }

        if (expectedEOL != null) {
            for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
                if (token === ts.SyntaxKind.NewLineTrivia) {
                    const text = scanner.getTokenText();
                    if (text !== expectedEOL) {
                        failures.push(this.createFailure(sourceFile, scanner, failureString));
                    }
                }
            }
        }

        return failures;
    }

    public createFailure(sourceFile: ts.SourceFile, scanner: ts.Scanner, failure: string): Lint.RuleFailure {
        // get the start of the current line
        const start = sourceFile.getPositionOfLineAndCharacter(sourceFile.getLineAndCharacterOfPosition(scanner.getStartPos()).line, 0);
        // since line endings are not visible, we simply end at the beginning of
        // the line ending, which happens to be the start of the token.
        const end = scanner.getStartPos();

        return new Lint.RuleFailure(sourceFile, start, end, failure, this.getOptions().ruleName);
    }
}
