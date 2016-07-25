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

import * as Lint from "../lint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-for-of",
        description: "Recommends a for of loop over a standard for loop if the index is only used to access the array being looped over.",
        rationale: "A for(... of ...) loop is easier to implement and read when the index is not needed.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "typescript",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "This standard for loop could be replaced with a for(... of ...) loop";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const languageService = Lint.createLanguageService(sourceFile.fileName, sourceFile.getFullText());
        return this.applyWithWalker(new ForOfWalker(sourceFile, this.getOptions(), languageService));
    }
}

class ForOfWalker extends Lint.RuleWalker {
    private languageService: ts.LanguageService;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, languageService: ts.LanguageService) {
        super(sourceFile, options);
        this.languageService = languageService;
    }

    public visitForStatement(node: ts.ForStatement) {
        this.handleForStatement(node);
        super.visitForStatement(node);
    }

    private handleForStatement(node: ts.ForStatement) {
        const arrayAccessNode = this.locateArrayNodeForLoop(node);

        // Skip arrays thats just loop over a hard coded number
        // If we are accessing the length of the array, then we are likely looping over it's values
        if (arrayAccessNode.kind === ts.SyntaxKind.PropertyAccessExpression && arrayAccessNode.getLastToken().getText() === "length") {
            const incrementorVariable = node.incrementor.getFirstToken();
            const arrayToken = arrayAccessNode.getChildAt(0);
            const loopSyntax = node.statement.getChildAt(1);

            // Find all usages of the incrementor variable
            const fileName = this.getSourceFile().fileName;
            const highlights = this.languageService.getDocumentHighlights(fileName, incrementorVariable.getStart(), [fileName]);
            // There are three usages when setting up the for loop,
            // so remove those form the count to get the count inside the loop block
            const incrementorCount = highlights[0].highlightSpans.length - 3;

            // Find `array[i]`-like usages by building up a regex 
            const arrayTokenForRegex = arrayToken.getText().replace(".", "\\.");
            const incrementorForRegex = incrementorVariable.getText().replace(".", "\\.");
            const regex = new RegExp(`${arrayTokenForRegex}\\[\\s*${incrementorForRegex}\\s*\\]`, "g");
            const accessMatches = loopSyntax.getText().match(regex);
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

    private locateArrayNodeForLoop(forLoop: ts.ForStatement): ts.Node {
        let arrayAccessNode = forLoop.condition.getChildAt(2);
        // If We haven't found it, maybe it's not a standard for loop, try looking in the initializer for the array
        // Something like `for(var t=0, len=arr.length; t < len; t++)`
        if (arrayAccessNode.kind !== ts.SyntaxKind.PropertyAccessExpression) {
            forLoop.initializer.getChildren().forEach((initNode: ts.Node) => {
                // look in `var t=0, len=arr.length;`
                if (initNode.kind === ts.SyntaxKind.SyntaxList) {
                    initNode.getChildren().forEach((initVar: ts.Node) => {
                        // look in `t=0, len=arr.length;`
                        if (initVar.kind === ts.SyntaxKind.VariableDeclaration) {
                            initVar.getChildren().forEach((initVarPart: ts.Node) => {
                                // look in `len=arr.length`
                                if (initVarPart.kind === ts.SyntaxKind.PropertyAccessExpression) {
                                    arrayAccessNode = initVarPart;
                                }
                            });
                        }
                    });
                }
            });
        }
        return arrayAccessNode;
    }
}
