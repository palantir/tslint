import * as ts from "typescript";

import * as Lint from "../lint";

const OPTION_ARRAY = "array";
const OPTION_GENERIC = "generic";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "array-type",
        description: "Requires using either 'T[]' or 'Array<T>' for arrays.",
        optionsDescription: Lint.Utils.dedent`
            One of the following arguments must be provided:

            * \`"${OPTION_ARRAY}"\` enforces use of 'T[]'.
            * \`"${OPTION_GENERIC}"\` enforces use of 'Array<T>'.`,
        options: {
            type: "string",
            enum: [OPTION_ARRAY, OPTION_GENERIC],
        },
        optionExamples: ["[true, array]", "[true, generic]"],
        type: "style",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_ARRAY = "Array type using 'Array<T>' is forbidden. Use 'T[]' instead.";
    public static FAILURE_STRING_GENERIC = "Array type using 'T[]' is forbidden. Use 'Array<T>' instead.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const alignWalker = new ArrayTypeWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(alignWalker);
    }
}

class ArrayTypeWalker extends Lint.RuleWalker {
    public visitArrayType(node: ts.ArrayTypeNode) {
        if (this.hasOption(OPTION_GENERIC)) {
            const typeName = node.elementType;
            const fix = new Lint.Fix(Rule.metadata.ruleName, [
                this.appendText(typeName.getStart(), "Array<"),
                // Delete the square brackets and replace with an angle bracket
                this.createReplacement(typeName.getEnd(), node.getEnd() - typeName.getEnd(), ">"),
            ]);
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_GENERIC, fix));
        }

        super.visitArrayType(node);
    }

    public visitTypeReference(node: ts.TypeReferenceNode) {
        const typeName = node.typeName.getText();
        if (this.hasOption(OPTION_ARRAY) && typeName === "Array") {
            const typeArgs = node.typeArguments;
            let fix: Lint.Fix;
            if (!typeArgs || typeArgs.length === 0) {
                // Create an 'any' array
                fix = new Lint.Fix(Rule.metadata.ruleName, [
                    this.createReplacement(node.getStart(), node.getWidth(), "any[]"),
                ]);
            } else if (typeArgs && typeArgs.length === 1) {
                const typeStart = typeArgs[0].getStart();
                const typeEnd = typeArgs[0].getEnd();
                fix = new Lint.Fix(Rule.metadata.ruleName, [
                    // Delete Array and the first angle bracket
                    this.deleteText(node.getStart(), typeStart - node.getStart()),
                    // Delete the last angle bracket and replace with square brackets
                    this.createReplacement(typeEnd, node.getEnd() - typeEnd, "[]"),
                ]);
            }
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_ARRAY, fix));
        }

        super.visitTypeReference(node);
    }
}
