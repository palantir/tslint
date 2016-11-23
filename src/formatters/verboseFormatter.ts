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
import {RuleFailure, RuleLevel} from "../language/rule/rule";

export class Formatter extends AbstractFormatter {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: IFormatterMetadata = {
        formatterName: "verbose",
        description: "The human-readable formatter which includes the rule name in messages.",
        descriptionDetails: "The output is the same as the prose formatter with the rule name included",
        sample: "ERROR: (semicolon) myFile.ts[1, 14]: Missing semicolon",
        consumer: "human",
    };
    /* tslint:enable:object-literal-sort-keys */

    public format(violations: RuleFailure[]): string {

        return this.mapToMessages(violations)
            .join("\n") + "\n";
    }

    private mapToMessages(violations: RuleFailure[]): string[] {
        return violations.map((violation: RuleFailure) => {
            const fileName = violation.getFileName();
            const failureString = violation.getViolation();
            const ruleName = violation.getRuleName();

            const lineAndCharacter = violation.getStartPosition().getLineAndCharacter();
            const positionTuple = "[" + (lineAndCharacter.line + 1) + ", " + (lineAndCharacter.character + 1) + "]";

            return `${RuleLevel[violation.getRuleLevel()]}: (${ruleName}) ${fileName}${positionTuple}: ${failureString}`;
        });

    }
}
