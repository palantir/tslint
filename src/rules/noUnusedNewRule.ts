/**
 * @license
 * Copyright 2014 Palantir Technologies, Inc.
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

import * as Lint from "../lint";
import * as ts from "typescript";
import { NoUnusedExpressionWalker } from "./noUnusedExpressionRule";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unused-new",
        description: "Disallows unused 'new' expression statements.",
        descriptionDetails: Lint.Utils.dedent`
            Unused 'new' expressions indicate that a constructor is being invoked solely for its side effects.`,
        rationale: Lint.Utils.dedent`
            Detects constructs such as \`new SomeClass()\`, where a constructor is used solely for its side effects, which is considered
            poor style.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "do not use 'new' for side effects";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnusedNewWalker(sourceFile, this.getOptions()));
    }
}

class NoUnusedNewWalker extends NoUnusedExpressionWalker {
    private expressionContainsNew: boolean = false;

    public visitExpressionStatement(node: ts.ExpressionStatement) {
        this.expressionContainsNew = false;
        super.visitExpressionStatement(node);
    }

    protected visitNewExpression(node: ts.NewExpression) {
        super.visitNewExpression(node);
        this.expressionIsUnused = true;
        this.expressionContainsNew = true;
    }

    protected checkExpressionUsage(node: ts.ExpressionStatement) {
        if (this.expressionIsUnused && this.expressionContainsNew) {
            const { expression } = node;
            const { kind } = expression;
            const isValidStandaloneExpression = kind === ts.SyntaxKind.DeleteExpression
                || kind === ts.SyntaxKind.YieldExpression
                || kind === ts.SyntaxKind.AwaitExpression;

            if (!isValidStandaloneExpression && !NoUnusedExpressionWalker.isDirective(node)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
    }
}
