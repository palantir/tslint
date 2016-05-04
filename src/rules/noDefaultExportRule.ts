import * as ts from "typescript";
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "use of default exports is disallowed";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDefaultExportWalker(sourceFile, this.getOptions()));
    }
}

class NoDefaultExportWalker extends Lint.RuleWalker {
    public visitExportAssignment(node: ts.ExportAssignment) {
        const exportMember = node.getChildAt(1);
        if (exportMember != null && exportMember.kind === ts.SyntaxKind.DefaultKeyword) {
            this.addFailure(this.createFailure(exportMember.getStart(), exportMember.getWidth(), Rule.FAILURE_STRING));
        }
        super.visitExportAssignment(node);
   }
}
