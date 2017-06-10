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

import { AbstractFormatter } from "../language/formatter/abstractFormatter";
import { IFormatterMetadata } from "../language/formatter/formatter";
import { RuleFailure } from "../language/rule/rule";

import * as colors from "colors";

import * as Utils from "../utils";

export class Formatter extends AbstractFormatter {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: IFormatterMetadata = {
        formatterName: "stylish",
        description: "Human-readable formatter which creates stylish messages.",
        descriptionDetails: Utils.dedent`
            The output matches that produced by eslint's stylish formatter. Its readability
            enhanced through spacing and colouring`,
        sample: Utils.dedent`
        myFile.ts
        1:14  semicolon  Missing semicolon`,
        consumer: "human",
    };
    /* tslint:enable:object-literal-sort-keys */

    public format(failures: RuleFailure[]): string {
        const outputLines = this.mapToMessages(failures);

        // Removes initial blank line
        if (outputLines[0] === "") {
            outputLines.shift();
        }

        return `${outputLines.join("\n")}\n`;
    }

    private mapToMessages(failures: RuleFailure[]): string[] {
        if (failures.length === 0) {
            return [];
        }
        const outputLines: string[] = [];
        const positionMaxSize       = this.getPositionMaxSize(failures);
        const ruleMaxSize           = this.getRuleMaxSize(failures);

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
            failureString     = colors.yellow(failureString);

            // Rule
            let ruleName = failure.getRuleName();
            ruleName     = this.pad(ruleName, ruleMaxSize);
            ruleName     = colors.grey(ruleName);

            // Lines
            const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();

            let positionTuple = `${lineAndCharacter.line + 1}:${lineAndCharacter.character + 1}`;
            positionTuple = this.pad(positionTuple, positionMaxSize);

            positionTuple = failure.getRuleSeverity() === "warning"
                ? colors.blue(`${failure.getRuleSeverity().toUpperCase()}: ${positionTuple}`)
                : colors.red(`${failure.getRuleSeverity().toUpperCase()}: ${positionTuple}`);

            // Output
            const output = `${positionTuple}  ${ruleName}  ${failureString}`;

            outputLines.push(output);
        }
        return outputLines;
    }

    private pad(str: string, len: number): string {
        const padder = Array(len + 1).join(" ");

        return (str + padder).substring(0, padder.length);
    }

    private getPositionMaxSize(failures: RuleFailure[]): number {
        let positionMaxSize = 0;

        for (const failure of failures) {
            const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();

            const positionSize = `${lineAndCharacter.line + 1}:${lineAndCharacter.character + 1}`.length;

            if (positionSize > positionMaxSize) {
                positionMaxSize = positionSize;
            }
        }

        return positionMaxSize;
    }

    private getRuleMaxSize(failures: RuleFailure[]): number {
        let ruleMaxSize = 0;

        for (const failure of failures) {
            const ruleSize = failure.getRuleName().length;

            if (ruleSize > ruleMaxSize) {
                ruleMaxSize = ruleSize;
            }
        }

        return ruleMaxSize;
    }
}
