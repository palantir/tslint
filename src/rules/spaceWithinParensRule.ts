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

const OPTION_SPACE_SIZE_0 = 0;
const OPTION_SPACE_SIZE_1 = 1;

interface Options {
    size: number;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "space-within-parens",
        description: "Enforces spaces within parentheses or disallow them.",
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
            You may enforce the amount of whitespace within parentheses.
        `,
        options: {
            type: "array",
            items: [
                {
                    type: "number",
                    enum: [OPTION_SPACE_SIZE_0, OPTION_SPACE_SIZE_1],
                },
            ],
            minLength: 0,
            maxLength: 4,
        },
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_NO_SPACE = "No space within parentheses";
    public static FAILURE_NEEDS_SPACE = "Needs space within parentheses";
    public static FAILURE_NO_EXTRA_SPACE(count: number): string {
        return `No more than ${count} space within parentheses allowed`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new SpaceWhitinParensWalker(sourceFile, this.ruleName, parseOptions(this.ruleArguments[0])));
    }
}

function parseOptions(whitespaceSize: number): Options {
    let size = 0;
    if (typeof whitespaceSize === 'number') {
        size = whitespaceSize;
    } else {
        const parsedSize = parseInt(whitespaceSize, 10);
        if (!isNaN(parsedSize)) {
            size = parsedSize;
        }
    }
    return {
        size,
    };
}

class SpaceWhitinParensWalker extends Lint.AbstractWalker<Options> {
    private openingParenRegex = /^([^\(]*\()( *)[^\n\r]*$/m;
    private closingParenRegex = /([^\s])(\s*)\)$/;

    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            this.checkNode(node);
            ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private getOpenParenToken(node: ts.Node): ts.Node | undefined {
        return Lint.childOfKind(node, ts.SyntaxKind.OpenParenToken);
    }

    private getCloseParenToken(node: ts.Node): ts.Node | undefined {
        return Lint.childOfKind(node, ts.SyntaxKind.CloseParenToken);
    }

    private checkNode(node: ts.Node): void {
        let child: ts.Node | undefined;
        if ((child = this.getOpenParenToken(node)) !== undefined) {
            this.checkOpenParenToken(child);
        }
        if ((child = this.getCloseParenToken(node)) !== undefined) {
            this.checkCloseParenToken(child);
        }
    }

    private checkOpenParenToken(node: ts.Node) {
        const code = this.sourceFile.text.substr(node.getFullStart());
        const matchResult = this.openingParenRegex.exec(code);
        if (matchResult) {
            const whitespace = matchResult[2];
            const whitespaceLength = whitespace.length;
            if (whitespaceLength !== this.options.size) {
                const skipChars = matchResult[1].length;
                let length = whitespaceLength;
                let position = node.getFullStart() + skipChars;
                if (length > this.options.size) {
                    length -= this.options.size;
                    position += this.options.size;
                }
                this.checkAndAddFailureAt(position, length, whitespaceLength);
            }
        }
    }

    private checkCloseParenToken(node: ts.Node) {
        const code = this.sourceFile.text.substring(node.getFullStart() - 20, node.getEnd());
        const matchResult = this.closingParenRegex.exec(code);
        if (matchResult) {
            const whitespace = matchResult[2];
            const whitespaceLength = whitespace.length;
            if (whitespaceLength !== this.options.size) {
                let length = whitespaceLength;
                const position = node.getEnd() - 1 - whitespaceLength;
                if (length > this.options.size) {
                    length -= this.options.size;
                }
                this.checkAndAddFailureAt(position, length, whitespaceLength);
            }
        }
    }

    private checkAndAddFailureAt(position: number, length: number, spaceCount: number = 0) {
        if (this.failures.some(f => f.getStartPosition().getPosition() === position)) {
            return;
        }
        let lintMsg: string | undefined;
        let lintFix: Lint.Replacement | undefined;

        if (this.options.size === 0) {
            lintMsg = Rule.FAILURE_NO_SPACE;
            lintFix = Lint.Replacement.deleteText(position, length);
        } else if (this.options.size > 0 && length === spaceCount) {
            lintMsg = Rule.FAILURE_NEEDS_SPACE;
            lintFix = Lint.Replacement.appendText(position, " ");
        } else if (this.options.size > 0 && length < spaceCount) {
            lintMsg = Rule.FAILURE_NO_EXTRA_SPACE(this.options.size);
            lintFix = Lint.Replacement.deleteText(position, spaceCount - this.options.size);
        }

        if (lintMsg) {
            this.addFailureAt(position, length, lintMsg, lintFix);
        }
    }
}
