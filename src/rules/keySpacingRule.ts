/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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

import { getChildOfKind, isBindingElement, isPropertyAssignment } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

type Option = boolean;
type OptionType = "beforeColon" | "afterColon";
type Options = Partial<Record<OptionType, Option>>;

const SPACE_OPTIONS = {
    type: "boolean"
};

/* tslint:disable:object-literal-sort-keys */
const SPACE_OBJECT = {
    type: "object",
    properties: {
        beforeColon: SPACE_OPTIONS,
        afterColon: SPACE_OPTIONS
    },
    additionalProperties: false
};

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "key-spacing",
        description: "Requires or restricts whitespace for property assignments.",
        descriptionDetails: `
            Determines whether a space is required before and/or after a colon in a property assignment.
            Based on \`'typedef-whitespace'\` tslint core rule`,
        optionsDescription: Lint.Utils.dedent`
            Rule accepts an argument of object type with two optional keys \`'beforeColon'\` and \`'afterColon'\`.
        `,
        options: {
            type: "array",
            items: [SPACE_OBJECT],
            addittionalItems: false,
            maxLength: 1
        },
        optionExamples: [
            [
                true,
                {
                    beforeColon: true,
                    afterColon: true
                }
            ]
        ],
        type: "style",
        typescriptOnly: false,
        hasFix: true
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(option: Option, location: "before" | "after"): string {
        return `expected ${option ? "one space" : "no space"} ${location} colon`;
    }

    public apply(sourcefile: ts.SourceFile): Lint.RuleFailure[] {
        const options = this.ruleArguments[0] || { beforeColon: false, afterColon: true };

        return this.applyWithWalker(new KeySpacingWalker(sourcefile, this.ruleName, options));
    }
}

class KeySpacingWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile): {} | void {
        const cb = (node: ts.Node): void => {
            if (isPropertyAssignment(node) || isBindingElement(node)) {
                this.checkSpace(node);
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private checkSpace(
        node: ts.VariableLikeDeclaration | ts.ObjectBindingOrAssignmentPattern
    ): void {
        const { beforeColon, afterColon } = this.options;
        const colon = getChildOfKind(node, ts.SyntaxKind.ColonToken, this.sourceFile);

        if (!colon) {
            return;
        }
        if (beforeColon !== undefined) {
            this.checkBeforeColon(colon.end - 1, beforeColon);
        }
        if (afterColon !== undefined) {
            this.checkAfterColon(colon.end, afterColon);
        }
    }

    private checkBeforeColon(colonStart: number, option: Option): void {
        const { text } = this.sourceFile;
        let currentIndex = colonStart;
        let currentChar = text.charCodeAt(currentIndex - 1);

        if (ts.isLineBreak(currentChar)) {
            return;
        }

        while (ts.isWhiteSpaceSingleLine(currentChar)) {
            currentIndex -= 1;
            currentChar = text.charCodeAt(currentIndex - 1);
        }
        return this.validateRule(currentIndex, colonStart, option, "before");
    }

    private checkAfterColon(colonEnd: number, option: Option): void {
        const { text } = this.sourceFile;
        let currentIndex = colonEnd;
        let currentChar = text.charCodeAt(colonEnd);

        if (ts.isLineBreak(currentChar)) {
            return;
        }

        while (ts.isWhiteSpaceSingleLine(currentChar)) {
            currentIndex += 1;
            currentChar = text.charCodeAt(currentIndex);
        }
        return this.validateRule(colonEnd, currentIndex, option, "after");
    }

    private validateRule(
        start: number,
        end: number,
        option: Option,
        location: "before" | "after"
    ): void {
        if (option) {
            switch (end - start) {
                case 0:
                    this.addFailure(
                        end,
                        end,
                        Rule.FAILURE_STRING(option, location),
                        Lint.Replacement.appendText(end, " ")
                    );
                    break;
                case 1:
                    break;
                default:
                    this.addFailure(
                        start + 1,
                        end,
                        Rule.FAILURE_STRING(option, location),
                        Lint.Replacement.deleteFromTo(start + 1, end)
                    );
            }
        } else if (start !== end) {
            this.addFailure(
                start,
                end,
                Rule.FAILURE_STRING(option, location),
                Lint.Replacement.deleteFromTo(start, end)
            );
        }
    }
}
