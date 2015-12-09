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
        ruleName: "no-switch-case-fall-through",
        description: "Disallows falling through case statements.",
        descriptionDetails: Lint.Utils.dedent`
            For example, the following is not allowed:

            \`\`\`ts
            switch(foo) {
                case 1:
                    someFunc(foo);
                case 2:
                    someOtherFunc(foo);
            }
            \`\`\`

            However, fall through is allowed when case statements are consecutive or
            a magic \`/* falls through */\` comment is present. The following is valid:

            \`\`\`ts
            switch(foo) {
                case 1:
                    someFunc(foo);
                    /* falls through */
                case 2:
                case 3:
                    someOtherFunc(foo);
            }
            \`\`\``,
        rationale: "Fall though in switch statements is often unintentional and a bug.",
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

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
                isFallingThrough = fallsThrough(switchClause.statements);
                // no break statements and no statements means the fallthrough is expected.
                // last item doesn't need a break
                if (isFallingThrough && switchClause.statements.length > 0 && ((switchClauses.length - 1) > i)) {
                    if (!isFallThroughAllowed(switchClauses[i + 1])) {
                        this.addFailure(this.createFailure(
                            switchClauses[i + 1].getStart(),
                            "case".length,
                            `${Rule.FAILURE_STRING_PART}'case'`
                        ));
                    }
                }
            } else {
                // case statement falling through a default
                if (isFallingThrough && !isFallThroughAllowed(child)) {
                    const failureString = Rule.FAILURE_STRING_PART + "'default'";
                    this.addFailure(this.createFailure(switchClauses[i].getStart(), "default".length, failureString));
                }
            }
        });
        super.visitSwitchStatement(node);
    }
}

function fallsThrough(statements: ts.NodeArray<ts.Statement>) {
    return !statements.some((statement) => {
        return statement.kind === ts.SyntaxKind.BreakStatement
            || statement.kind === ts.SyntaxKind.ThrowStatement
            || statement.kind === ts.SyntaxKind.ReturnStatement
            || statement.kind === ts.SyntaxKind.ContinueStatement;
    });
}

function isFallThroughAllowed(nextCaseOrDefaultStatement: ts.Node) {
    const sourceFileText = nextCaseOrDefaultStatement.getSourceFile().text;
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
