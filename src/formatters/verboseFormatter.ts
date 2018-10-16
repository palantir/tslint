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
        formatterName: "verbose",
        description: "The human-readable formatter which includes the rule name in messages.",
        descriptionDetails:
            "The output is the same as the prose formatter with the rule name included",
        sample: "ERROR: (semicolon) myFile.ts[1, 14]: Missing semicolon",
        consumer: "human"
    };
    /* tslint:enable:object-literal-sort-keys */

    public format(failures: RuleFailure[]): string {
        failures = this.sortFailures(failures);
        return `${this.mapToMessages(failures).join("\n")}\n`;
    }

    private mapToMessages(failures: RuleFailure[]): string[] {
        return failures.map((failure: RuleFailure) => {
            const fileName = failure.getFileName();
            const failureString = failure.getFailure();
            const ruleName = failure.getRuleName();

            const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            const positionTuple = `[${lineAndCharacter.line + 1}, ${lineAndCharacter.character +
                1}]`;

            return `${failure
                .getRuleSeverity()
                .toUpperCase()}: (${ruleName}) ${fileName}${positionTuple}: ${failureString}`;
        });
    }
}
