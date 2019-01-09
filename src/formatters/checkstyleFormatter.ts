/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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
            Imitates the XMLLogger from Checkstyle 4.3. All failures have the 'warning' severity. Files without errors are still included.`,
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

    public format(failures: RuleFailure[], _fixes: RuleFailure[], fileNames: string[]): string {
        const groupedFailures: { [k: string]: RuleFailure[] } = {};
        for (const failure of failures) {
            const fileName = failure.getFileName();
            if (groupedFailures[fileName] !== undefined) {
                groupedFailures[fileName].push(failure);
            } else {
                groupedFailures[fileName] = [failure];
            }
        }

        const formattedFiles = fileNames.map(fileName => {
            const formattedFailures =
                groupedFailures[fileName] !== undefined
                    ? groupedFailures[fileName].map(f => this.formatFailure(f))
                    : [];
            const joinedFailures = formattedFailures.join(""); // may be empty
            return `<file name="${this.escapeXml(fileName)}">${joinedFailures}</file>`;
        });
        const joinedFiles = formattedFiles.join("");
        return `<?xml version="1.0" encoding="utf-8"?><checkstyle version="4.3">${joinedFiles}</checkstyle>`;
    }

    private formatFailure(failure: RuleFailure): string {
        const line = failure.getStartPosition().getLineAndCharacter().line + 1;
        const column = failure.getStartPosition().getLineAndCharacter().character + 1;
        const severity = failure.getRuleSeverity();
        const message = this.escapeXml(failure.getFailure());
        // checkstyle parser wants "source" to have structure like <anything>dot<category>dot<type>
        const source = `failure.tslint.${this.escapeXml(failure.getRuleName())}`;

        return `<error line="${line}" column="${column}" severity="${severity}" message="${message}" source="${source}" />`;
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
