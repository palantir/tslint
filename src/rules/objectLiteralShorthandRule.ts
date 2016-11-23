import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "object-literal-shorthand",
        description: "Enforces use of ES6 object literal shorthand when possible.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static LONGHAND_PROPERTY = "Expected property shorthand in object literal.";
    public static LONGHAND_METHOD = "Expected method shorthand in object literal.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const objectLiteralShorthandWalker = new ObjectLiteralShorthandWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(objectLiteralShorthandWalker);
    }
}

class ObjectLiteralShorthandWalker extends Lint.RuleWalker {

    public visitPropertyAssignment(node: ts.PropertyAssignment) {
        const name = node.name;
        const value = node.initializer;

        if (name.kind === ts.SyntaxKind.Identifier &&
            value.kind === ts.SyntaxKind.Identifier &&
            name.getText() === value.getText()) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.LONGHAND_PROPERTY));
        }

        if (value.kind === ts.SyntaxKind.FunctionExpression) {
            const fnNode = value as ts.FunctionExpression;
            if (fnNode.name) {
                return;  // named function expressions are OK.
            }

            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.LONGHAND_METHOD));
        }

        super.visitPropertyAssignment(node);
    }
}
