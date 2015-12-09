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
        ruleName: "no-bitwise",
        description: "Disallows bitwise operators.",
        descriptionDetails: Lint.Utils.dedent`
            Specifically, the following bitwise operators are banned:
            \`&\`, \`&=\`, \`|\`, \`|=\`,
            \`^\`, \`^=\`, \`<<\`, \`<<=\`,
            \`>>\`, \`>>=\`, \`>>>\`, \`>>>=\`, and \`~\`.
            This rule does not ban the use of \`&\` and \`|\` for intersection and union types.`,
        rationale: Lint.Utils.dedent`
            Bitwise operators are often typos - for example \`bool1 & bool2\` instead of \`bool1 && bool2\`.
            They also can be an indicator of overly clever code which decreases maintainability.`,
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "forbidden bitwise operation";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoBitwiseWalker(sourceFile, this.getOptions()));
    }
}

class NoBitwiseWalker extends Lint.RuleWalker {
    public visitBinaryExpression(node: ts.BinaryExpression) {
        switch (node.operatorToken.kind) {
            case ts.SyntaxKind.AmpersandToken:
            case ts.SyntaxKind.AmpersandEqualsToken:
            case ts.SyntaxKind.BarToken:
            case ts.SyntaxKind.BarEqualsToken:
            case ts.SyntaxKind.CaretToken:
            case ts.SyntaxKind.CaretEqualsToken:
            case ts.SyntaxKind.LessThanLessThanToken:
            case ts.SyntaxKind.LessThanLessThanEqualsToken:
            case ts.SyntaxKind.GreaterThanGreaterThanToken:
            case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken:
            case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
            case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
                break;
        }
        super.visitBinaryExpression(node);
    }

    public visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression) {
        if (node.operator === ts.SyntaxKind.TildeToken) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        super.visitPrefixUnaryExpression(node);
    }
}
