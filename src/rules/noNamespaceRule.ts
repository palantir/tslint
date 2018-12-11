/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import { hasModifier, isNodeFlagSet } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_ALLOW_DECLARATIONS = "allow-declarations";

interface Options {
    allowDeclarations: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-namespace",
        description: "Disallows use of internal `module`s and `namespace`s.",
        descriptionDetails: "This rule still allows the use of `declare module ... {}`",
        rationale: Lint.Utils.dedent`
            ES6-style external modules are the standard way to modularize code.
            Using \`module {}\` and \`namespace {}\` are outdated ways to organize TypeScript code.`,
        optionsDescription: Lint.Utils.dedent`
            One argument may be optionally provided:

            * \`${OPTION_ALLOW_DECLARATIONS}\` allows \`declare namespace ... {}\` to describe external APIs.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_ALLOW_DECLARATIONS],
            },
            minLength: 0,
            maxLength: 1,
        },
        optionExamples: [true, [true, OPTION_ALLOW_DECLARATIONS]],
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "'namespace' and 'module' are disallowed";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            allowDeclarations: this.ruleArguments.indexOf(OPTION_ALLOW_DECLARATIONS) !== -1,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    // Ignore all .d.ts files by returning and not walking their ASTs.
    // .d.ts declarations do not have the Ambient flag set, but are still declarations.
    if (ctx.sourceFile.isDeclarationFile && ctx.options.allowDeclarations) {
        return;
    }
    for (const node of ctx.sourceFile.statements) {
        if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
            if (
                (node as ts.ModuleDeclaration).name.kind !== ts.SyntaxKind.StringLiteral &&
                !isNodeFlagSet(node, ts.NodeFlags.GlobalAugmentation) &&
                (!ctx.options.allowDeclarations ||
                    !hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword))
            ) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        }
    }
}
