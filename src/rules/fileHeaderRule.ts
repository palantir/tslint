import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "file-header",
        description: "Enforces a certain header comment for all files, matched by a regular expression.",
        optionsDescription: "Regular expression to match the header.",
        options: {
            type: "string",
        },
        optionExamples: ['[true, "Copyright \\\\d{4}"]'],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "missing file header";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const walker = new FileHeaderWalker(sourceFile, this.getOptions());
        const options = this.getOptions().ruleArguments;
        if (options !== undefined) {
            walker.setRegexp(new RegExp(options[0].toString()));
        }
        return this.applyWithWalker(walker);
    }
}

class FileHeaderWalker extends Lint.RuleWalker {
    // match a single line or multi line comment with leading whitespace
    // the wildcard dot does not match new lines - we can use [\s\S] instead
    private commentRegexp: RegExp = /^\s*(\/\/(.*?)|\/\*([\s\S]*?)\*\/)/;
    private headerRegexp: RegExp;

    public setRegexp(headerRegexp: RegExp) {
        this.headerRegexp = headerRegexp;
    }

    public visitSourceFile(node: ts.SourceFile) {
        if (this.headerRegexp) {
            let text = node.getFullText();
            let offset = 0;
            // ignore shebang if it exists
            if (text.indexOf("#!") === 0) {
                offset = text.indexOf("\n") + 1;
                text = text.substring(offset);
            }
            // check for a comment
            const match = text.match(this.commentRegexp);
            if (!match) {
                this.addFailureAt(offset, 0, Rule.FAILURE_STRING);
            } else {
                // either the third or fourth capture group contains the comment contents
                const comment = match[2] ? match[2] : match[3];
                if (comment !== undefined && comment.search(this.headerRegexp) < 0) {
                    this.addFailureAt(offset, 0, Rule.FAILURE_STRING);
                }
            }
        }
    }
}
