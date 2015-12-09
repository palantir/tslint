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

import * as ts from "typescript";
import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "object-literal-sort-keys",
        description: "Requires keys in object literals to be sorted alphabetically",
        rationale: "Useful in preventing merge conflicts",
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "maintainability",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_PREFIX = "The key '";
    public static FAILURE_STRING_POSTFIX = "' is not sorted alphabetically";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ObjectLiteralSortKeysWalker(sourceFile, this.getOptions()));
    }
}

class ObjectLiteralSortKeysWalker extends Lint.RuleWalker {
    // stacks are used to maintain state while recursing through nested object literals
    private lastSortedKeyStack: string[] = [];
    private sortedStateStack: boolean[] = [];

    public visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
        // char code 0; every string should be >= to this
        this.lastSortedKeyStack.push("");
        // sorted state is always initially true
        this.sortedStateStack.push(true);
        super.visitObjectLiteralExpression(node);
        this.lastSortedKeyStack.pop();
        this.sortedStateStack.pop();
    }

    public visitPropertyAssignment(node: ts.PropertyAssignment) {
        const sortedState = this.sortedStateStack[this.sortedStateStack.length - 1];
        // skip remainder of object literal scan if a previous key was found
        // in an unsorted position. This ensures only one error is thrown at
        // a time and keeps error output clean.
        if (sortedState) {
            const lastSortedKey = this.lastSortedKeyStack[this.lastSortedKeyStack.length - 1];
            const keyNode = node.name;
            if (keyNode.kind === ts.SyntaxKind.Identifier) {
                const key = (<ts.Identifier> keyNode).text;
                if (key < lastSortedKey) {
                    const failureString = Rule.FAILURE_STRING_PREFIX + key + Rule.FAILURE_STRING_POSTFIX;
                    this.addFailure(this.createFailure(keyNode.getStart(), keyNode.getWidth(), failureString));
                    this.sortedStateStack[this.sortedStateStack.length - 1] = false;
                } else {
                    this.lastSortedKeyStack[this.lastSortedKeyStack.length - 1] = key;
                }
            }
        }
        super.visitPropertyAssignment(node);
    }
}
