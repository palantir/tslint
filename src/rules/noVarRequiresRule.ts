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

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-var-requires",
        description: "Disallows the use of require statements except in import statements.",
        descriptionDetails: Lint.Utils.dedent`
            In other words, the use of forms such as \`var module = require("module")\` are banned.
            Instead use ES2015-style imports or \`import foo = require('foo')\` imports.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        rationale: Lint.Utils.dedent`
            AMD-style \`require([])\` and CommonJS-style \`require("")\` statements are environment-specific
            and more difficult to statically analyze.

            ES2015-style \`import\`s are part of the JavaScript language specfication and recommended as the path going forward.
            TypeScript will compile them to environment-specific forms as needed.
        `,
        type: "typescript",
        typescriptOnly: true
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "require statement not part of an import statement";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const requiresWalker = new NoVarRequiresWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(requiresWalker);
    }
}

// tslint:disable-next-line:deprecation
class NoVarRequiresWalker extends Lint.ScopeAwareRuleWalker<{}> {
    public createScope(): {} {
        return {};
    }

    public visitCallExpression(node: ts.CallExpression) {
        const expression = node.expression;

        if (this.getCurrentDepth() <= 1 && expression.kind === ts.SyntaxKind.Identifier) {
            const identifierName = (expression as ts.Identifier).text;
            if (identifierName === "require") {
                // if we're calling (invoking) require, then it's not part of an import statement
                this.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        }

        super.visitCallExpression(node);
    }
}
