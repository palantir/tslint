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

// with due reference to https://github.com/Microsoft/TypeScript/blob/7813121c4d77e50aad0eed3152ef1f1156c7b574/scripts/tslint/noNullRule.ts

import * as ts from "typescript";
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-null-keyword",
        description: "Disallows use of the `null` keyword literal.",
        rationale: Lint.Utils.dedent`
            Instead of having the dual concepts of \`null\` and\`undefined\` in a codebase,
            this rule ensures that only \`undefined\` is used.`,
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Use 'undefined' instead of 'null'";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NullWalker(sourceFile, this.getOptions()));
    }
}

class NullWalker extends Lint.RuleWalker {
    public visitNode(node: ts.Node) {
        super.visitNode(node);
        if (node.kind === ts.SyntaxKind.NullKeyword) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
    }
}
