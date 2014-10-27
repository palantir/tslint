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

/// <reference path='../../lib/tslint.d.ts' />
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "duplicate key '";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDuplicateKeyWalker(syntaxTree, this.getOptions()));
    }
}

class NoDuplicateKeyWalker extends Lint.RuleWalker {
    private objectKeysStack: {[key: string]: boolean}[] = [];

    public visitObjectLiteralExpression(node: TypeScript.ObjectLiteralExpressionSyntax): void {
        this.objectKeysStack.push(Object.create(null));
        super.visitObjectLiteralExpression(node);
        this.objectKeysStack.pop();
    }

    public visitSimplePropertyAssignment(node: TypeScript.SimplePropertyAssignmentSyntax): void {
        var objectKeys = this.objectKeysStack[this.objectKeysStack.length - 1];
        var keyToken = node.propertyName;
        var key = keyToken.text();
        if (objectKeys[key]) {
            var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
            var failureString = Rule.FAILURE_STRING + key + "'";
            this.addFailure(this.createFailure(position, TypeScript.width(keyToken), failureString));
        } else {
            objectKeys[key] = true;
        }

        super.visitSimplePropertyAssignment(node);
    }
}
