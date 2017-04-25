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

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "object-literal-sort-keys",
        description: "Requires keys in object literals to be sorted alphabetically",
        rationale: "Useful in preventing merge conflicts",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY = (name: string) => {
        return `The key '${name}' is not sorted alphabetically`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ObjectLiteralSortKeysWalker(sourceFile, this.getOptions()));
    }
}

class ObjectLiteralSortKeysWalker extends Lint.RuleWalker {
    // stacks are used to maintain state while recursing through nested object literals
    private lastSortedKeyStack: string[] = [];
    private multilineFlagStack: boolean[] = [];
    private sortedStateStack: boolean[] = [];
    private propertyNodes: Array<ts.NodeArray<ts.ObjectLiteralElementLike>> = [];

    public visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
        // char code 0; every string should be >= to this
        this.lastSortedKeyStack.push("");
        // sorted state is always initially true
        this.sortedStateStack.push(true);
        this.multilineFlagStack.push(this.isMultilineListNode(node));
        this.propertyNodes.push(node.properties);
        super.visitObjectLiteralExpression(node);
        this.propertyNodes.pop();
        this.multilineFlagStack.pop();
        this.lastSortedKeyStack.pop();
        this.sortedStateStack.pop();
    }

    public visitPropertyAssignment(node: ts.PropertyAssignment) {
        const sortedState = this.sortedStateStack[this.sortedStateStack.length - 1];
        const isMultiline = this.multilineFlagStack[this.multilineFlagStack.length - 1];

        // skip remainder of object literal scan if a previous key was found
        // in an unsorted position. This ensures only one error is thrown at
        // a time and keeps error output clean. Skip also single line objects.
        if (sortedState && isMultiline) {
            const lastSortedKey = this.lastSortedKeyStack[this.lastSortedKeyStack.length - 1];
            const keyNode = node.name;
            if (isIdentifierOrStringLiteral(keyNode)) {
                const key = keyNode.text;
                if (key < lastSortedKey) {
                    const failureString = Rule.FAILURE_STRING_FACTORY(key);
                    this.addFailureAtNode(keyNode, failureString, this.generateFix(this.propertyNodes[this.propertyNodes.length - 1]));
                    this.sortedStateStack[this.sortedStateStack.length - 1] = false;
                } else {
                    this.lastSortedKeyStack[this.lastSortedKeyStack.length - 1] = key;
                }
            }
        }
        super.visitPropertyAssignment(node);
    }

    private isMultilineListNode(node: ts.ObjectLiteralExpression) {
        const startLineOfNode = this.getLineAndCharacterOfPosition(node.getStart()).line;
        const endLineOfNode = this.getLineAndCharacterOfPosition(node.getEnd()).line;
        return endLineOfNode !== startLineOfNode;
    }

    private generateFix(properties: ts.NodeArray<ts.ObjectLiteralElementLike>): Lint.Fix {
        const trailingComma = properties.hasTrailingComma;
        const cmp = (
            a: ts.ObjectLiteralElementLike,
            b: ts.ObjectLiteralElementLike,
        ): number => {
            if (a.name == null || b.name == null) {
                return 0;
            }
            if (!isIdentifierOrStringLiteral(a.name) || !isIdentifierOrStringLiteral(b.name)) {
                return 0;
            }

            const aText = a.name.text;
            const bText = b.name.text;

            if (aText < bText) {
                return -1;
            }
            return 1;
        };

        const sortedProperties = properties.slice(0).sort(cmp);

        const newText = sortedProperties.map((v, i) => {
            const fullText = v.getFullText();
            if (i > 0) {
                return "," + fullText;
            }
            return fullText;
        }).join("") + (trailingComma ? "," : "");

        const start = properties.pos;
        const width = properties.end - start;

        return new Lint.Replacement(start, width, newText);
    }
}

function isIdentifierOrStringLiteral(node: ts.Node): node is (ts.Identifier | ts.StringLiteral) {
    return node.kind === ts.SyntaxKind.Identifier || node.kind === ts.SyntaxKind.StringLiteral;
}
