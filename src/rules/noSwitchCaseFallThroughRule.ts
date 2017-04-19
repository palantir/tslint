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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

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
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_PART = "expected a 'break' before ";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoSwitchCaseFallThroughWalker(sourceFile, this.ruleName, undefined));
    }
}

export class NoSwitchCaseFallThroughWalker extends Lint.AbstractWalker<void> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (node.kind === ts.SyntaxKind.SwitchStatement) {
                this.visitSwitchStatement(node as ts.SwitchStatement);
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private visitSwitchStatement(node: ts.SwitchStatement) {
        const clauses = node.caseBlock.clauses;
        const len = clauses.length - 1; // last clause doesn't need to be checked
        for (let i = 0; i < len; ++i) {
            if (clauses[i].statements.length !== 0 &&
                // TODO type assertion can be removed with typescript 2.2
                !utils.endsControlFlow(clauses[i] as ts.CaseClause) &&
                !this.isFallThroughAllowed(clauses[i])) {

                this.reportError(clauses[i + 1]);
            }
        }
    }

    private isFallThroughAllowed(clause: ts.CaseOrDefaultClause) {
        const sourceFileText = this.sourceFile.text;
        const comments = ts.getLeadingCommentRanges(sourceFileText, clause.end);
        if (comments === undefined) {
            return false;
        }
        for (const comment of comments) {
            let commentText: string;
            if (comment.kind === ts.SyntaxKind.MultiLineCommentTrivia) {
                commentText = sourceFileText.substring(comment.pos + 2, comment.end - 2);
            } else {
                commentText = sourceFileText.substring(comment.pos + 2, comment.end);
            }
            if (commentText.trim() === "falls through") {
                return true;
            }
        }
        return false;
    }

    private reportError(clause: ts.CaseOrDefaultClause) {
        const keyword = clause.kind === ts.SyntaxKind.CaseClause ? "case" : "default";
        this.addFailureAt(clause.getStart(this.sourceFile), keyword.length, `${Rule.FAILURE_STRING_PART}'${keyword}'`);
    }
}
