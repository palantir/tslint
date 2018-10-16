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

import { getChildOfKind } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

type Option = "nospace" | "onespace" | "space";
type OptionType =
    | "call-signature"
    | "index-signature"
    | "parameter"
    | "property-declaration"
    | "variable-declaration";
type OptionInput = Partial<Record<OptionType, Option>>;
type Options = Partial<Record<"left" | "right", OptionInput>>;

/* tslint:disable:object-literal-sort-keys */
const SPACE_OPTIONS = {
    type: "string",
    enum: ["nospace", "onespace", "space"]
};

const SPACE_OBJECT = {
    type: "object",
    properties: {
        "call-signature": SPACE_OPTIONS,
        "index-signature": SPACE_OPTIONS,
        parameter: SPACE_OPTIONS,
        "property-declaration": SPACE_OPTIONS,
        "variable-declaration": SPACE_OPTIONS
    },
    additionalProperties: false
};

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "typedef-whitespace",
        description: "Requires or disallows whitespace for type definitions.",
        descriptionDetails:
            "Determines if a space is required or not before the colon in a type specifier.",
        optionsDescription: Lint.Utils.dedent`
            Two arguments which are both objects.
            The first argument specifies how much space should be to the _left_ of a typedef colon.
            The second argument specifies how much space should be to the _right_ of a typedef colon.
            Each key should have a value of \`"onespace"\`, \`"space"\` or \`"nospace"\`.
            Possible keys are:

            * \`"call-signature"\` checks return type of functions.
            * \`"index-signature"\` checks index type specifier of indexers.
            * \`"parameter"\` checks function parameters.
            * \`"property-declaration"\` checks object property declarations.
            * \`"variable-declaration"\` checks variable declaration.`,
        options: {
            type: "array",
            items: [SPACE_OBJECT, SPACE_OBJECT],
            additionalItems: false
        },
        optionExamples: [
            [
                true,
                {
                    "call-signature": "nospace",
                    "index-signature": "nospace",
                    parameter: "nospace",
                    "property-declaration": "nospace",
                    "variable-declaration": "nospace"
                },
                {
                    "call-signature": "onespace",
                    "index-signature": "onespace",
                    parameter: "onespace",
                    "property-declaration": "onespace",
                    "variable-declaration": "onespace"
                }
            ]
        ],
        type: "typescript",
        typescriptOnly: true,
        hasFix: true
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(option: string, location: "before" | "after", type: string) {
        return `expected ${option} ${location} colon in ${type}`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const args = this.ruleArguments as Array<OptionInput | undefined>;
        const options = {
            left: args[0],
            right: args[1]
        };
        return this.applyWithWalker(
            new TypedefWhitespaceWalker(sourceFile, this.ruleName, options)
        );
    }
}

class TypedefWhitespaceWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            const optionType = getOptionType(node);
            if (optionType !== undefined) {
                this.checkSpace(
                    node as ts.SignatureDeclaration | ts.VariableLikeDeclaration,
                    optionType
                );
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private checkSpace(
        node: ts.SignatureDeclaration | ts.VariableLikeDeclaration,
        key: OptionType
    ) {
        if (!("type" in node) || node.type === undefined) {
            return;
        }
        const { left, right } = this.options;
        const colon = getChildOfKind(node, ts.SyntaxKind.ColonToken, this.sourceFile)!;
        if (right !== undefined && right[key] !== undefined) {
            this.checkRight(colon.end, right[key]!, key);
        }
        if (left !== undefined && left[key] !== undefined) {
            this.checkLeft(colon.end - 1, left[key]!, key);
        }
    }

    private checkRight(colonEnd: number, option: Option, key: OptionType) {
        let pos = colonEnd;
        const { text } = this.sourceFile;
        let current = text.charCodeAt(pos);
        if (ts.isLineBreak(current)) {
            return;
        }
        while (ts.isWhiteSpaceSingleLine(current)) {
            ++pos;
            current = text.charCodeAt(pos);
        }
        return this.validateWhitespace(colonEnd, pos, option, "after", key);
    }

    private checkLeft(colonStart: number, option: Option, key: OptionType) {
        let pos = colonStart;
        const { text } = this.sourceFile;
        let current = text.charCodeAt(pos - 1);
        while (ts.isWhiteSpaceSingleLine(current)) {
            --pos;
            current = text.charCodeAt(pos - 1);
        }
        if (ts.isLineBreak(current)) {
            return;
        }
        return this.validateWhitespace(pos, colonStart, option, "before", key);
    }

    private validateWhitespace(
        start: number,
        end: number,
        option: Option,
        location: "before" | "after",
        key: OptionType
    ) {
        switch (option) {
            case "nospace":
                if (start !== end) {
                    this.addFailure(
                        start,
                        end,
                        Rule.FAILURE_STRING(option, location, key),
                        Lint.Replacement.deleteFromTo(start, end)
                    );
                }
                break;
            case "space":
                if (start === end) {
                    this.addFailure(
                        end,
                        end,
                        Rule.FAILURE_STRING(option, location, key),
                        Lint.Replacement.appendText(end, " ")
                    );
                }
                break;
            case "onespace":
                switch (end - start) {
                    case 0:
                        this.addFailure(
                            end,
                            end,
                            Rule.FAILURE_STRING(option, location, key),
                            Lint.Replacement.appendText(end, " ")
                        );
                        break;
                    case 1:
                        break;
                    default:
                        this.addFailure(
                            start + 1,
                            end,
                            Rule.FAILURE_STRING(option, location, key),
                            Lint.Replacement.deleteFromTo(start + 1, end)
                        );
                }
        }
    }
}

function getOptionType(node: ts.Node): OptionType | undefined {
    switch (node.kind) {
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.ConstructSignature:
        case ts.SyntaxKind.CallSignature:
            return "call-signature";
        case ts.SyntaxKind.IndexSignature:
            return "index-signature";
        case ts.SyntaxKind.VariableDeclaration:
            return "variable-declaration";
        case ts.SyntaxKind.Parameter:
            return "parameter";
        case ts.SyntaxKind.PropertySignature:
        case ts.SyntaxKind.PropertyDeclaration:
            return "property-declaration";
        default:
            return undefined;
    }
}
