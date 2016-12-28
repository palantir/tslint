import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-string-throw",
        description: `Flags throwing plain strings or concatenations of strings ` +
            `because only Errors produce proper stack traces.`,
        options: null,
        optionsDescription: "",
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
            "Throwing plain strings (not instances of Error) gives no stack traces";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {
    public visitThrowStatement(node: ts.ThrowStatement) {
        const {expression} = node;
        if (this.stringConcatRecursive(expression)) {
            const fix = new Lint.Fix(
                    Rule.metadata.ruleName,
                    [new Lint.Replacement(
                            expression.getStart(),
                            expression.getEnd() - expression.getStart(),
                            `new Error(${expression.getText()})`)]);
            this.addFailure(this.createFailure(
                    node.getStart(), node.getWidth(), Rule.FAILURE_STRING, fix));
        }

        super.visitThrowStatement(node);
    }

    private stringConcatRecursive(node: ts.Node): boolean {
        switch (node.kind) {
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
            case ts.SyntaxKind.TemplateExpression:
                return true;
            case ts.SyntaxKind.BinaryExpression:
                const n = node as ts.BinaryExpression;
                const op = n.operatorToken.kind;
                return op === ts.SyntaxKind.PlusToken &&
                        (this.stringConcatRecursive(n.left) ||
                         this.stringConcatRecursive(n.right));
            case ts.SyntaxKind.ParenthesizedExpression:
                return this.stringConcatRecursive(
                        (node as ts.ParenthesizedExpression).expression);
            default:
                return false;
        }
    }
}
