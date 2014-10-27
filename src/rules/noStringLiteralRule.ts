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
    public static FAILURE_STRING = "object access via string literals is disallowed";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoStringLiteralWalker(syntaxTree, this.getOptions()));
    }
  }

class NoStringLiteralWalker extends Lint.RuleWalker {
    public visitElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax): void {
        this.handleElementAccessExpression(node);
        super.visitElementAccessExpression(node);
    }

    private handleElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax) {
        var argument = node.argumentExpression;
        var id = TypeScript.fullText(argument);

        // the argument expression should be a string of length at least 2 (due to quote characters)
        if (argument.kind() !== TypeScript.SyntaxKind.StringLiteral || id.length < 2) {
            return;
        }

        var unquotedString = id.substring(1, id.length - 1);
        var simpleText = TypeScript.SimpleText.fromString(unquotedString);
        var isValidIdentifier = TypeScript.Scanner.isValidIdentifier(simpleText, ts.ScriptTarget.ES5);

        // only create a failure if the identifier is valid, in which case there's no need to use string literals
        if (isValidIdentifier) {
            var position = this.positionAfter(node.expression, node.openBracketToken);
            this.addFailure(this.createFailure(position, TypeScript.width(argument), Rule.FAILURE_STRING));
        }
    }
}
