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

import * as Lint from "../index";

const OPTION_ALLOW_DECLARATIONS = "allow-declarations";
const OPTION_ALLOW_NAMED_FUNCTIONS = "allow-named-functions";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "only-arrow-functions",
        description: "Disallows traditional (non-arrow) function expressions.",
        rationale: "Traditional functions don't bind lexical scope, which can lead to unexpected behavior when accessing 'this'.",
        optionsDescription: Lint.Utils.dedent`
            Two arguments may be optionally provided:

            * \`"${OPTION_ALLOW_DECLARATIONS}"\` allows standalone function declarations.
            * \`"${OPTION_ALLOW_NAMED_FUNCTIONS}"\` allows the expression \`function foo() {}\` but not \`function() {}\`.
        `,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_ALLOW_DECLARATIONS, OPTION_ALLOW_NAMED_FUNCTIONS],
            },
            minLength: 0,
            maxLength: 1,
        },
        optionExamples: ["true", `[true, "${OPTION_ALLOW_DECLARATIONS}", "${OPTION_ALLOW_NAMED_FUNCTIONS}"]`],
        type: "typescript",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "non-arrow functions are forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new OnlyArrowFunctionsWalker(sourceFile, this.getOptions()));
    }
}

class OnlyArrowFunctionsWalker extends Lint.RuleWalker {
    private allowDeclarations: boolean;
    private allowNamedFunctions: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.allowDeclarations = this.hasOption(OPTION_ALLOW_DECLARATIONS);
        this.allowNamedFunctions = this.hasOption(OPTION_ALLOW_NAMED_FUNCTIONS);
    }

    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        if (!this.allowDeclarations && !this.allowNamedFunctions) {
            this.failUnlessExempt(node);
        }
        super.visitFunctionDeclaration(node);
    }

    public visitFunctionExpression(node: ts.FunctionExpression) {
        if (node.name === undefined || !this.allowNamedFunctions) {
            this.failUnlessExempt(node);
        }
        super.visitFunctionExpression(node);
    }

    private failUnlessExempt(node: ts.FunctionLikeDeclaration) {
        if (!functionIsExempt(node)) {
            this.addFailureAtNode(Lint.childOfKind(node, ts.SyntaxKind.FunctionKeyword)!, Rule.FAILURE_STRING);
        }
    }
}

/** Generator functions and functions explicitly declaring `this` are allowed. */
function functionIsExempt(node: ts.FunctionLikeDeclaration) {
    return node.asteriskToken || hasThisParameter(node);
}

function hasThisParameter(node: ts.FunctionLikeDeclaration) {
    const first = node.parameters[0];
    return first && first.name.kind === ts.SyntaxKind.Identifier &&
        (first.name as ts.Identifier).originalKeywordKind === ts.SyntaxKind.ThisKeyword;
}
