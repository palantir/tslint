import * as Lint from "../lint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "object-shorthand",
        description: "Enforces use of ES6 object literal shorthand when possible.",
        options: null,
        optionExamples: ["true"],
        type: "style",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static LONGHAND_PROPERTY = "Expected property shorthand.";
    public static LONGHAND_METHOD = "Expected method shorthand.";

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
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.LONGHAND_METHOD));
        }

        super.visitPropertyAssignment(node);
    }
}
