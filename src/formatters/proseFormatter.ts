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
import {IFormatterMetadata} from "../language/formatter/formatter";
import {RuleLevel, RuleViolation} from "../language/rule/rule";

export class Formatter extends AbstractFormatter {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: IFormatterMetadata = {
        formatterName: "prose",
        description: "The default formatter which outputs simple human-readable messages.",
        sample: "ERROR: myFile.ts[1, 14]: Missing semicolon",
        consumer: "human",
    };
    /* tslint:enable:object-literal-sort-keys */

    public format(violations: RuleViolation[], fixes?: RuleViolation[]): string {
        if (violations && violations.length === 0 && (!fixes || fixes.length === 0)) {
            return "\n";
        }

        let fixLines: string[] = [];
        if (fixes) {
            let perFileFixes: { [fileName: string]: number } = {};
            for (const fix of fixes) {
                if (perFileFixes[fix.getFileName()] == null) {
                    perFileFixes[fix.getFileName()] = 1;
                } else {
                    perFileFixes[fix.getFileName()]++;
                }
            }

            Object.keys(perFileFixes).forEach((fixedFile: string) => {
                const fixCount = perFileFixes[fixedFile];
                fixLines.push(`Fixed ${fixCount} error(s) in ${fixedFile}`);
            });
            fixLines.push("");   // add a blank line between fixes and failures
        }

        return fixLines.concat(this.mapToMessages(violations))
          .join("\n") + "\n";

    }

    private mapToMessages(violations: RuleViolation[]): string[] {
        return violations.map((violation: RuleViolation) => {
            const fileName = violation.getFileName();
            const failureString = violation.getViolation();

            const lineAndCharacter = violation.getStartPosition().getLineAndCharacter();
            const positionTuple = `[${lineAndCharacter.line + 1}, ${lineAndCharacter.character + 1}]`;

            return `${RuleLevel[violation.getRuleLevel()]}: ${fileName}${positionTuple}: ${failureString}`;
        });

    }
}
