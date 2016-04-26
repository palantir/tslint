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
    public static FAILURE_STRING = "the \"this\" keyword is disallowed outside of a class body" ;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoInvalidThisWalker(sourceFile, this.getOptions()));
    }
}

class NoInvalidThisWalker extends Lint.ScopeAwareRuleWalker<{inClass: boolean}> {
    public createScope(node: ts.Node): { inClass: boolean } {
        const isClassScope = node.kind === ts.SyntaxKind.ClassDeclaration || node.kind === ts.SyntaxKind.ClassExpression;

        return {
            inClass: isClassScope,
        };
    }

    protected validateThisKeyword(node: ts.Node) {
        if (!this.getAllScopes().some((scope) => scope.inClass)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
    }

    public visitNode(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.ThisKeyword) {
            this.validateThisKeyword(node);
        }

        super.visitNode(node);
    }
}
