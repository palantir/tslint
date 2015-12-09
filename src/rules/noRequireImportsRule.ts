/**
 * @license
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
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-require-imports",
        description: "Disallows invocation of `require()`.",
        rationale: "Prefer the newer ES6-style imports over `require()`.",
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "maintainability",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "require() style import is forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoRequireImportsWalker(sourceFile, this.getOptions()));
    }
}

class NoRequireImportsWalker extends Lint.RuleWalker {
    public visitCallExpression(node: ts.CallExpression) {
        if (node.arguments != null && node.expression != null) {
            const callExpressionText = node.expression.getText(this.getSourceFile());
            if (callExpressionText === "require") {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
        super.visitCallExpression(node);
    }

    public visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        const {moduleReference} = node;
        if (moduleReference.kind === ts.SyntaxKind.ExternalModuleReference) {
            this.addFailure(this.createFailure(moduleReference.getStart(), moduleReference.getWidth(), Rule.FAILURE_STRING));
        }
        super.visitImportEqualsDeclaration(node);
    }
}
