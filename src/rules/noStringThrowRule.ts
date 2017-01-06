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
        ruleName: "no-string-throw",
        description: `Flags throwing plain strings or concatenations of strings ` +
            `because only Errors produce proper stack traces.`,
        hasFix: true,
        options: null,
        optionsDescription: "Not configurable.",
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
            "Throwing plain strings (not instances of Error) gives no stack traces";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {
    public visitThrowStatement(node: ts.ThrowStatement) {
        const {expression} = node;
        if (this.stringConcatRecursive(expression)) {
            const fix = this.createFix(this.createReplacement(expression.getStart(),
                                                              expression.getEnd() - expression.getStart(),
                                                              `new Error(${expression.getText()})`));
            this.addFailure(this.createFailure(
                    node.getStart(), node.getWidth(), Rule.FAILURE_STRING, fix));
        }

        super.visitThrowStatement(node);
    }

    private stringConcatRecursive(node: ts.Node): boolean {
        switch (node.kind) {
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
            case ts.SyntaxKind.TemplateExpression:
                return true;
            case ts.SyntaxKind.BinaryExpression:
                const n = node as ts.BinaryExpression;
                const op = n.operatorToken.kind;
                return op === ts.SyntaxKind.PlusToken &&
                        (this.stringConcatRecursive(n.left) ||
                         this.stringConcatRecursive(n.right));
            case ts.SyntaxKind.ParenthesizedExpression:
                return this.stringConcatRecursive(
                        (node as ts.ParenthesizedExpression).expression);
            default:
                return false;
        }
    }
}
