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
        ruleName: "no-duplicate-key",
        description: "Disallows duplicate keys in object literals.",
        rationale: Lint.Utils.dedent`
            There is no good reason to define an object literal with the same key twice.
            This rule is now implemented in the TypeScript compiler and does not need to be used.`,
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "duplicate key '";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDuplicateKeyWalker(sourceFile, this.getOptions()));
    }
}

class NoDuplicateKeyWalker extends Lint.RuleWalker {
    private objectKeysStack: {[key: string]: boolean}[] = [];

    public visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
        this.objectKeysStack.push(Object.create(null));
        super.visitObjectLiteralExpression(node);
        this.objectKeysStack.pop();
    }

    public visitPropertyAssignment(node: ts.PropertyAssignment) {
        const objectKeys = this.objectKeysStack[this.objectKeysStack.length - 1];
        const keyNode = node.name;

        if (keyNode.kind === ts.SyntaxKind.Identifier) {
            const key = (<ts.Identifier> keyNode).text;
            if (objectKeys[key]) {
                const failureString = Rule.FAILURE_STRING + key + "'";
                this.addFailure(this.createFailure(keyNode.getStart(), keyNode.getWidth(), failureString));
            } else {
                objectKeys[key] = true;
            }
        }

        super.visitPropertyAssignment(node);
    }
}
