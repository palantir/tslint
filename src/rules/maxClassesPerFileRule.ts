import * as Lint from "../lint";
import * as ts from "typescript";

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
            The one required argument is an integer indicating the maximum number of classes that can appear in a file.`,
        options: {
            type: "array",
            items: [
                {
                    type: "number",
                    minimum: 1,
                },
            ],
            additionalItems: false,
            minLength: 1,
            maxLength: 2,
        },
        optionExamples: ["[true, 1]", "[true, 5]"],
        type: "maintainability",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY = (maxCount: number): string => {
        const maxClassWord = maxCount === 1 ? "class per file is" : "classes per file are";
        return `A maximum of ${maxCount} ${maxClassWord} allowed`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MaxClassesPerFileWalker(sourceFile, this.getOptions()));
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
        this.increaseClassCount(node);
        super.visitClassDeclaration(node);
    }

    public visitClassExpression(node: ts.ClassExpression) {
        this.increaseClassCount(node);
        super.visitClassExpression(node);
    }

    private increaseClassCount(node: ts.ClassExpression | ts.ClassDeclaration) {
        this.classCount++;
        if (this.classCount > this.maxClassCount) {
            const msg = Rule.FAILURE_STRING_FACTORY(this.maxClassCount);
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), msg));
        }
    }
}
