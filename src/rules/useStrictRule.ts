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

/// <reference path='../../lib/tslint.d.ts' />

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "missing 'use strict'";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new UseStrictWalker(syntaxTree, this.getOptions()));
    }
}

class UseStrictWalker extends Lint.ScopeAwareRuleWalker<{}> {
    private static OPTION_CHECK_FUNCTION = "check-function";
    private static OPTION_CHECK_MODULE = "check-module";

    private static USE_STRICT_STRING = "use strict";

    public createScope(): {} {
        return {};
    }

    public visitModuleDeclaration(node: TypeScript.ModuleDeclarationSyntax): void {
        var childCount = TypeScript.childCount(node.modifiers);

        // current depth is 2: global scope and the scope created by this module
        // but skip declare module statements
        if (this.getCurrentDepth() === 2 &&
            !(childCount > 0 && TypeScript.childAt(node.modifiers, 0).kind() === TypeScript.SyntaxKind.DeclareKeyword)) {

            if (this.hasOption(UseStrictWalker.OPTION_CHECK_MODULE)) {
                this.checkUseStrict(node, node.moduleElements);
            }
        }

        super.visitModuleDeclaration(node);
    }

    public visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): void {
        // current depth is 2: global scope and the scope created by this function
        if (this.getCurrentDepth() === 2) {
            if (node.block && this.hasOption(UseStrictWalker.OPTION_CHECK_FUNCTION)) {
                this.checkUseStrict(node, node.block.statements);
            }
        }

        super.visitFunctionDeclaration(node);
    }

    private checkUseStrict(node: TypeScript.ISyntaxNode, syntaxList: TypeScript.ISyntaxElement[]) {
        var isFailure = true;

        if (syntaxList.length > 0) {
            var firstStatement = syntaxList[0];

            if (firstStatement.kind() === TypeScript.SyntaxKind.ExpressionStatement && TypeScript.childCount(firstStatement) === 2) {
                var firstChild = TypeScript.childAt(firstStatement, 0);
                var secondChild = TypeScript.childAt(firstStatement, 1);

                if (TypeScript.isToken(firstChild)) {
                    var firstToken = TypeScript.firstToken(firstChild);
                    if (TypeScript.tokenValueText(firstToken) === UseStrictWalker.USE_STRICT_STRING) {
                        if (secondChild.kind() === TypeScript.SyntaxKind.SemicolonToken) {
                            isFailure = false;
                        }
                    }
                }
            }
        }

        if (isFailure) {
            this.addUseStrictFailure(node);
        }
    }

    private addUseStrictFailure(node: TypeScript.ISyntaxNode) {
        var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
        this.addFailure(this.createFailure(position, TypeScript.width(TypeScript.firstToken(node)), Rule.FAILURE_STRING));
    }
}
