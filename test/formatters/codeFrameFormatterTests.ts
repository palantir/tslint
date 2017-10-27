/*
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

import { assert } from "chai";
import * as chalk from "chalk";

import * as ts from "typescript";

import { IFormatter, TestUtils } from "../lint";
import { createFailure } from "./utils";

describe("CodeFrame Formatter", () => {
    const TEST_FILE = "formatters/codeFrameFormatter.test.ts";
    let sourceFile: ts.SourceFile;
    let formatter: IFormatter;

    before(() => {
        (chalk as any).enabled = true;
        const Formatter = TestUtils.getFormatter("codeFrame");
        sourceFile = TestUtils.getSourceFile(TEST_FILE);
        formatter = new Formatter();
    });

    it("formats failures", () => {
        const maxPosition = sourceFile.getFullWidth();

        const failures = [
            createFailure(sourceFile, 0, 1, "first failure", "first-name", undefined, "error"),
            createFailure(sourceFile, 2, 3, "&<>'\" should be escaped", "escape", undefined, "error"),
            createFailure(sourceFile, maxPosition - 1, maxPosition, "last failure", "last-name", undefined, "error"),
            createFailure(sourceFile, 0, maxPosition, "full failure", "full-name", undefined, "error"),
            createFailure(sourceFile, 0, maxPosition, "warning failure", "warning-name", undefined, "warning"),
        ];

        const expectedResultPlain =
            `formatters/codeFrameFormatter.test.ts
            first failure (first-name)
            > 1 | module CodeFrameModule {
            2 |     export class CodeFrameClass {
            3 |         private name: string;
            4 |

            &<>'" should be escaped (escape)
            > 1 | module CodeFrameModule {
                |  ^
            2 |     export class CodeFrameClass {
            3 |         private name: string;
            4 |

            last failure (last-name)
            7 |         }
            8 |     }
            >  9 | }
                | ^
            10 |

            full failure (full-name)
            > 1 | module CodeFrameModule {
            2 |     export class CodeFrameClass {
            3 |         private name: string;
            4 |

        `;

        const expectedResultColored =
            `formatters/codeFrameFormatter.test.ts
            \u001b[31m\u001b[1mfirst failure\u001b[22m\u001b[39m \u001b[90m(first-name)\u001b[39m
            \u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 1 | \u001b[39mmodule \u001b[33mCodeFrameModule\u001b[39m {
            \u001b[90m 2 | \u001b[39m    \u001b[36mexport\u001b[39m \u001b[36mclass\u001b[39m \u001b[33mCodeFrameClass\u001b[39m {
            \u001b[90m 3 | \u001b[39m        private name\u001b[33m:\u001b[39m string\u001b[33m;\u001b[39m
            \u001b[90m 4 | \u001b[39m\u001b[0m

            \u001b[31m\u001b[1mfull failure\u001b[22m\u001b[39m \u001b[90m(full-name)\u001b[39m
            \u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 1 | \u001b[39mmodule \u001b[33mCodeFrameModule\u001b[39m {
            \u001b[90m 2 | \u001b[39m    \u001b[36mexport\u001b[39m \u001b[36mclass\u001b[39m \u001b[33mCodeFrameClass\u001b[39m {
            \u001b[90m 3 | \u001b[39m        private name\u001b[33m:\u001b[39m string\u001b[33m;\u001b[39m
            \u001b[90m 4 | \u001b[39m\u001b[0m

            \u001b[33m\u001b[1mwarning failure\u001b[22m\u001b[39m \u001b[90m(warning-name)\u001b[39m
            \u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 1 | \u001b[39mmodule \u001b[33mCodeFrameModule\u001b[39m {
            \u001b[90m 2 | \u001b[39m    \u001b[36mexport\u001b[39m \u001b[36mclass\u001b[39m \u001b[33mCodeFrameClass\u001b[39m {
            \u001b[90m 3 | \u001b[39m        private name\u001b[33m:\u001b[39m string\u001b[33m;\u001b[39m
            \u001b[90m 4 | \u001b[39m\u001b[0m

            \u001b[31m\u001b[1m&<>'\" should be escaped\u001b[22m\u001b[39m \u001b[90m(escape)\u001b[39m
            \u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 1 | \u001b[39mmodule \u001b[33mCodeFrameModule\u001b[39m {
            \u001b[90m   | \u001b[39m \u001b[31m\u001b[1m^\u001b[22m\u001b[39m
            \u001b[90m 2 | \u001b[39m    \u001b[36mexport\u001b[39m \u001b[36mclass\u001b[39m \u001b[33mCodeFrameClass\u001b[39m {
            \u001b[90m 3 | \u001b[39m        private name\u001b[33m:\u001b[39m string\u001b[33m;\u001b[39m
            \u001b[90m 4 | \u001b[39m\u001b[0m

            \u001b[31m\u001b[1mlast failure\u001b[22m\u001b[39m \u001b[90m(last-name)\u001b[39m
            \u001b[0m \u001b[90m  7 | \u001b[39m        }
            \u001b[90m  8 | \u001b[39m    }
            \u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m  9 | \u001b[39m}
            \u001b[90m    | \u001b[39m\u001b[31m\u001b[1m^\u001b[22m\u001b[39m
            \u001b[90m 10 | \u001b[39m\u001b[0m

        `;

        /** Convert output lines to an array of trimmed lines for easier comparing */
        function toTrimmedLines(lines: string): string[] {
            return lines.split("\n").map((line) => line.trim());
        }

        const expectedResult = toTrimmedLines(chalk.enabled ? expectedResultColored : expectedResultPlain);
        const result = toTrimmedLines(formatter.format(failures));

        assert.deepEqual(result, expectedResult);
    });

    it("handles no failures", () => {
        const result = formatter.format([]);
        assert.equal(result, "\n");
    });
});
