import * as ts from "typescript";
import * as Lint from "tslint/lib/lint";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_SEMICOLON = "object type members should end with a semicolon";
    public static FAILURE_COMMA = "object type members should end with a comma";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ObjectTypeWalker(sourceFile, this.getOptions()));
    }
}

class ObjectTypeWalker extends Lint.RuleWalker {
    protected visitTypeLiteral(node: ts.TypeLiteralNode) {
        node.members.forEach(member => {
            this.checkSemicolonAt(member);
        });

        super.visitTypeLiteral(node);
    }

    protected visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        node.members.forEach(member => {
            this.checkSemicolonAt(member);
        });

        super.visitInterfaceDeclaration(node);
    }

    private checkSemicolonAt(node: ts.Node) {
        const semicolon = !this.hasOption("comma");

        if (semicolon) {
            this.checkLastToken(
                node,
                ts.SyntaxKind.SemicolonToken,
                ts.SyntaxKind.CommaToken,
                Rule.FAILURE_SEMICOLON
            );
        } else {
            this.checkLastToken(
                node,
                ts.SyntaxKind.CommaToken,
                ts.SyntaxKind.SemicolonToken,
                Rule.FAILURE_COMMA
            );
        }
    }

    private checkLastToken(node: ts.Node,
        expectedKind: ts.SyntaxKind,
        unwantedKind: ts.SyntaxKind,
        failure: string) {
        const sourceFile = this.getSourceFile();
        const children = node.getChildren(sourceFile);

        const last = children[children.length - 1];
        if (last.kind !== expectedKind) {
            let position = 0;
            let width = 0;
            if (last.kind === unwantedKind) {
                position = last.getStart(sourceFile);
                width = 1;
            } else {
                position = node.getStart(sourceFile) + node.getWidth(sourceFile);
            }

            this.addFailure(this.createFailure(position, width, failure));
        }
    }
}
