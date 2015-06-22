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
    public static FAILURE_STRING_PART = "expected a 'break' before ";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoSwitchCaseFallThroughWalker(sourceFile, this.getOptions()));
    }
}

export class NoSwitchCaseFallThroughWalker extends Lint.RuleWalker {
    public visitSwitchStatement(node: ts.SwitchStatement) {
        let isFallingThrough = false;

        // get the position for the first case statement
        const switchClauses = node.caseBlock.clauses;
        switchClauses.forEach((child, i) => {
            const kind = child.kind;
            if (kind === ts.SyntaxKind.CaseClause) {
                const switchClause = <ts.CaseClause> child;
                isFallingThrough = this.fallsThrough(switchClause.statements);
                // no break statements and no statements means the fallthrough is expected.
                // last item doesn't need a break
                if (isFallingThrough && switchClause.statements.length > 0 && ((switchClauses.length - 1) > i)) {
                    if (!this.fallThroughAllowed(switchClauses[i + 1])) {
                        this.addFailure(this.createFailure(child.getEnd(), 1,
                            Rule.FAILURE_STRING_PART + "'case'"));
                    }
                }
            } else {
                // case statement falling through a default
                if (isFallingThrough && !this.fallThroughAllowed(child)) {
                    const failureString = Rule.FAILURE_STRING_PART + "'default'";
                    this.addFailure(this.createFailure(switchClauses[i - 1].getEnd(), 1, failureString));
                }
            }
        });
        super.visitSwitchStatement(node);
    }

    private fallThroughAllowed(nextCaseOrDefaultStatement: ts.Node) {
        const sourceFileText = nextCaseOrDefaultStatement.getSourceFile().text;
        const childCount = nextCaseOrDefaultStatement.getChildCount();
        const firstChild = nextCaseOrDefaultStatement.getChildAt(0);
        const commentRanges = ts.getLeadingCommentRanges(sourceFileText, firstChild.getFullStart());
        if (commentRanges != null) {
            for (let commentRange of commentRanges) {
                const commentText = sourceFileText.substring(commentRange.pos, commentRange.end);
                if (commentText === "/* falls through */") {
                    return true;
                }
            }
        }
        return false;
    }

    private fallsThrough(statements: ts.NodeArray<ts.Statement>) {
        return !statements.some((statement) => {
            return statement.kind === ts.SyntaxKind.BreakStatement
                || statement.kind === ts.SyntaxKind.ThrowStatement
                || statement.kind === ts.SyntaxKind.ReturnStatement;
        });
    }
}
