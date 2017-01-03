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

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "curly",
        description: "Enforces braces for `if`/`for`/`do`/`while` statements.",
        rationale: Lint.Utils.dedent`
            \`\`\`ts
            if (foo === bar)
                foo++;
                bar++;
            \`\`\`

            In the code above, the author almost certainly meant for both \`foo++\` and \`bar++\`
            to be executed only if \`foo === bar\`. However, he forgot braces and \`bar++\` will be executed
            no matter what. This rule could prevent such a mistake.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static DO_FAILURE_STRING = "do statements must be braced";
    public static ELSE_FAILURE_STRING = "else statements must be braced";
    public static FOR_FAILURE_STRING = "for statements must be braced";
    public static IF_FAILURE_STRING = "if statements must be braced";
    public static WHILE_FAILURE_STRING = "while statements must be braced";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new CurlyWalker(sourceFile, this.getOptions()));
    }
}

class CurlyWalker extends Lint.RuleWalker {
    public visitForInStatement(node: ts.ForInStatement) {
        if (!isStatementBraced(node.statement)) {
            this.addFailureAtNode(node, Rule.FOR_FAILURE_STRING);
        }

        super.visitForInStatement(node);
    }

    public visitForOfStatement(node: ts.ForOfStatement) {
        if (!isStatementBraced(node.statement)) {
            this.addFailureAtNode(node, Rule.FOR_FAILURE_STRING);
        }

        super.visitForOfStatement(node);
    }

    public visitForStatement(node: ts.ForStatement) {
        if (!isStatementBraced(node.statement)) {
            this.addFailureAtNode(node, Rule.FOR_FAILURE_STRING);
        }

        super.visitForStatement(node);
    }

    public visitIfStatement(node: ts.IfStatement) {
        if (!isStatementBraced(node.thenStatement)) {
            this.addFailureFromStartToEnd(node.getStart(), node.thenStatement.getEnd(), Rule.IF_FAILURE_STRING);
        }

        if (node.elseStatement != null
                && node.elseStatement.kind !== ts.SyntaxKind.IfStatement
                && !isStatementBraced(node.elseStatement)) {

            // find the else keyword to place the error appropriately
            const elseKeywordNode = Lint.childOfKind(node, ts.SyntaxKind.ElseKeyword)!;
            this.addFailureFromStartToEnd(elseKeywordNode.getStart(), node.elseStatement.getEnd(), Rule.ELSE_FAILURE_STRING);
        }

        super.visitIfStatement(node);
    }

    public visitDoStatement(node: ts.DoStatement) {
        if (!isStatementBraced(node.statement)) {
            this.addFailureAtNode(node, Rule.DO_FAILURE_STRING);
        }

        super.visitDoStatement(node);
    }

    public visitWhileStatement(node: ts.WhileStatement) {
        if (!isStatementBraced(node.statement)) {
            this.addFailureAtNode(node, Rule.WHILE_FAILURE_STRING);
        }

        super.visitWhileStatement(node);
    }
}

function isStatementBraced(node: ts.Statement) {
    return node.kind === ts.SyntaxKind.Block;
}
