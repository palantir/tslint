/**
 * @license
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

import * as ts from "typescript";
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "forin",
        description: "Requires a `for ... in` statement to be filtered with an `if` statement.",
        rationale: Lint.Utils.dedent`
            \`\`\`ts
            for (let key in someObject) {
                if (someObject.hasOwnProperty(key)) {
                    // code here
                }
            }
            \`\`\`
            Prevents accidental interation over properties inherited from an object's prototype.
            See [MDN's \`for...in\`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)
            documentation for more information about \`for...in\` loops.`,
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "for (... in ...) statements must be filtered with an if statement";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ForInWalker(sourceFile, this.getOptions()));
    }
}

class ForInWalker extends Lint.RuleWalker {
    public visitForInStatement(node: ts.ForInStatement) {
        this.handleForInStatement(node);
        super.visitForInStatement(node);
    }

    private handleForInStatement(node: ts.ForInStatement) {
        const statement = node.statement;
        const statementKind = node.statement.kind;

        // a direct if statement under a for...in is valid
        if (statementKind === ts.SyntaxKind.IfStatement) {
            return;
        }

        // if there is a block, verify that it has a single if statement or starts with if (..) continue;
        if (statementKind === ts.SyntaxKind.Block) {
            const blockNode = <ts.Block> statement;
            const blockStatements = blockNode.statements;
            if (blockStatements.length >= 1) {
                const firstBlockStatement = blockStatements[0];
                if (firstBlockStatement.kind === ts.SyntaxKind.IfStatement) {
                    // if this "if" statement is the only statement within the block
                    if (blockStatements.length === 1) {
                        return;
                    }

                    // if this "if" statement has a single continue block
                    const ifStatement = (<ts.IfStatement> firstBlockStatement).thenStatement;
                    if (nodeIsContinue(ifStatement)) {
                        return;
                    }
                }
            }
        }

        const failure = this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
        this.addFailure(failure);
    }
}

function nodeIsContinue(node: ts.Node) {
    const kind = node.kind;

    if (kind === ts.SyntaxKind.ContinueStatement) {
        return true;
    }

    if (kind === ts.SyntaxKind.Block) {
        const blockStatements = (<ts.Block> node).statements;
        if (blockStatements.length === 1 && blockStatements[0].kind === ts.SyntaxKind.ContinueStatement) {
            return true;
        }
    }

    return false;
}
