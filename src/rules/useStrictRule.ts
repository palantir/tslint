/*
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

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "missing 'use strict'";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        var useStrictWalker = new UseStrictWalker(sourceFile, this.getOptions());
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
        var modifiers = node.modifiers;
        var hasDeclareModifier = (modifiers != null) && (modifiers.length > 0) && (modifiers[0].kind === ts.SyntaxKind.DeclareKeyword);

        // current depth is 2: global scope and the scope created by this module
        if (this.getCurrentDepth() === 2 && !hasDeclareModifier) {
            if (this.hasOption(UseStrictWalker.OPTION_CHECK_MODULE) &&
                    node.body != null &&
                    node.body.kind === ts.SyntaxKind.ModuleBlock &&
                    this.hasOption(UseStrictWalker.OPTION_CHECK_MODULE)) {
                this.handleBlock(node, <ts.Block> node.body);
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
        var isFailure = true;

        if (block.statements != null && block.statements.length > 0) {
            var firstStatement = block.statements[0];

            if (firstStatement.kind === ts.SyntaxKind.ExpressionStatement) {
                var firstChild = firstStatement.getChildAt(0);

                if (firstChild.kind === ts.SyntaxKind.StringLiteral &&
                        (<ts.StringLiteral> firstChild).text === UseStrictWalker.USE_STRICT_STRING) {
                    isFailure = false;
                }
            }
        }

        if (isFailure) {
            this.addFailure(this.createFailure(node.getStart(), node.getFirstToken().getWidth(), Rule.FAILURE_STRING));
        }
    }
}
