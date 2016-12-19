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

import * as Lint from "../index";
import { hasModifier } from "../language/utils";

const BAN_SINGLE_ARG_PARENS = "ban-single-arg-parens";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "arrow-parens",
        description: "Requires parentheses around the parameters of arrow function definitions.",
        rationale: "Maintains stylistic consistency with other arrow function definitions.",
        optionsDescription: Lint.Utils.dedent`
            if \`${BAN_SINGLE_ARG_PARENS}\` is specified, then arrow functions with one parameter 
            must not have parentheses if removing them is allowed by TypeScript.`,
        options: {
            type: "string",
            enum: [BAN_SINGLE_ARG_PARENS],
        },
        optionExamples: [`true`, `[true, ${BAN_SINGLE_ARG_PARENS}]`],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_MISSING = "Parentheses are required around the parameters of an arrow function definition";
    public static FAILURE_STRING_EXISTS = "Parentheses are prohibited around the parameter in this single parameter arrow function";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const newParensWalker = new ArrowParensWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(newParensWalker);
    }
}

class ArrowParensWalker extends Lint.RuleWalker {
    private avoidOnSingleParameter: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.avoidOnSingleParameter = this.hasOption(BAN_SINGLE_ARG_PARENS);
    }

    public visitArrowFunction(node: ts.FunctionLikeDeclaration) {
        if (node.parameters.length === 1) {
            const parameter = node.parameters[0];
            const text = parameter.getText();
            const firstToken = node.getFirstToken();
            const lastToken = node.getChildAt(2);
            const width = text.length;
            const position = parameter.getStart();
            let isGenerics = false;

            // If firstToken is LessThanToken, it would be Generics.
            if (firstToken.kind === ts.SyntaxKind.LessThanToken) {
                isGenerics = true;
            }

            if (!isGenerics && !hasModifier(node.modifiers, ts.SyntaxKind.AsyncKeyword)) {
                const hasParens = firstToken.kind === ts.SyntaxKind.OpenParenToken && lastToken.kind === ts.SyntaxKind.CloseParenToken;
                if (!hasParens && !this.avoidOnSingleParameter) {
                    const fix = new Lint.Fix(Rule.metadata.ruleName, [new Lint.Replacement(position, width, `(${parameter.getText()})`)]);
                    this.addFailureAt(position, width, Rule.FAILURE_STRING_MISSING, fix);
                } else if (hasParens
                    && this.avoidOnSingleParameter
                    && parameter.decorators == null
                    && parameter.dotDotDotToken == null
                    && parameter.initializer == null
                    && parameter.modifiers == null
                    && parameter.questionToken == null
                    && parameter.type == null) {
                    const fix = new Lint.Fix(Rule.metadata.ruleName, [
                        new Lint.Replacement(lastToken.getStart(), 1, ``),
                        new Lint.Replacement(firstToken.getStart(), 1, ``),
                    ]);
                    this.addFailureAt(position, width, Rule.FAILURE_STRING_EXISTS, fix);
                }
            }
        }
        super.visitArrowFunction(node);
    }
}
