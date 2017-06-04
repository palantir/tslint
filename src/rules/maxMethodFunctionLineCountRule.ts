/**
 * @license
 * Copyright 2017 Tristan FAURE.
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

import { isConstructorDeclaration, isMethodDeclaration, isFunctionDeclaration, isBlock, isArrowFunction} from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

const OPTION_LINE_LIMIT = "line-limit";
const OPTION_EOL = "eol";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "max-method-function-line-count",
        description: "Requires methods or functions to remain under a certain number of lines",
        rationale: Lint.Utils.dedent`
            Limiting the number of lines allowed in a block allows blocks to remain small,
            single purpose, and maintainable.`,
        optionsDescription: "number of lines and kind carriage return (cr, lf, crlf).",
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_LINE_LIMIT, OPTION_EOL],
            },
        },
        optionExamples: [[true, 200, "cr"]],
        type: "maintainability",
        typescriptOnly: false,
    };
    
    public isEnabled(): boolean {
        return super.isEnabled() && this.ruleArguments[0] as number > 0;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MaxMethodLine(sourceFile, this.getOptions()));
    }
}

function FAILURE_STRING(lineCount: number, lineLimit: number) {
    return `This method or function has ${lineCount} lines, which exceeds the maximum of ${lineLimit} lines allowed. ` +
        "Consider breaking this up into smaller parts";
}

class MaxMethodLine extends Lint.RuleWalker {
    
    os = require('os')

    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (isFunctionDeclaration(node) || isMethodDeclaration(node) || isConstructorDeclaration(node) || isArrowFunction(node)){
                this.countLines (node)
            } else {
                return ts.forEachChild(node, cb)
            }

        };
        return ts.forEachChild(sourceFile, cb)
    }

    private getEOL (option : string){
        if (option === "cr"){
            return "\r"
        } else if (option === "lf") {
            return "\n"
        } else if (option === "crlf") {
            return "\r\n"
        }
        return this.os.EOL
    }

    private countLines (node : ts.Node) {
        var lineLimit = this.getOptions()[0] as number
        var endOfLine = this.os.EOL 
        if (this.getOptions().length > 1){
            endOfLine = this.getEOL (this.getOptions()[1])
        }
        var findBlock = node.getChildren().find(n => isBlock(n))
        if (findBlock !== undefined) {
            var fullText = findBlock.getFullText() as String
            var index = node.getChildren().indexOf(findBlock)
            var indexNode = node
            var shift = 4
            if (isConstructorDeclaration(node)){
                shift = 3
            }
            if (index > shift) {
                 indexNode = node.getChildAt(index - shift)
            }
            var splitted = fullText.split (endOfLine)
            if (splitted !== undefined && splitted.length > lineLimit){
                this.addFailureFromStartToEnd(indexNode.getFullStart(),findBlock.getFullStart(), FAILURE_STRING(splitted.length, lineLimit))
            }
        }
    }
}