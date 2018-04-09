
/**
 * @license
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

import { isCallExpression } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const forbiddenFocusFunctions: string[] = [
  'fdescribe',
  'fit',
  'ddescribe',
  'iit',
];

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-focused-tests",
        description: "Disallows test focusing functions like `fdescribe` or `fit`.",
        rationale: Lint.Utils.dedent`
            \`fdescribe\`,\`fit\`,\`ddescribe\`, and \`iit\` are functions used for debugging tests,
            by allowing users to focus on just one test however if commited they can result in tests
            that the programmer wants to run not running. This will notify them and prevent accidental
            ignoring of test cases.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY(func: string) {
      return `Forbidden focused test ${func}`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isCallExpression(node) &&
          node.expression.kind === ts.SyntaxKind.Identifier &&
          forbiddenFocusFunctions.indexOf((node.expression as ts.Identifier).text) !== -1) {
          ctx.addFailureAtNode(
            node.expression,
            Rule.FAILURE_STRING_FACTORY((node.expression as ts.Identifier).text),
          );
        }
        return ts.forEachChild(node, cb);
    });
}
