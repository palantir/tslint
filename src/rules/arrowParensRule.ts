/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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
        ruleName: "arrow-parens",
        description: "Requires parentheses around the parameters of arrow function definitions.",
        rationale: "Maintains stylistic consistency with other arrow function definitions.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Parentheses are required around the parameters of an arrow function definition";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const newParensWalker = new ArrowParensWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(newParensWalker);
    }
}

class ArrowParensWalker extends Lint.RuleWalker {
    public visitArrowFunction(node: ts.FunctionLikeDeclaration) {
        if (node.parameters.length === 1) {
            const parameter = node.parameters[0];
            const text = parameter.getText();
            const firstToken = node.getFirstToken();
            const lastToken = node.getChildAt(2);
            const width = text.length;
            const position = parameter.getStart();

            if (firstToken.kind !== ts.SyntaxKind.OpenParenToken || lastToken.kind !== ts.SyntaxKind.CloseParenToken) {
                this.addFailure(this.createFailure(position, width, Rule.FAILURE_STRING));
            }
        }
        super.visitArrowFunction(node);
    }
}
