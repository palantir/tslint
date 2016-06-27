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
        ruleName: "no-return-in-finally",
        description: "Disallows return statements in finally blocks.",
        descriptionDetails: "",
        rationale: "Return statements inside finally blocks have confusing semantics.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "finally block contains return statement";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoReturnInFinallyScopeAwareWalker(sourceFile, this.getOptions()));
    }
}

/**
 * Represents details associated with tracking finally scope.
 */
interface IFinallyScope {
    /**
     * A value indicating whether the current scope is within a finally block.
     */
    isFinallyBlock: boolean;
}

/**
 * Represents a block walker that identifies finally blocks and walks
 * only the blocks that do not change scope for return statements.
 */
class NoReturnInFinallyScopeAwareWalker extends Lint.ScopeAwareRuleWalker<IFinallyScope> {
    protected visitReturnStatement(node: ts.ReturnStatement): void {
        if (!this.getCurrentScope().isFinallyBlock) {
            return;
        }

        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
    }

    public createScope(node: ts.Node): IFinallyScope {
        return {
            isFinallyBlock: this.isFinallyBlock(node),
        };
    }

    protected isScopeBoundary(node: ts.Node): boolean {
        return super.isScopeBoundary(node) || this.isFinallyBlock(node);
    }

    private isFinallyBlock(node: ts.Node): boolean {
        const parent = node.parent;

        return parent &&
            node.kind === ts.SyntaxKind.Block &&
            this.isTryStatement(parent) &&
            parent.finallyBlock === node;
    }

    private isTryStatement(node: ts.Node): node is ts.TryStatement {
        return node.kind === ts.SyntaxKind.TryStatement;
    }
}
