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
        ruleName: "no-empty",
        description: "Disallows empty blocks.",
        descriptionDetails: "Blocks with a comment inside are not considered empty.",
        rationale: "Empty blocks are often indicators of missing code.",
        optionsDescription: "Not configurable.",
        options: {},
        optionExamples: ["true"],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "block is empty";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new BlockWalker(sourceFile, this.getOptions()));
    }
}

class BlockWalker extends Lint.RuleWalker {
    private ignoredBlocks: ts.Block[] = [];

    public visitBlock(node: ts.Block) {
        const openBrace = node.getChildAt(0);
        const closeBrace = node.getChildAt(node.getChildCount() - 1);
        const sourceFileText = node.getSourceFile().text;
        const hasCommentAfter = ts.getTrailingCommentRanges(sourceFileText, openBrace.getEnd()) != null;
        const hasCommentBefore = ts.getLeadingCommentRanges(sourceFileText, closeBrace.getFullStart()) != null;
        const isSkipped = this.ignoredBlocks.indexOf(node) !== -1;

        if (node.statements.length <= 0 && !hasCommentAfter && !hasCommentBefore && !isSkipped) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }

        super.visitBlock(node);
    }

    public visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
        const parameters = node.parameters;
        let isSkipped = false;

        for (let param of parameters) {
            const hasPropertyAccessModifier = Lint.hasModifier(
                param.modifiers,
                ts.SyntaxKind.PrivateKeyword,
                ts.SyntaxKind.ProtectedKeyword,
                ts.SyntaxKind.PublicKeyword
            );

            if (hasPropertyAccessModifier) {
                isSkipped = true;
                this.ignoredBlocks.push(node.body);
                break;
            }

            if (isSkipped) {
                break;
            }
        }

        super.visitConstructorDeclaration(node);
    }
}
