/**
* @license
* Copyright 2017 Palantir Technologies, Inc.
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
 
import { getPreviousStatement, isBlock, isClassDeclaration, isFunctionWithBody, getChildOfKind } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";
 
enum OptionState {
    always = "always",
    ignore = "ignore",
    never = "never",
}
 
const ALWAYS_IGNORE_OR_NEVER = {
    enum: OptionState,
    type: "string",
};
 
type OptionName = "return" | "class" | "functionBlock" | "block";
const optionNames: OptionName[] = ["return", "class", "functionBlock", "block"];
type Option = "always" | "ignore" | "never";
type Options = Partial<Record<OptionName, Option>>;
 
function parseOptions(json: Option | Options | undefined): Options {
    const options: Options = { };
    for (const optionName of optionNames) {
        options[optionName] = typeof json === "object" ? json[optionName] : json === undefined ? "always" : json;
    }
    return options;
}
 
export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "newline",
        description: "Requires or disallows blank lines before return, after class declaration, function block declaration or block.",
        rationale: "Helps maintain a readable style in your codebase.",
        optionsDescription: Lint.Utils.dedent`
            Following arguments may be optionally provided:
 
            * \`"return"\` checks for empty line before return when not the only line in the block.
            * \`"class"\` checks for empty line after class declaration.
            * \`"functionBlock"\` checks for empty line after function block declaration.
            * \`"block"\` checks for empty line after block declaration.`,
        options: {
            properties: {
                return: ALWAYS_IGNORE_OR_NEVER,
                class: ALWAYS_IGNORE_OR_NEVER,
                functionBlock: ALWAYS_IGNORE_OR_NEVER,
                block: ALWAYS_IGNORE_OR_NEVER,
            },
            type: "object",
        },
        optionExamples: [[true, {return: "always", class: "never"}]],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
 
    public static FAILURE_STRING_FACTORY(kind: boolean, nodeType: string) {
        const kindMsg = kind ? 'Missing' : 'Unneeded';
        return `${kindMsg} blank line before ${nodeType}`;
    }
 
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NewlineWalker(sourceFile, this.ruleName, parseOptions(this.ruleArguments[0] as Option | Options | undefined)));
    }
}
 
class NewlineWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (node.kind === ts.SyntaxKind.ReturnStatement && this.options.return != OptionState.ignore) {
                const prev = getPreviousStatement(node as ts.Statement);
                if (prev === undefined) {
                    // return is not within a block (e.g. the only child of an IfStatement) or the first statement of the block
                    // no need to check for preceding newline
                    return;
                }
 
                this.checkForEmptyLine(prev, node, this.options.return == OptionState.always, 'return');
            }
 
            if (isClassDeclaration(node) && this.options.class != OptionState.ignore) {
                this.checkForEmptyLine(
                    getChildOfKind(node, ts.SyntaxKind.OpenBraceToken, this.sourceFile)!, node.members[0],
                    this.options.class == OptionState.always, 'first member',
                );
            }
 
            if (isBlock(node) &&
                    (isFunctionWithBody(node.parent!) && this.options.functionBlock != OptionState.ignore
                        || this.options.block != OptionState.ignore)) {
                this.checkForEmptyLine(
                    node.getChildAt(0), node.statements[0], this.options.functionBlock == OptionState.always, 'first statement',
                );
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }
 
    private checkForEmptyLine(node: ts.Node, firstNode: ts.Node, lineRequired: boolean, nodeType: string) {
        let start = node.end;
        let line = ts.getLineAndCharacterOfPosition(this.sourceFile, start).line;
        let firstNodeStart = firstNode.getStart();
        let firstLine = ts.getLineAndCharacterOfPosition(this.sourceFile, firstNodeStart).line;
        const comments = ts.getLeadingCommentRanges(this.sourceFile.text, firstNode.pos);
 
        if (comments !== undefined) {
            // check for blank lines between comments
            for (let i = comments.length - 1; i >= 0; --i) {
                const endLine = ts.getLineAndCharacterOfPosition(this.sourceFile, comments[i].end).line;
                if (endLine < firstLine - 1) {
                    // found empty line between nodes
                    start = comments[i].end;
                    firstLine = ts.getLineAndCharacterOfPosition(this.sourceFile, firstNodeStart).line;
                    break;
                }
 
                firstNodeStart = comments[i].pos;
                firstLine = ts.getLineAndCharacterOfPosition(this.sourceFile, firstNodeStart).line;
            }
        }
 
        if (!lineRequired && line + 1 < firstLine) {
            this.addFailure(
                start + 1, ts.getPositionOfLineAndCharacter(this.sourceFile, firstLine, 0) - 1,
                Rule.FAILURE_STRING_FACTORY(lineRequired, nodeType)
            );
        } else if (lineRequired && line + 1 == firstLine) {
            const pos = ts.getPositionOfLineAndCharacter(this.sourceFile, firstLine, 0);
            this.addFailure(pos, pos, Rule.FAILURE_STRING_FACTORY(lineRequired, nodeType));
        }
    }
}
