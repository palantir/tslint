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
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(keyword: ts.SyntaxKind): string {
        return `expected a 'break' before '${ts.tokenToString(keyword)}'`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new NoSwitchCaseFallThroughWalker(sourceFile, this.ruleName, undefined)
        );
    }
}

export class NoSwitchCaseFallThroughWalker extends Lint.AbstractWalker<void> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (utils.isSwitchStatement(node)) {
                this.visitSwitchStatement(node);
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private visitSwitchStatement({ caseBlock: { clauses } }: ts.SwitchStatement): void {
        clauses.forEach((clause, i) => {
            if (
                i !== clauses.length - 1 &&
                clause.statements.length !== 0 &&
                !utils.endsControlFlow(clause) &&
                !this.isFallThroughAllowed(clause)
            ) {
                const keyword = clauses[i + 1].getChildAt(0);
                this.addFailureAtNode(keyword, Rule.FAILURE_STRING(keyword.kind));
            }
        });
    }

    private isFallThroughAllowed(clause: ts.CaseOrDefaultClause): boolean {
        const comments = ts.getLeadingCommentRanges(this.sourceFile.text, clause.end);
        return (
            comments !== undefined &&
            comments.some(comment =>
                /^\s*falls through\b/i.test(
                    this.sourceFile.text.slice(comment.pos + 2, comment.end)
                )
            )
        );
    }
}
