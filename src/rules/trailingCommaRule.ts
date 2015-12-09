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
        ruleName: "trailing-comma",
        description: "Requires or disallows trailing commas in array and object literals, destructuring assignments and named imports.",
        optionsDescription: Lint.Utils.dedent`
            One argument which is an object with the keys \`multiline\` and \`singleline\`.
            Both should be set to either \`"always"\` or \`"never"\`.

            * \`"multiline"\` checks multi-line object literals.
            * \`"singleline"\` checks single-line object literals.`,
        options: {
            type: "object",
            properties: {
                multiline: {
                    type: "enum",
                    enumValues: ["always", "never"],
                },
                singleline: {
                    type: "enum",
                    enumValues: ["always", "never"],
                },
            },
        },
        optionExamples: ['[true, {"multiline": "always", "singleline": "never"}]'],
        type: "maintainability",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_NEVER = "trailing comma";
    public static FAILURE_STRING_ALWAYS = "missing trailing comma";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new TrailingCommaWalker(sourceFile, this.getOptions()));
    }
}

class TrailingCommaWalker extends Lint.RuleWalker {
    public visitArrayLiteralExpression(node: ts.ArrayLiteralExpression) {
        this.lintNode(node);
        super.visitArrayLiteralExpression(node);
    }

    public visitBindingPattern(node: ts.BindingPattern) {
        if (node.kind === ts.SyntaxKind.ArrayBindingPattern || node.kind === ts.SyntaxKind.ObjectBindingPattern) {
            this.lintNode(node);
        }
        super.visitBindingPattern(node);
    }

    public visitNamedImports(node: ts.NamedImports) {
        this.lintNode(node);
        super.visitNamedImports(node);
    }

    public visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
        this.lintNode(node);
        super.visitObjectLiteralExpression(node);
    }

    private lintNode(node: ts.Node) {
        const child = node.getChildAt(1);
        if (child != null && child.kind === ts.SyntaxKind.SyntaxList) {
            const grandChildren = child.getChildren();

            if (grandChildren.length > 0) {
                const lastGrandChild = grandChildren[grandChildren.length - 1];
                const hasTrailingComma = lastGrandChild.kind === ts.SyntaxKind.CommaToken;

                const endLineOfNode = this.getSourceFile().getLineAndCharacterOfPosition(node.getEnd()).line;
                const endLineOfLastElement = this.getSourceFile().getLineAndCharacterOfPosition(lastGrandChild.getEnd()).line;
                const isMultiline = endLineOfNode !== endLineOfLastElement;
                const option = this.getOption(isMultiline ? "multiline" : "singleline");

                if (hasTrailingComma && option === "never") {
                    this.addFailure(this.createFailure(lastGrandChild.getStart(), 1, Rule.FAILURE_STRING_NEVER));
                } else if (!hasTrailingComma && option === "always") {
                    this.addFailure(this.createFailure(lastGrandChild.getEnd() - 1, 1, Rule.FAILURE_STRING_ALWAYS));
                }
            }
        }
    }

    private getOption(option: string) {
        const allOptions = this.getOptions();
        if (allOptions == null || allOptions.length === 0) {
            return null;
        }

        return allOptions[0][option];
    }
}
