/*
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

export class Rule extends Lint.Rules.AbstractRule {
    public static PARAMETERS_OPTION = "parameters";
    public static ARGUMENTS_OPTION = "arguments";
    public static STATEMENTS_OPTION = "statements";

    public static FAILURE_STRING_SUFFIX = " are not aligned";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        var alignWalker = new AlignWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(alignWalker);
    }
}

type SourcePosition = {
    line: number;
    character: number;
}

class AlignWalker extends Lint.RuleWalker {
    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this.checkAlignment(Rule.PARAMETERS_OPTION, node.parameters);
        super.visitFunctionDeclaration(node);
    }

    public visitFunctionExpression(node: ts.FunctionExpression) {
        this.checkAlignment(Rule.PARAMETERS_OPTION, node.parameters);
        super.visitFunctionExpression(node);
    }

    public visitCallExpression(node: ts.CallExpression) {
        this.checkAlignment(Rule.ARGUMENTS_OPTION, node.arguments);
        super.visitCallExpression(node);
    }

    public visitBlock(node: ts.Block) {
        this.checkAlignment(Rule.STATEMENTS_OPTION, node.statements);
        super.visitBlock(node);
    }

    private checkAlignment(kind: string, nodes: ts.Node[]) {
        if (nodes.length === 0 || !this.hasOption(kind)) {
            return;
        }
        var prevPos = this.getPosition(nodes[0]);
        var alignToColumn = prevPos.character;
        for (var index = 1; index < nodes.length; index++) {
            var node = nodes[index];
            var curPos = this.getPosition(node);
            if (curPos.line !== prevPos.line && curPos.character !== alignToColumn) {
                this.addFailure(this.createFailure(node.getStart(),
                                                   node.getWidth(),
                                                   kind + Rule.FAILURE_STRING_SUFFIX));
                break; // exit loop.
            }
            prevPos = curPos;
        }
    }

    private getPosition(node: ts.Node): SourcePosition {
        return node.getSourceFile().getLineAndCharacterFromPosition(node.getStart());
    }
}
