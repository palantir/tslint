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

export class Formatter extends AbstractFormatter {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: IFormatterMetadata = {
        formatterName: "prose",
        description: "The default formatter which outputs simple human-readable messages.",
        sample: "ERROR: myFile.ts[1, 14]: Missing semicolon",
        consumer: "human"
    };
    /* tslint:enable:object-literal-sort-keys */

    public format(failures: RuleFailure[], fixes?: RuleFailure[]): string {
        if (failures.length === 0 && (fixes === undefined || fixes.length === 0)) {
            return "\n";
        }
        failures = this.sortFailures(failures);

        const fixLines: string[] = [];
        if (fixes !== undefined) {
            const perFileFixes = new Map<string, number>();
            for (const fix of fixes) {
                const prevFixes = perFileFixes.get(fix.getFileName());
                perFileFixes.set(fix.getFileName(), (prevFixes !== undefined ? prevFixes : 0) + 1);
            }

            perFileFixes.forEach((fixCount, fixedFile) => {
                fixLines.push(`Fixed ${fixCount} error(s) in ${fixedFile}`);
            });
            fixLines.push(""); // add a blank line between fixes and failures
        }

        const errorLines = failures.map((failure: RuleFailure) => {
            const fileName = failure.getFileName();
            const failureString = failure.getFailure();

            const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            const positionTuple = `[${lineAndCharacter.line + 1}, ${lineAndCharacter.character +
                1}]`;

            return `${failure
                .getRuleSeverity()
                .toUpperCase()}: ${fileName}${positionTuple}: ${failureString}`;
        });

        return `${fixLines.concat(errorLines).join("\n")}\n`;
    }
}
