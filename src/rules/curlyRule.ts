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

const OPTION_ALWAYS = "always";
const OPTION_IGNORE_SAME_LINE = "ignore-same-line";

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
        optionsDescription: Lint.Utils.dedent`
            The rule may be set to \`true\`, or to any combination of these arguments:

            * \`"${OPTION_ALWAYS}"\` requires braces for all control-flow statements (same as default)
            * \`"${OPTION_IGNORE_SAME_LINE}"\` skips checking braces for control-flow statements
            that are on one line and start on the same line as their control-flow keyword

            Note: \`"${OPTION_ALWAYS}"\` will be overriden by any "ignore" options that are also set.
        `,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    OPTION_ALWAYS,
                    OPTION_IGNORE_SAME_LINE,
                ],
            },
        },
        optionExamples: ["true", '[true, "ignore-same-line"]'],
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
    private optionIgnoreSameLine: boolean;
    private optionAlways: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        const args = this.getOptions();

        this.optionAlways = args.length === 0 || args.includes(OPTION_ALWAYS);
        this.optionIgnoreSameLine = args.includes(OPTION_IGNORE_SAME_LINE);
    }

    public visitForInStatement(node: ts.ForInStatement) {
        if (!isStatementBraced(node.statement)
                && this.areBracketsRequired(node, node.statement)) {
            this.addFailureAtNode(node, Rule.FOR_FAILURE_STRING);
        }

        super.visitForInStatement(node);
    }

    public visitForOfStatement(node: ts.ForOfStatement) {
        if (!isStatementBraced(node.statement)
                && this.areBracketsRequired(node, node.statement)) {
            this.addFailureAtNode(node, Rule.FOR_FAILURE_STRING);
        }

        super.visitForOfStatement(node);
    }

    public visitForStatement(node: ts.ForStatement) {
        if (!isStatementBraced(node.statement)
                && this.areBracketsRequired(node, node.statement)) {
            this.addFailureAtNode(node, Rule.FOR_FAILURE_STRING);
        }

        super.visitForStatement(node);
    }

    public visitIfStatement(node: ts.IfStatement) {
        if (!isStatementBraced(node.thenStatement)
                && this.areBracketsRequired(node, node.thenStatement)) {
            this.addFailureFromStartToEnd(node.getStart(), node.thenStatement.getEnd(), Rule.IF_FAILURE_STRING);
        }

        if (node.elseStatement != null
                && node.elseStatement.kind !== ts.SyntaxKind.IfStatement
                && !isStatementBraced(node.elseStatement)) {

            // find the else keyword to check placement (and to place the error appropriately)
            const elseKeywordNode = Lint.childOfKind(node, ts.SyntaxKind.ElseKeyword)!;
            if (this.areBracketsRequired(elseKeywordNode, node.elseStatement)) {
                this.addFailureFromStartToEnd(elseKeywordNode.getStart(), node.elseStatement.getEnd(), Rule.ELSE_FAILURE_STRING);
            }
        }

        super.visitIfStatement(node);
    }

    public visitDoStatement(node: ts.DoStatement) {
        if (!isStatementBraced(node.statement)
                && this.areBracketsRequired(node, node.statement)) {
            this.addFailureAtNode(node, Rule.DO_FAILURE_STRING);
        }

        super.visitDoStatement(node);
    }

    public visitWhileStatement(node: ts.WhileStatement) {
        if (!isStatementBraced(node.statement)
                && this.areBracketsRequired(node, node.statement)) {
            this.addFailureAtNode(node, Rule.WHILE_FAILURE_STRING);
        }

        super.visitWhileStatement(node);
    }

    private areBracketsRequired(keywordNode: ts.Node, queryStatement: ts.Statement) {
        // Brackets are required if the node & statement don't fit any configured exceptions
        return !(this.optionIgnoreSameLine && areOnSameLine(keywordNode, queryStatement));
    }
}

function isStatementBraced(node: ts.Statement) {
    return node.kind === ts.SyntaxKind.Block;
}

function areOnSameLine(node: ts.Node, statement: ts.Statement) {
    const file = node.getSourceFile();
    const nodeStartPos = file.getLineAndCharacterOfPosition(node.getStart());
    const statementStartPos = file.getLineAndCharacterOfPosition(statement.getStart());
    const statementEndPos = file.getLineAndCharacterOfPosition(statement.getEnd());

    return nodeStartPos.line === statementStartPos.line
        && nodeStartPos.line === statementEndPos.line;
}
