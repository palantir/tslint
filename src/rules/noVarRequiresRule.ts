/**
 * @license
 * Copyright 2014 Palantir Technologies, Inc.
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
        ruleName: "no-var-requires",
        description: "Disallows the use of require statements except in import statements.",
        descriptionDetails: Lint.Utils.dedent`
            In other words, the use of forms such as \`var module = require("module")\` are banned.
            Instead use ES6 style imports or \`import foo = require('foo')\` imports.`,
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "typescript",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "require statement not part of an import statement";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const requiresWalker = new NoVarRequiresWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(requiresWalker);
    }
}

class NoVarRequiresWalker extends Lint.ScopeAwareRuleWalker<{}> {
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
    }

    public createScope(): {} {
        return {};
    }

    public visitCallExpression(node: ts.CallExpression) {
        const expression = node.expression;

        if (this.getCurrentDepth() <= 1 && expression.kind === ts.SyntaxKind.Identifier) {
            const identifierName = (<ts.Identifier> expression).text;
            if (identifierName === "require") {
                // if we're calling (invoking) require, then it's not part of an import statement
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }

        super.visitCallExpression(node);
    }
}
