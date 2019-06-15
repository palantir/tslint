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

import { AbstractFormatter } from "../language/formatter/abstractFormatter";
import { IFormatterMetadata } from "../language/formatter/formatter";
import { RuleFailure } from "../language/rule/rule";
import * as Utils from "../utils";

export class Formatter extends AbstractFormatter {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: IFormatterMetadata = {
        formatterName: "tap",
        description: "Formats output as TAP stream.",
        descriptionDetails:
            "Provides error messages output in TAP13 format which can be consumed by any TAP formatter.",
        sample: Utils.dedent`
            TAP version 13
            1..1
            not ok 1 - Some error
              ---
              message: Variable has any type
              severity: error
              data:
                 ruleName: no-any
                 fileName: test-file.ts
                 line: 10
                 character: 10
                 failureString: Some error
                 rawLines: Some raw output
              ...`,
        consumer: "machine",
    };
    /* tslint:enable:object-literal-sort-keys */

    public format(failures: RuleFailure[]): string {
        let output: string[] = ["TAP version 13"];

        output =
            failures.length === 0
                ? output.concat(["1..0 # SKIP No failures"])
                : output.concat([`1..${failures.length}`]).concat(this.mapToMessages(failures));

        return `${output.join("\n")}\n`;
    }

    private mapToMessages(failures: RuleFailure[]): string[] {
        return failures.map((failure: RuleFailure, i: number) => {
            const fileName = failure.getFileName();
            const failureString = failure.getFailure();
            const ruleName = failure.getRuleName();
            const failureMessage = failure.getFailure();
            const failureSeverity = failure.getRuleSeverity();
            const failureRaw = failure.getRawLines();
            const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();

            return Utils.dedent`
                not ok ${String(i + 1)} - ${failureMessage}
                  ---
                  message : ${failureMessage}
                  severity: ${failureSeverity}
                  data:
                    ruleName: ${ruleName}
                    fileName: ${fileName}
                    line: ${String(lineAndCharacter.line)}
                    character: ${String(lineAndCharacter.character)}
                    failureString: ${failureString}
                    rawLines: ${failureRaw}
                  ...`;
        });
    }
}
