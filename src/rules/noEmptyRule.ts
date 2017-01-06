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
        ruleName: "no-empty",
        description: "Disallows empty blocks.",
        descriptionDetails: "Blocks with a comment inside are not considered empty.",
        rationale: "Empty blocks are often indicators of missing code.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "block is empty";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new BlockWalker(sourceFile, this.getOptions()));
    }
}

class BlockWalker extends Lint.RuleWalker {
    public visitBlock(node: ts.Block) {
        if (node.statements.length === 0 && !isConstructorWithParameterProperties(node.parent!)) {
            const sourceFile = this.getSourceFile();
            const children = node.getChildren(sourceFile);
            const openBrace = children[0];
            const closeBrace = children[children.length - 1];
            const sourceFileText = sourceFile.text;

            if (ts.getLeadingCommentRanges(sourceFileText, closeBrace.getFullStart()) === undefined &&
                ts.getTrailingCommentRanges(sourceFileText, openBrace.getEnd()) === undefined) {

                this.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        }

        super.visitBlock(node);
    }
}

function isConstructorWithParameterProperties(node: ts.Node): boolean {
    if (node.kind === ts.SyntaxKind.Constructor) {
        for (const parameter of (node as ts.ConstructorDeclaration).parameters) {
            if (Lint.hasModifier(parameter.modifiers,
                                 ts.SyntaxKind.PrivateKeyword,
                                 ts.SyntaxKind.ProtectedKeyword,
                                 ts.SyntaxKind.PublicKeyword,
                                 ts.SyntaxKind.ReadonlyKeyword)) {
                return true;
            }
        }
    }
    return false;
}
