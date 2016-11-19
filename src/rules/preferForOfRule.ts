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
        ruleName: "prefer-for-of",
        description: "Recommends a 'for-of' loop over a standard 'for' loop if the index is only used to access the array being iterated.",
        rationale: "A for(... of ...) loop is easier to implement and read when the index is not needed.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "typescript",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Expected a 'for-of' loop instead of a 'for' loop with this simple iteration";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const languageService = Lint.createLanguageService(sourceFile.fileName, sourceFile.getFullText());
        return this.applyWithWalker(new PreferForOfWalker(sourceFile, this.getOptions(), languageService));
    }
}

class PreferForOfWalker extends Lint.RuleWalker {
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, private languageService: ts.LanguageService) {
        super(sourceFile, options);
    }

    public visitForStatement(node: ts.ForStatement) {
        const arrayAccessNode = this.locateArrayNodeInForLoop(node);

        if (arrayAccessNode !== undefined) {
            // Skip arrays thats just loop over a hard coded number
            // If we are accessing the length of the array, then we are likely looping over it's values
            if (arrayAccessNode.kind === ts.SyntaxKind.PropertyAccessExpression && arrayAccessNode.getLastToken().getText() === "length") {
                let incrementorVariable = node.incrementor.getFirstToken();
                if (/\+|-/g.test(incrementorVariable.getText())) {
                    // If it's formatted as `++i` instead, we need to get the OTHER token
                    incrementorVariable = node.incrementor.getLastToken();
                }
                const arrayToken = arrayAccessNode.getChildAt(0);
                const loopSyntaxText = node.statement.getText();
                // Find all usages of the incrementor variable
                const fileName = this.getSourceFile().fileName;
                const highlights = this.languageService.getDocumentHighlights(fileName, incrementorVariable.getStart(), [fileName]);

                if (highlights && highlights.length > 0) {
                    // There are *usually* three usages when setting up the for loop,
                    // so remove those from the count to get the count inside the loop block
                    const incrementorCount = highlights[0].highlightSpans.length - 3;

                    // Find `array[i]`-like usages by building up a regex 
                    const arrayTokenForRegex = arrayToken.getText().replace(".", "\\.");
                    const incrementorForRegex = incrementorVariable.getText().replace(".", "\\.");
                    const regex = new RegExp(`${arrayTokenForRegex}\\[\\s*${incrementorForRegex}\\s*\\]`, "g");
                    const accessMatches = loopSyntaxText.match(regex);
                    const matchCount = (accessMatches || []).length;

                    // If there are more usages of the array item being access than the incrementor variable
                    // being used, then this loop could be replaced with a for-of loop instead.
                    // This means that the incrementor variable is not used on its own anywhere and is ONLY
                    // used to access the array item.
                    if (matchCount >= incrementorCount) {
                        const failure = this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
                        this.addFailure(failure);
                    }
                }
            }
        }

        super.visitForStatement(node);
    }

    private locateArrayNodeInForLoop(forLoop: ts.ForStatement): ts.Node {
        // Some oddly formatted (yet still valid!) `for` loops might not have children in the condition
        // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for
        if (forLoop.condition !== undefined) {
            let arrayAccessNode = forLoop.condition.getChildAt(2);
            // If We haven't found it, maybe it's not a standard for loop, try looking in the initializer for the array
            // Something like `for(var t=0, len=arr.length; t < len; t++)`
            if (arrayAccessNode.kind !== ts.SyntaxKind.PropertyAccessExpression && forLoop.initializer !== undefined) {
                for (let initNode of forLoop.initializer.getChildren()) {
                    // look in `var t=0, len=arr.length;`
                    if (initNode.kind === ts.SyntaxKind.SyntaxList) {
                        for (let initVar of initNode.getChildren()) {
                            // look in `t=0, len=arr.length;`
                            if (initVar.kind === ts.SyntaxKind.VariableDeclaration) {
                                for (let initVarPart of initVar.getChildren()) {
                                    // look in `len=arr.length`
                                    if (initVarPart.kind === ts.SyntaxKind.PropertyAccessExpression) {
                                        arrayAccessNode = initVarPart;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return arrayAccessNode;
        } else {
            return undefined;
        }
    }
}
