import * as ts from "typescript";
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "This standard for loop could be replaced with a for(... of ...) loop";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ForOfWalker(sourceFile, this.getOptions()));
    }
}

class ForOfWalker extends Lint.RuleWalker {
    public visitForStatement(node: ts.ForStatement) {
        this.handleForStatement(node);
        super.visitForStatement(node);
    }

    private handleForStatement(node: ts.ForStatement) {
        let arrayAccessNode = node.condition.getChildAt(2);

        //Skip arrays thats just loop over a hard coded number
        if(arrayAccessNode.kind === ts.SyntaxKind.PropertyAccessExpression){
            let incrementorVariable = node.incrementor.getFirstToken();
            let loopSyntax = node.statement.getChildAt(1);

            //Get the text of the array we need, but without the `.length` at the end
            let arrayIndexAccess = arrayAccessNode.getText().replace(/\.length$/,"");
            
            //find `array[i]`-like usages by building up a regex 
            let regexStr = `${arrayIndexAccess.replace(".","\\.")}\\[\\s*${incrementorVariable.getText().replace(".","\\.")}\\s*\\]`;
            let containsAccess = new RegExp(regexStr, "g").test(loopSyntax.getText());

            // TODO: Instead find usages of incrementorVariable that DO NOT match the regex above
            if(containsAccess){
                const failure = this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
                this.addFailure(failure);
            }
        }
    }
}
