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

const OPTION_IGNORE_MODULE = "ignore-module";
export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-var-requires",
        description: "Disallows the use of require statements except in import statements.",
        descriptionDetails: Lint.Utils.dedent`
            In other words, the use of forms such as \`var module = require("module")\` are banned.
            Instead use ES6 style imports or \`import foo = require('foo')\` imports.`,
        optionsDescription: "Not configurable.",
        options: {
            items: {
                properties: {
                    "ignore-module": {
                        type: "string",
                    },
                },
                type: "object",
            },
            maxLength: 1,
            minLength: 0,
            type: "array",
        },
        optionExamples: [true, [true, { [OPTION_IGNORE_MODULE]: "(\\.html|\\.css)$" }]],
        type: "typescript",
        typescriptOnly: true,
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

        const options = this.getOptions() as any[];
        const patternConfig = options[0] as { "ignore-module": string } | undefined;
        const ignorePattern = patternConfig === undefined ? undefined : new RegExp(patternConfig[OPTION_IGNORE_MODULE]);

        if (this.getCurrentDepth() <= 1 && expression.kind === ts.SyntaxKind.Identifier) {
            const identifierName = (expression as ts.Identifier).text;
            if (identifierName === "require") {
                const requireArguments = node.arguments;
                for (const arg of requireArguments) {
                    if (ignorePattern === undefined || !ignorePattern.test((arg as ts.Identifier).text)) {
                        // if we're calling (invoking) require, then it's not part of an import statement
                        this.addFailureAtNode(node, Rule.FAILURE_STRING);
                    }
                }
            }
        }

        super.visitCallExpression(node);
    }
}
