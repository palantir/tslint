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

import {AbstractFormatter} from "../language/formatter/abstractFormatter";
import {RuleFailure} from "../language/rule/rule";

import * as colors from "colors";

export class Formatter extends AbstractFormatter {
    public getHeader(): string {
        return ``;
    }

    public getFooter(): string {
        return ``;
    }

    public format(failures: RuleFailure[]): string {
        if (typeof failures[0] === "undefined") {
            return "\n";
        }

        const fileName        = failures[0].getFileName();
        const positionMaxSize = this.getPositionMaxSize(failures);
        const ruleMaxSize     = this.getRuleMaxSize(failures);

        const outputLines = [
            fileName,
        ];

        for (const failure of failures) {
            const failureString = failure.getFailure();

            // Rule
            let ruleName = failure.getRuleName();
            ruleName     = this.pad(ruleName, ruleMaxSize);
            ruleName     = colors.yellow(ruleName);

            // Lines
            const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();

            let positionTuple = `${lineAndCharacter.line + 1}:${lineAndCharacter.character + 1}`;
            positionTuple     = this.pad(positionTuple, positionMaxSize);
            positionTuple     = colors.red(positionTuple);

            // Ouput
            const output = `${positionTuple}  ${ruleName}  ${failureString}`;

            outputLines.push(output);
        }

        return outputLines.join("\n") + "\n\n";
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
