import * as ts from "typescript";

import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-useless-files",
        description: "Disallows empty files, files that only contain whitespace, and files that only contain comments.",
        descriptionDetails: `This rule is a reminder to not keep empty or commented out files around`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_EMPTY = `Empty files are not allowed`;
    public static FAILURE_STRING_COMMENTS = `Files that only contain comments are not allowed`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const ruleFailures: Lint.RuleFailure[] = [];

        const fileContent = sourceFile.getFullText();
        const endPos = sourceFile.end - 1;
        const fileContentTrimmed = fileContent.trim();
        const fileContentNoComments = sourceFile.getText().trim();

        if (fileContentTrimmed.length === 0) {
            ruleFailures.push(new Lint.RuleFailure(sourceFile, 0, endPos, Rule.FAILURE_STRING_EMPTY, this.getOptions().ruleName));
        } else if (fileContentNoComments.length === 0) {
            ruleFailures.push(new Lint.RuleFailure(sourceFile, 0, endPos, Rule.FAILURE_STRING_COMMENTS, this.getOptions().ruleName));
        }
        return ruleFailures;
    }
}
