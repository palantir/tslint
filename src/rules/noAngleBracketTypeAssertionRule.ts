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

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-angle-bracket-type-assertion",
        description: "Requires the use of `as Type` for type assertions instead of `<Type>`.",
        hasFix: true,
        rationale: Lint.Utils.dedent`
            Both formats of type assertions have the same effect, but only \`as\` type assertions
            work in \`.tsx\` files. This rule ensures that you have a consistent type assertion style
            across your codebase.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Type assertion using the '<>' syntax is forbidden. Use the 'as' syntax instead.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoAngleBracketTypeAssertionWalker(sourceFile, this.getOptions()));
    }
}

class NoAngleBracketTypeAssertionWalker extends Lint.RuleWalker {
    public visitTypeAssertionExpression(node: ts.TypeAssertion) {
        const { expression, type } = node;
        const fix = this.createFix(
            // add 'as' syntax at end
            this.createReplacement(node.getEnd(), 0, ` as ${type.getText()}`),
            // delete the angle bracket assertion
            this.createReplacement(node.getStart(), expression.getStart() - node.getStart(), ""),
        );
        this.addFailureAtNode(node, Rule.FAILURE_STRING, fix);
        super.visitTypeAssertionExpression(node);
    }
}
