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

import { hasModifier, isConstructorDeclaration, isParameterProperty } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const ALLOW_EMPTY_CATCH = "allow-empty-catch";
const ALLOW_EMPTY_FUNCTIONS = "allow-empty-functions";

interface Options {
    allowEmptyCatch: boolean;
    allowEmptyFunctions: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-empty",
        description: "Disallows empty blocks.",
        descriptionDetails: "Blocks with a comment inside are not considered empty.",
        rationale: "Empty blocks are often indicators of missing code.",
        optionsDescription: Lint.Utils.dedent`
            If \`${ALLOW_EMPTY_CATCH}\` is specified, then catch blocks are allowed to be empty.
            If \`${ALLOW_EMPTY_FUNCTIONS}\` is specified, then function definitions are allowed to be empty.`,
        options: {
            type: "array",
            items: {
                anyOf: [
                    {
                        type: "string",
                        enum: [ALLOW_EMPTY_CATCH],
                    },
                    {
                        type: "string",
                        enum: [ALLOW_EMPTY_FUNCTIONS],
                    },
                ],
            },
        },
        optionExamples: [
            true,
            [true, ALLOW_EMPTY_CATCH],
            [true, ALLOW_EMPTY_FUNCTIONS],
            [true, ALLOW_EMPTY_CATCH, ALLOW_EMPTY_FUNCTIONS],
        ],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "block is empty";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            allowEmptyCatch: this.ruleArguments.indexOf(ALLOW_EMPTY_CATCH) !== -1,
            allowEmptyFunctions: this.ruleArguments.indexOf(ALLOW_EMPTY_FUNCTIONS) !== -1,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (
            node.kind === ts.SyntaxKind.Block &&
            (node as ts.Block).statements.length === 0 &&
            !isExcluded(node.parent, ctx.options)
        ) {
            const start = node.getStart(ctx.sourceFile);
            // Block always starts with open brace. Adding 1 to its start gives us the end of the brace,
            // which can be used to conveniently check for comments between braces
            if (Lint.hasCommentAfterPosition(ctx.sourceFile.text, start + 1)) {
                return;
            }
            return ctx.addFailure(start, node.end, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });
}

function isExcluded(node: ts.Node, options: Options): boolean {
    if (options.allowEmptyCatch && node.kind === ts.SyntaxKind.CatchClause) {
        return true;
    }

    if (
        options.allowEmptyFunctions &&
        (node.kind === ts.SyntaxKind.MethodDeclaration ||
            node.kind === ts.SyntaxKind.FunctionDeclaration ||
            node.kind === ts.SyntaxKind.FunctionExpression ||
            node.kind === ts.SyntaxKind.ArrowFunction)
    ) {
        return true;
    }

    return (
        isConstructorDeclaration(node) &&
        /* If constructor is private or protected, the block is allowed to be empty.
               The constructor is there on purpose to disallow instantiation from outside the class */
        /* The public modifier does not serve a purpose here. It can only be used to allow instantiation of a base class where
               the super constructor is protected. But then the block would not be empty, because of the call to super() */
        (hasModifier(
            node.modifiers,
            ts.SyntaxKind.PrivateKeyword,
            ts.SyntaxKind.ProtectedKeyword,
        ) ||
            node.parameters.some(isParameterProperty))
    );
}
