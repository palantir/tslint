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

const OPTION_ALL = "all";
const OPTION_SAME_LINE_SINGLE_LINE = "same-line-single-line";
const OPTION_SAME_LINE_MULTI_LINE = "same-line-multi-line";
const OPTION_NEXT_LINE_SINGLE_LINE = "next-line-single-line";
const OPTION_NEXT_LINE_MULTI_LINE = "next-line-multi-line";

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

        * \`"${OPTION_ALL}"\` requires braces for all control-flow statements
        * \`"${OPTION_SAME_LINE_SINGLE_LINE}"\` requires braces for control-flow statements
          that are on one line and start on the same line as their control-flow keyword
        * \`"${OPTION_SAME_LINE_MULTI_LINE}"\` requires braces for control-flow statements
          that are split between multiple lines and start on the same line as their control-flow keyword
        * \`"${OPTION_NEXT_LINE_SINGLE_LINE}"\` requires braces for control-flow statements
          that are on one line and start on the line after their control-flow keyword
        * \`"${OPTION_NEXT_LINE_MULTI_LINE}"\` requires braces for control-flow statements
          that are split between multiple lines and start on the line after their control-flow keyword
        `,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    OPTION_ALL,
                    OPTION_SAME_LINE_SINGLE_LINE,
                    OPTION_SAME_LINE_MULTI_LINE,
                    OPTION_NEXT_LINE_SINGLE_LINE,
                    OPTION_NEXT_LINE_MULTI_LINE,
                ],
            },
        },
        optionExamples: ["true", '[true, "same-line-single-line"]'],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static SAME_LINE_STRING = "same-line";
    public static NEXT_LINE_STRING = "next-line";
    public static SINGLE_LINE_STRING = "single-line";
    public static MULTI_LINE_STRING = "multi-line";

    public static MUST_BE_BRACED_STRING = "statements must be braced";
    public static MUST_NOT_BE_BRACED_STRING = "statements must not be braced";

    public static buildMessage(kind: string, sameLine: boolean, singleLine: boolean) {
        return [
            sameLine ? this.SAME_LINE_STRING : this.NEXT_LINE_STRING,
            singleLine ? this.SINGLE_LINE_STRING : this.MULTI_LINE_STRING,
            kind,
            this.MUST_BE_BRACED_STRING,
        ].join(" ");
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new CurlyWalker(sourceFile, this.getOptions()));
    }
}

class CurlyWalker extends Lint.RuleWalker {
    public visitForInStatement(node: ts.ForInStatement) {
        this.validateIterationStatement(node, ts.SyntaxKind.ForKeyword);
        super.visitForInStatement(node);
    }

    public visitForOfStatement(node: ts.ForInStatement) {
        this.validateIterationStatement(node, ts.SyntaxKind.ForKeyword);
        super.visitForOfStatement(node);
    }

    public visitForStatement(node: ts.ForStatement) {
        this.validateIterationStatement(node, ts.SyntaxKind.ForKeyword);
        super.visitForStatement(node);
    }

    public visitIfStatement(node: ts.IfStatement) {
        this.validateIfStatement(node);
        super.visitIfStatement(node);
    }

    public visitDoStatement(node: ts.DoStatement) {
        this.validateIterationStatement(node, ts.SyntaxKind.DoKeyword);
        super.visitDoStatement(node);
    }

    public visitWhileStatement(node: ts.WhileStatement) {
        this.validateIterationStatement(node, ts.SyntaxKind.WhileKeyword);
        super.visitWhileStatement(node);
    }

