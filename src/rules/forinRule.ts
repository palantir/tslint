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

import { isBlock, isForInStatement } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "forin",
        description: "Requires a `for ... in` statement to be filtered with an `if` statement.",
        rationale: Lint.Utils.dedent`
            \`\`\`ts
            for (let key in someObject) {
                if (someObject.hasOwnProperty(key)) {
                    // code here
                }
            }
            \`\`\`
            Prevents accidental iteration over properties inherited from an object's prototype.
            See [MDN's \`for...in\`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)
            documentation for more information about \`for...in\` loops.

            Also consider using a [\`Map\`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
            or [\`Set\`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
            if you're storing collections of objects.
            Using \`Object\`s can cause occasional edge case bugs, such as if a key is named "hasOwnProperty".
        `,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "for (... in ...) statements must be filtered with an if statement";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (isForInStatement(node) && isBlock(node.statement) && !isFiltered(node.statement)) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });
}

function isFiltered({ statements }: ts.Block): boolean {
    switch (statements.length) {
        case 0:
            return true;
        case 1:
            return statements[0].kind === ts.SyntaxKind.IfStatement;
        default:
            return (
                statements[0].kind === ts.SyntaxKind.IfStatement &&
                nodeIsContinue((statements[0] as ts.IfStatement).thenStatement)
            );
    }
}

function nodeIsContinue(node: ts.Node) {
    return (
        node.kind === ts.SyntaxKind.ContinueStatement ||
        (isBlock(node) &&
            node.statements.length === 1 &&
            node.statements[0].kind === ts.SyntaxKind.ContinueStatement)
    );
}
