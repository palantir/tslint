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
        if (node.statements.length === 0 && !isExcludedConstructor(node.parent!)) {
            const sourceFile = this.getSourceFile();
            const start = node.getStart(sourceFile);
            // Block always starts with open brace. Adding 1 to its start gives us the end of the brace,
            // which can be used to conveniently check for comments between braces
            if (!Lint.hasCommentAfterPosition(sourceFile.text, start + 1)) {
                this.addFailureFromStartToEnd(start , node.getEnd(), Rule.FAILURE_STRING);
            }
        }

        super.visitBlock(node);
    }
}

function isExcludedConstructor(node: ts.Node): boolean {
    if (node.kind === ts.SyntaxKind.Constructor) {
        if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.PrivateKeyword, ts.SyntaxKind.ProtectedKeyword)) {
            /* If constructor is private or protected, the block is allowed to be empty.
               The constructor is there on purpose to disallow instantiation from outside the class */
            /* The public modifier does not serve a purpose here. It can only be used to allow instantiation of a base class where
               the super constructor is protected. But then the block would not be empty, because of the call to super() */
            return true;
        }
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
