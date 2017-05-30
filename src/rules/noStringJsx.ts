/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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
        ruleName: "no-string-jsx",
        description: "Makes sure there is no string literal in JSX statements. Enforces use of a translation method.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "maintainability",
        typescriptOnly: false,
        hasFix: false,
    };

    public static ERROR_MESSAGE = "No string literal in JSX. Use a translation function.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoStringJSXWalker(sourceFile, this.getOptions()));
    }
}

class NoStringJSXWalker extends Lint.RuleWalker {
    public visitJsxElement(node: ts.JsxElement) {
        for (const child of node.children) {
            if (child.kind === ts.SyntaxKind.JsxText) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.ERROR_MESSAGE));
            }
        }
    }

    public visitJsxExpression(node: ts.JsxExpression) {
        if (node.expression && node.expression.kind === ts.SyntaxKind.StringLiteral) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.ERROR_MESSAGE));
        }
    }
}
