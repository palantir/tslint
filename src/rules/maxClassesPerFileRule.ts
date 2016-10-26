import * as Lint from "../lint";
import * as ts from "typescript";

type IMaxClassesPerFileRuleOptions = [number, {
    "ignore-filename-pattern": string;
}];

export class Rule extends Lint.Rules.AbstractRule {

    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "max-classes-per-file",
        description: Lint.Utils.dedent`
            A file may not contain more than the specified number of classes 
            if the file name does not match the "ignore-filename-pattern" option`,
        rationale: Lint.Utils.dedent`
            Ensures that files have a single responsibility so that that classes each exist in their own files`,
        optionsDescription: Lint.Utils.dedent`
            Two arguments, the fisrt is required and the second is optional.

            * The first argument is an integer indicating the maximum number of classes that can appear in a file.
            * The second argument is an object that contains a single property named \`"ignore-filename-pattern"\` 
            that specifies a regular expression pattern to match the filenames for files that you with to exclude from this rule.`,
        options: {
            type: "array",
            items: [
                {
                    type: "number",
                    minimum: 1,
                },
                {
                    type: "object",
                    properties: {
                        "ignore-filename-pattern": {
                            type: "string",
                        },
                    },
                },
            ],
            additionalItems: false,
            minLength: 1,
            maxLength: 2,
        },
        optionExamples: ["[true, 2]", '[true, 1, {"ignore-filename-pattern": ".+\\.(model|tests)\\.ts$"}]'],
        type: "maintainability",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY = (maxCount: number): string => {
        const maxClassWord = maxCount === 1 ? "class per file is" : "classes per file are";
        return `A maximum of ${maxCount} ${maxClassWord} allowed`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        let allFailures: Lint.RuleFailure[] = [];
        const opts = <IMaxClassesPerFileRuleOptions> this.getOptions().ruleArguments;
        const ignorePattern = opts[1] && opts[1]["ignore-filename-pattern"] ? opts[1]["ignore-filename-pattern"] : "";

        // If no ignore pattern is provided, or we do not match the ignore pattern, then continue
        if (ignorePattern === "" || !RegExp(ignorePattern).test(sourceFile.fileName)) {
            allFailures = this.applyWithWalker(new MaxClassesPerFileWalker(sourceFile, this.getOptions()));
        }
        return allFailures;
    }
}

class MaxClassesPerFileWalker extends Lint.RuleWalker {
    private classCount = 0;
    private maxClassCount: number;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        this.maxClassCount = options.ruleArguments[0];
        if (isNaN(this.maxClassCount) || this.maxClassCount < 1) {
            this.maxClassCount = 1;
        }
    }

    public visitClassDeclaration(node: ts.ClassDeclaration) {
        this.classCount++;
        if (this.classCount > this.maxClassCount) {
            const msg = Rule.FAILURE_STRING_FACTORY(this.maxClassCount);
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), msg));
        }
        super.visitClassDeclaration(node);
    }
}
