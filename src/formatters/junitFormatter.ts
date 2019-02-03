/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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
        formatterName: "junit",
        description: "Formats errors as though they were JUnit output.",
        descriptionDetails: Utils.dedent`
            Imitates the JUnit XML Output`,
        sample: Utils.dedent`
        <?xml version="1.0" encoding="utf-8"?>
        <testsuites package="tslint">
          <testsuite name="myFile.ts">
            <testcase name="semicolon" classname="myFile.ts">
              <failure type="warning">Missing semicolon Line 1, Column 14</failure>
            </testcase>
          </testsuite>
        </testsuites>
        `,
        consumer: "machine",
    };
    /* tslint:enable:object-literal-sort-keys */

    public format(failures: RuleFailure[]): string {
        let output = '<?xml version="1.0" encoding="utf-8"?><testsuites package="tslint">';

        if (failures.length !== 0) {
            const failuresSorted = failures.sort((a, b) =>
                a.getFileName().localeCompare(b.getFileName()),
            );
            let previousFilename: string | null = null;
            for (const failure of failuresSorted) {
                const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
                const message = this.escapeXml(failure.getFailure());
                const rule = this.escapeXml(failure.getRuleName());
                const severity = failure.getRuleSeverity();

                if (failure.getFileName() !== previousFilename) {
                    if (previousFilename !== null) {
                        output += "</testsuite>";
                    }
                    previousFilename = failure.getFileName();
                    output += `<testsuite name="${this.escapeXml(failure.getFileName())}">`;
                }

                output += `<testcase name="${rule}" `;
                output += `classname="${this.escapeXml(failure.getFileName())}">`;
                output += `<failure type="${severity}">${message} `;
                output += `Line ${lineAndCharacter.line + 1}, `;
                output += `Column ${lineAndCharacter.character + 1}`;
                output += `</failure>`;
                output += "</testcase>";
            }
            if (previousFilename !== null) {
                output += "</testsuite>";
            }
        }

        output += "</testsuites>";
        return output;
    }

    private escapeXml(str: string): string {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/'/g, "&#39;")
            .replace(/"/g, "&quot;");
    }
}