    private validateIfStatement(node: ts.IfStatement) {
        const isIfSameLine = areOnSameLine(node, node.thenStatement);
        const isIfSingleLine = isStatementSingleLine(node.thenStatement);
        const isIfBraced = isStatementBraced(node.thenStatement);

        this.validateStatementPositioning(node, ts.SyntaxKind.IfKeyword, isIfSameLine, isIfSingleLine, isIfBraced);

        if (node.elseStatement != null &&
            node.elseStatement.kind !== ts.SyntaxKind.IfStatement) {
            const elseKeywordNode = getElseKeywordNode(node);
            const isElseSameLine = areOnSameLine(elseKeywordNode, node.elseStatement);
            const isElseSingleLine = isStatementSingleLine(node.elseStatement);
            const isElseBraced = isStatementBraced(node.elseStatement);

            this.validateStatementPositioning(node,
                                              ts.SyntaxKind.ElseKeyword,
                                              isElseSameLine,
                                              isElseSingleLine,
                                              isElseBraced);
        }
    }

    private validateIterationStatement(node: ts.IterationStatement, kind: ts.SyntaxKind) {
        const isSameLine = areOnSameLine(node, node.statement);
        const isSingleLine = isStatementSingleLine(node.statement);
        const isBraced = isStatementBraced(node.statement);

        this.validateStatementPositioning(node, kind, isSameLine, isSingleLine, isBraced);
    }

    private validateStatementPositioning(node: ts.Node,
                                         kind: ts.SyntaxKind,
                                         isSameLine: boolean,
                                         isSingleLine: boolean,
                                         isBraced: boolean) {

        if (((this.getOptions().length === 0) || this.hasOption(OPTION_ALL)) && !isBraced) {
            this.addFailureForNode(node, kind, `${ts.tokenToString(kind)} ${Rule.MUST_BE_BRACED_STRING}`);
            return;
        }

        const addFailure = () =>
            this.addFailureForNode(node, kind, Rule.buildMessage(ts.tokenToString(kind), isSameLine, isSingleLine));

        if (this.hasOption(OPTION_NEXT_LINE_MULTI_LINE) &&
            !isSameLine &&
            !isSingleLine &&
            !isBraced) {
            addFailure();
        }

        if (this.hasOption(OPTION_NEXT_LINE_SINGLE_LINE) &&
            !isSameLine &&
            isSingleLine &&
            !isBraced) {
            addFailure();
        }

        if (this.hasOption(OPTION_SAME_LINE_MULTI_LINE) &&
            isSameLine &&
            !isSingleLine &&
            !isBraced) {
            addFailure();
        }

        if (this.hasOption(OPTION_SAME_LINE_SINGLE_LINE) &&
            isSameLine &&
            isSingleLine &&
            !isBraced) {
            addFailure();
        }
    }

    private addFailureForNode(node: ts.Node, kind: ts.SyntaxKind, failure: string) {
        let startPos: number;
        let width: number;

        switch (kind) {
            case ts.SyntaxKind.IfKeyword:
                startPos = node.getStart();
                width = (node as ts.IfStatement).thenStatement.getEnd() - startPos;
                break;
            case ts.SyntaxKind.ElseKeyword:
                startPos = getElseKeywordNode(node as ts.IfStatement).getStart();
                width = (node as ts.IfStatement).elseStatement.getEnd() - startPos;
                break;
            default:
                startPos = node.getStart();
                width = node.getWidth();
        }

        this.addFailure(this.createFailure(startPos, width, failure));
    }
}

function getElseKeywordNode(node: ts.IfStatement) {
    return node.getChildren().filter((child) => child.kind === ts.SyntaxKind.ElseKeyword)[0];
}

function isStatementSingleLine(node: ts.Statement) {
    const file = node.getSourceFile();
    const startPos = file.getLineAndCharacterOfPosition(node.getStart());
    const endPos = file.getLineAndCharacterOfPosition(node.getEnd());

    return startPos.line === endPos.line;
}

function areOnSameLine(node: ts.Node, statement: ts.Statement) {
    const file = node.getSourceFile();
    const nodeStartPos = file.getLineAndCharacterOfPosition(node.getStart());
    const statementStartPos = file.getLineAndCharacterOfPosition(statement.getStart());

    return nodeStartPos.line === statementStartPos.line;
}

function isStatementBraced(node: ts.Statement) {
    return node.kind === ts.SyntaxKind.Block;
}
