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

import { codeExamples } from "./code-examples/onlyArrowFunctions.examples";

const OPTION_ALLOW_DECLARATIONS = "allow-declarations";
const OPTION_ALLOW_NAMED_FUNCTIONS = "allow-named-functions";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "only-arrow-functions",
        description: "Disallows traditional (non-arrow) function expressions.",
        rationale:
            "Traditional functions don't bind lexical scope, which can lead to unexpected behavior when accessing 'this'.",
        descriptionDetails: Lint.Utils.dedent`
            Note that non-arrow functions are allowed if 'this' appears somewhere in its body
            (as such functions cannot be converted to arrow functions).
        `,
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
        optionExamples: [true, [true, OPTION_ALLOW_DECLARATIONS, OPTION_ALLOW_NAMED_FUNCTIONS]],
        type: "typescript",
        typescriptOnly: false,
        codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "non-arrow functions are forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments));
    }
}

interface Options {
    allowDeclarations: boolean;
    allowNamedFunctions: boolean;
}
function parseOptions(ruleArguments: string[]): Options {
    return {
        allowDeclarations: hasOption(OPTION_ALLOW_DECLARATIONS),
        allowNamedFunctions: hasOption(OPTION_ALLOW_NAMED_FUNCTIONS),
    };

    function hasOption(name: string): boolean {
        return ruleArguments.indexOf(name) !== -1;
    }
}

function walk(ctx: Lint.WalkContext<Options>): void {
    const {
        sourceFile,
        options: { allowDeclarations, allowNamedFunctions },
    } = ctx;
    return ts.forEachChild(sourceFile, function cb(node): void {
        switch (node.kind) {
            case ts.SyntaxKind.FunctionDeclaration:
                if (allowDeclarations) {
                    break;
                }
            // falls through
            case ts.SyntaxKind.FunctionExpression: {
                const f = node as ts.FunctionLikeDeclaration;
                if (!(allowNamedFunctions && f.name !== undefined) && !functionIsExempt(f)) {
                    ctx.addFailureAtNode(
                        utils.getChildOfKind(node, ts.SyntaxKind.FunctionKeyword, ctx.sourceFile)!,
                        Rule.FAILURE_STRING,
                    );
                }
            }
        }
        return ts.forEachChild(node, cb);
    });
}

/** Generator functions and functions using `this` are allowed. */
function functionIsExempt(node: ts.FunctionLikeDeclaration): boolean {
    return (
        node.asteriskToken !== undefined ||
        (node.parameters.length !== 0 && utils.isThisParameter(node.parameters[0])) ||
        (node.body !== undefined && ts.forEachChild(node, usesThis) === true)
    );
}

function usesThis(node: ts.Node): boolean | undefined {
    return (
        node.kind === ts.SyntaxKind.ThisKeyword ||
        (!utils.hasOwnThisReference(node) && ts.forEachChild(node, usesThis))
    );
}
