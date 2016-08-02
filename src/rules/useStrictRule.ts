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
        ruleName: "use-strict",
        description: "Requires using ECMAScript 5's strict mode.",
        optionsDescription: Lint.Utils.dedent`
            Two arguments may be optionally provided:

            * \`check-module\` checks that all top-level modules are using strict mode.
            * \`check-function\` checks that all top-level functions are using strict mode.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: ["check-module", "check-function"],
            },
            minLength: 0,
            maxLength: 2,
        },
        optionExamples: ['[true, "check-module"]'],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "missing 'use strict'";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const useStrictWalker = new UseStrictWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(useStrictWalker);
    }
}

class UseStrictWalker extends Lint.ScopeAwareRuleWalker<{}> {
    private static OPTION_CHECK_FUNCTION = "check-function";
    private static OPTION_CHECK_MODULE = "check-module";

    private static USE_STRICT_STRING = "use strict";

    public createScope(): {} {
        return {};
    }

    public visitModuleDeclaration(node: ts.ModuleDeclaration) {
        if (!Lint.hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword)
                && this.hasOption(UseStrictWalker.OPTION_CHECK_MODULE)
                && node.body != null
                && node.body.kind === ts.SyntaxKind.ModuleBlock) {
            let firstModuleDeclaration = getFirstInModuleDeclarationsChain(node);
            let hasOnlyModuleDeclarationParents = firstModuleDeclaration.parent.kind === ts.SyntaxKind.SourceFile;

            if (hasOnlyModuleDeclarationParents) {
                this.handleBlock(firstModuleDeclaration, <ts.Block> node.body);
            }
        }

        super.visitModuleDeclaration(node);
    }

    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        // current depth is 2: global scope and the scope created by this function
        if (this.getCurrentDepth() === 2 &&
                this.hasOption(UseStrictWalker.OPTION_CHECK_FUNCTION) &&
                node.body != null) {
            this.handleBlock(node, node.body);
        }

        super.visitFunctionDeclaration(node);
    }

    private handleBlock(node: ts.Declaration, block: ts.Block | ts.ModuleBlock) {
        let isFailure = true;

        if (block.statements != null && block.statements.length > 0) {
            const firstStatement = block.statements[0];

            if (firstStatement.kind === ts.SyntaxKind.ExpressionStatement) {
                const firstChild = firstStatement.getChildAt(0);

                if (firstChild.kind === ts.SyntaxKind.StringLiteral
                        && (<ts.StringLiteral> firstChild).text === UseStrictWalker.USE_STRICT_STRING) {
                    isFailure = false;
                }
            }
        }

        if (isFailure) {
            this.addFailure(this.createFailure(node.getStart(), node.getFirstToken().getWidth(), Rule.FAILURE_STRING));
        }
    }
}

function getFirstInModuleDeclarationsChain(node: ts.ModuleDeclaration): ts.ModuleDeclaration {
    let current = node;

    while (current.parent.kind === ts.SyntaxKind.ModuleDeclaration) {
        current = <ts.ModuleDeclaration> current.parent;
    }

    return current;
}
