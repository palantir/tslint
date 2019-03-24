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

import codeFrame = require("babel-code-frame");
import chalk from "chalk";

import { AbstractFormatter } from "../language/formatter/abstractFormatter";
import { IFormatterMetadata } from "../language/formatter/formatter";
import { RuleFailure } from "../language/rule/rule";
import * as Utils from "../utils";

export class Formatter extends AbstractFormatter {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: IFormatterMetadata = {
        formatterName: "codeFrame",
        description: "Framed formatter which creates a frame of error code.",
        descriptionDetails: Utils.dedent`
            Prints syntax highlighted code in a frame with a pointer to where
            exactly lint error is happening.`,
        sample: Utils.dedent`
            src/components/Payment.tsx
            Parentheses are required around the parameters of an arrow function definition (arrow-parens)
              21 |     public componentDidMount() {
              22 |         this.input.focus();
            > 23 |         loadStripe().then(Stripe => Stripe.pay());
                 |                          ^
              24 |     }
              25 |
              26 |     public render() {`,
        consumer: "human",
    };
    /* tslint:enable:object-literal-sort-keys */

    public format(failures: RuleFailure[]): string {
        if (typeof failures[0] === "undefined") {
            return "\n";
        }
        failures = this.sortFailures(failures);

        const outputLines: string[] = [];

        let currentFile: string | undefined;

        for (const failure of failures) {
            const fileName = failure.getFileName();

            // Output the name of each file once
            if (currentFile !== fileName) {
                outputLines.push("");
                outputLines.push(fileName);
                currentFile = fileName;
            }

            let failureString = failure.getFailure();
            failureString =
                failure.getRuleSeverity() === "warning"
                    ? chalk.yellow(failureString)
                    : chalk.red(failureString);

            // Rule
            let ruleName = failure.getRuleName();
            ruleName = chalk.gray(`(${ruleName})`);

            // Frame
            const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            const frame = codeFrame(
                failure.getRawLines(),
                lineAndCharacter.line + 1, // babel-code-frame is 1 index
                lineAndCharacter.character,
                {
                    forceColor: chalk.enabled,
                    highlightCode: true,
                },
            );

            // Ouput
            outputLines.push(`${failureString} ${ruleName}`);
            outputLines.push(frame);
            outputLines.push("");
        }

        // Removes initial blank line
        if (outputLines[0] === "") {
            outputLines.shift();
        }

        return `${outputLines.join("\n")}\n`;
    }
}
