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
    public static FAILURE_STRING = "Forbidden multiple variable definitions in the same statement";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const noMultipleVarWalker = new NoMultipleVarWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(noMultipleVarWalker);
    }
}

class NoMultipleVarWalker extends Lint.RuleWalker {
    public visitVariableStatement(node: ts.VariableStatement) {
        const declarationList = node.declarationList;

        if (declarationList.declarations.length > 1) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }

        super.visitVariableStatement(node);
    }

    public visitForStatement(node: ts.ForStatement) {
        let initializer = node.initializer;
        if (initializer && initializer.kind === ts.SyntaxKind.VariableDeclarationList &&
                (<ts.VariableDeclarationList>initializer).declarations.length > 1) {
            const declarationList = <ts.VariableDeclarationList>initializer;
            this.addFailure(this.createFailure(declarationList.getStart(), declarationList.getWidth(), Rule.FAILURE_STRING));
        }
        super.visitForStatement(node);
    }
}
