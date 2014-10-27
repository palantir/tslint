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
    public static FAILURE_STRING = "forbidden bitwise operation";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoBitwiseWalker(syntaxTree, this.getOptions()));
    }
}

class NoBitwiseWalker extends Lint.RuleWalker {
    public visitNode(node: TypeScript.SyntaxNode): void {
        var kind = node.kind();
        if (kind === TypeScript.SyntaxKind.BitwiseAndExpression ||
            kind === TypeScript.SyntaxKind.AndAssignmentExpression ||
            kind === TypeScript.SyntaxKind.BitwiseOrExpression ||
            kind === TypeScript.SyntaxKind.OrAssignmentExpression ||
            kind === TypeScript.SyntaxKind.BitwiseExclusiveOrExpression ||
            kind === TypeScript.SyntaxKind.ExclusiveOrAssignmentExpression ||
            kind === TypeScript.SyntaxKind.LeftShiftExpression ||
            kind === TypeScript.SyntaxKind.LeftShiftAssignmentExpression ||
            kind === TypeScript.SyntaxKind.SignedRightShiftExpression ||
            kind === TypeScript.SyntaxKind.SignedRightShiftAssignmentExpression ||
            kind === TypeScript.SyntaxKind.UnsignedRightShiftExpression ||
            kind === TypeScript.SyntaxKind.UnsignedRightShiftAssignmentExpression ||
            kind === TypeScript.SyntaxKind.BitwiseNotExpression) {

            this.addFailure(this.createFailure(
                this.getPosition() + TypeScript.leadingTriviaWidth(node),
                TypeScript.width(node),
                Rule.FAILURE_STRING));
        }

        super.visitNode(node);
    }
}
