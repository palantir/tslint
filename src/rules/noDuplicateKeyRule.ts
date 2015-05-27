/*
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

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "duplicate key '";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDuplicateKeyWalker(sourceFile, this.getOptions()));
    }
}

class NoDuplicateKeyWalker extends Lint.RuleWalker {
    private objectKeysStack: {[key: string]: boolean}[] = [];

    public visitObjectLiteralExpression(node: ts.ObjectLiteralExpression): void {
        this.objectKeysStack.push(Object.create(null));
        super.visitObjectLiteralExpression(node);
        this.objectKeysStack.pop();
    }

    public visitPropertyAssignment(node: ts.PropertyAssignment): void {
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
