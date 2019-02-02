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
        formatterName: "checkstyle",
        description: "Formats errors as though they were Checkstyle output.",
        descriptionDetails: Utils.dedent`
            Imitates the XMLLogger from Checkstyle 4.3. All failures have the 'warning' severity.`,
        sample: Utils.dedent`
        <?xml version="1.0" encoding="utf-8"?>
        <checkstyle version="4.3">
            <file name="myFile.ts">
                <error line="1" column="14" severity="warning" message="Missing semicolon" source="failure.tslint.semicolon" />
            </file>
        </checkstyle>`,
        consumer: "machine",
    };
    /* tslint:enable:object-literal-sort-keys */

    public format(failures: RuleFailure[]): string {
        let output = '<?xml version="1.0" encoding="utf-8"?><checkstyle version="4.3">';

        if (failures.length !== 0) {
            const failuresSorted = failures.sort((a, b) =>
                a.getFileName().localeCompare(b.getFileName()),
            );
            let previousFilename: string | null = null;
            for (const failure of failuresSorted) {
                const severity = failure.getRuleSeverity();
                if (failure.getFileName() !== previousFilename) {
                    if (previousFilename !== null) {
                        output += "</file>";
                    }
                    previousFilename = failure.getFileName();
                    output += `<file name="${this.escapeXml(failure.getFileName())}">`;
                }
                output += `<error line="${failure.getStartPosition().getLineAndCharacter().line +
                    1}" `;
                output += `column="${failure.getStartPosition().getLineAndCharacter().character +
                    1}" `;
                output += `severity="${severity}" `;
                output += `message="${this.escapeXml(failure.getFailure())}" `;
                // checkstyle parser wants "source" to have structure like <anything>dot<category>dot<type>
                output += `source="failure.tslint.${this.escapeXml(failure.getRuleName())}" />`;
            }
            if (previousFilename !== null) {
                output += "</file>";
            }
        }

        output += "</checkstyle>";
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
