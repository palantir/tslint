/*
 * Copyright 2015 Palantir Technologies, Inc.
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
    public static FAILURE_STRING = "require() style import is forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoRequireImportsWalker(sourceFile, this.getOptions()));
    }
}

class NoRequireImportsWalker extends Lint.RuleWalker {
    public visitVariableStatement(node: ts.VariableStatement) {
        const declarations = node.declarationList.declarations;
        for (let decl of declarations) {
            this.handleDeclaration(decl);
        }
        super.visitVariableStatement(node);
    }

    public visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        super.visitImportEqualsDeclaration(node);
    }

    private handleDeclaration(decl: ts.VariableDeclaration)  {
        // make sure the RHS is a call expression.
        const call = <ts.CallExpression> (decl.initializer);
        if (call && call.arguments && call.expression) {
            const callExpressionText = call.expression.getText(this.getSourceFile());
            if (callExpressionText === "require") {
                this.addFailure(this.createFailure(decl.getStart(), decl.getWidth(), Rule.FAILURE_STRING));
            }
        }
    }
}
