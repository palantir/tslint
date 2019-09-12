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

import { isNumericLiteral } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { isUpperCase } from "../utils";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "number-literal-format",
        hasFix: true,
        description:
            "Checks that decimal literals should begin with '0.' instead of just '.', and should not end with a trailing '0'.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        rationale: Lint.Utils.dedent`
            Helps keep a consistent style with numeric literals.
            Non-standard literals are more difficult to scan through and can be a symptom of typos.
        `,
        type: "formatting",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_LEADING_0 = "Number literal should not have a leading '0'.";
    public static FAILURE_STRING_TRAILING_0 = "Number literal should not have a trailing '0'.";
    public static FAILURE_STRING_TRAILING_DECIMAL = "Number literal should not end in '.'.";
    public static FAILURE_STRING_LEADING_DECIMAL =
        "Number literal should begin with '0.' and not just '.'.";
    public static FAILURE_STRING_NOT_UPPERCASE = "Hexadecimal number literal should be uppercase.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext): void {
    const { sourceFile } = ctx;
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (isNumericLiteral(node)) {
            return check(node);
        }
        return ts.forEachChild(node, cb);
    });

    function check(node: ts.NumericLiteral): void {
        // Apparently the number literal '0.0' has a '.text' of '0', so use '.getText()' instead.
        const text = node.getText(sourceFile);
        const start = node.getStart();

        if (text.length <= 1) {
            return;
        }

        if (text.startsWith("0")) {
            // Hex/octal/binary number can't have decimal point or exponent, so no other errors possible.
            switch (text[1]) {
                case "x":
                    // strip "0x"
                    const hexNumber = text.slice(2);
                    if (!isUpperCase(hexNumber)) {
                        ctx.addFailureAtNode(
                            node,
                            Rule.FAILURE_STRING_NOT_UPPERCASE,
                            Lint.Replacement.replaceNode(node, `0x${hexNumber.toUpperCase()}`),
                        );
                    }
                    return;
                case "o":
                case "b":
                    return;
                case ".":
                    break;
                default:
                    ctx.addFailureAtNode(
                        node,
                        Rule.FAILURE_STRING_LEADING_0,
                        Lint.Replacement.deleteFromTo(start, start + /^0+/.exec(text)![0].length),
                    );
                    return;
            }
        }

        const [num, exp = ""] = text.split(/e/i);
        const [integer, float = ""] = num.split(".");
        const matchedNumeric = /(\.)(\d*?)(0+)$/.exec(num);
        const [dot = "", numbers = "", zeroes = ""] = Array.isArray(matchedNumeric)
            ? matchedNumeric.slice(1)
            : [];

        if (exp.startsWith("-0") || exp.startsWith("0")) {
            const expStart = start + num.length + 1; // position of exp part
            const expNumberStart = /\D/.test(exp.charAt(0)) ? expStart + 1 : expStart; // do not remove "-" or "+"
            ctx.addFailureAt(
                node.getEnd() - exp.length,
                exp.length,
                Rule.FAILURE_STRING_LEADING_0,
                Lint.Replacement.deleteFromTo(
                    expNumberStart,
                    expNumberStart + /0+/.exec(exp)![0].length,
                ),
            );
        }

        if (!num.includes(".")) {
            return;
        }

        if (num.startsWith(".")) {
            // .1 -> 0.1
            fail(Rule.FAILURE_STRING_LEADING_DECIMAL, Lint.Replacement.appendText(start, "0"));
        } else if (num.endsWith(".")) {
            // 1. -> 1
            fail(
                Rule.FAILURE_STRING_TRAILING_DECIMAL,
                Lint.Replacement.deleteText(start + num.length - 1, 1),
            );
        }

        // Allow '10', but not '1.0'
        if (float.endsWith("0")) {
            // 1.0 -> 1
            const offset = numbers.length > 0 ? dot.length + numbers.length : 0;
            const length = (numbers.length > 0 ? 0 : dot.length) + zeroes.length;
            fail(
                Rule.FAILURE_STRING_TRAILING_0,
                Lint.Replacement.deleteText(start + integer.length + offset, length),
            );
        }

        function fail(message: string, fix?: Lint.Replacement | Lint.Replacement[]): void {
            ctx.addFailureAt(node.getStart(sourceFile), num.length, message, fix);
        }
    }
}
