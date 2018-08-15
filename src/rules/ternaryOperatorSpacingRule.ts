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

import { getChildOfKind, isConditionalExpression } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

type Option = boolean;
type OptionType = "beforeQuestion" | "afterQuestion" | "beforeColon" | "afterColon";
type Options = Partial<Record<OptionType, Option>>;

const SPACE_OPTIONS = {
    type: "boolean"
};

function splitOptionType(optionType: string): string {
    const [, position, token] = optionType.match(/^(\w+)(Question|Colon)$/)!;

    return `${position} ${token.toLowerCase()}`;
}

/* tslint:disable:object-literal-sort-keys */
const SPACE_OBJECT = {
    type: "object",
    properties: {
        beforeQuestion: SPACE_OPTIONS,
        afterQuestion: SPACE_OPTIONS,
        beforeColon: SPACE_OPTIONS,
        afterColon: SPACE_OPTIONS
    },
    additionalProperties: false
};

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "ternary-operator-spacing",
        description: "Requires or restricts whitespaces for ternary conditional operator.",
        descriptionDetails: `
            Determines whether a space is required before and/or after question and colon tokens
            in ternary conditional operator.
        `,
        optionsDescription: Lint.Utils.dedent`
            Rule accepts an argument of object type with four optional boolean keys:

            * \`'beforeQuestion'\` - determines spacing before question token
            * \`'afterQuestion'\` - determines spacing after question token
            * \`'beforeColon'\` - determines spacing before colon token
            * \`'afterColon'\` - determines spacing after colon token
        `,
        options: {
            type: "array",
            items: [SPACE_OBJECT],
            additionalItems: false,
            maxLength: 1
        },
        optionExamples: [
            [
                true,
                {
                    beforeQuestion: false,
                    afterQuestion: true,
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

    public static FAILURE_MESSAGE(option: Option, optionType: OptionType): string {
        return `expected ${option ? "space" : "no space"} ${splitOptionType(optionType)}`;
    }

    /* tslint:disable:object-literal-sort-keys */
    public apply(sourcefile: ts.SourceFile): Lint.RuleFailure[] {
        const options = this.ruleArguments[0] || {
            beforeQuestion: true,
            afterQuestion: true,
            beforeColon: true,
            afterColon: true
        };

        return this.applyWithWalker(
            new TernaryOperatorSpacingWalker(sourcefile, this.ruleName, options)
        );
    }
    /* tslint:enable:object-literal-sort-keys */
}

class TernaryOperatorSpacingWalker extends Lint.AbstractWalker<Options> {
    public walk(sourcefile: ts.SourceFile): void {
        const cb = (node: ts.Node): void => {
            if (isConditionalExpression(node)) {
                this.checkSpaces(node);
            }
            return ts.forEachChild(node, cb);
        };

        return ts.forEachChild(sourcefile, cb);
    }

    private checkSpaces(node: ts.Node): void {
        const { beforeQuestion, afterQuestion, beforeColon, afterColon } = this.options;
        const question = getChildOfKind(node, ts.SyntaxKind.QuestionToken, this.sourceFile)!;
        const colon = getChildOfKind(node, ts.SyntaxKind.ColonToken, this.sourceFile)!;

        if (beforeQuestion !== undefined) {
            this.checkBefore(question.end - 1, beforeQuestion, "beforeQuestion");
        }
        if (afterQuestion !== undefined) {
            this.checkAfter(question.end, afterQuestion, "afterQuestion");
        }
        if (beforeColon !== undefined) {
            this.checkBefore(colon.end - 1, beforeColon, "beforeColon");
        }
        if (afterColon !== undefined) {
            this.checkAfter(colon.end, afterColon, "afterColon");
        }
    }

    private checkBefore(startIndex: number, option: Option, type: OptionType): void {
        const { text } = this.sourceFile;
        let currentIndex = startIndex;
        let currentChar = text.charCodeAt(currentIndex - 1);

        while (ts.isWhiteSpaceLike(currentChar)) {
            currentIndex -= 1;
            currentChar = text.charCodeAt(currentIndex - 1);
        }
        return this.validateRule(currentIndex, startIndex, option, type);
    }

    private checkAfter(endIndex: number, option: Option, type: OptionType): void {
        const { text } = this.sourceFile;
        let currentIndex = endIndex;
        let currentChar = text.charCodeAt(currentIndex);

        while (ts.isWhiteSpaceLike(currentChar)) {
            currentChar = text.charCodeAt(++currentIndex);
        }
        return this.validateRule(endIndex, currentIndex, option, type);
    }

    private validateRule(
        startIndex: number,
        endIndex: number,
        option: Option,
        type: OptionType
    ): void {
        if (option) {
            switch (endIndex - startIndex) {
                case 0:
                    this.addFailure(
                        endIndex,
                        endIndex,
                        Rule.FAILURE_MESSAGE(option, type),
                        Lint.Replacement.appendText(endIndex, " ")
                    );
            }
        } else if (startIndex !== endIndex) {
            this.addFailure(
                startIndex,
                endIndex,
                Rule.FAILURE_MESSAGE(option, type),
                Lint.Replacement.deleteFromTo(startIndex, endIndex)
            );
        }
    }
}
