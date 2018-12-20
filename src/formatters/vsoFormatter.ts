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
        formatterName: "vso",
        description: "Formats output as VSO/TFS logging commands.",
        descriptionDetails: Utils.dedent`
            Integrates with Azure DevOps (previously known as Visual Studio Online, Team Foundation Server,
            or Visual Studio Team Services) by outputting errors as 'warning' logging commands.`,
        sample:
            "##vso[task.logissue type=warning;sourcepath=myFile.ts;linenumber=1;columnnumber=14;code=semicolon;]Missing semicolon",
        consumer: "machine",
    };
    /* tslint:enable:object-literal-sort-keys */

    public format(failures: RuleFailure[]): string {
        const outputLines = failures.map((failure: RuleFailure) => {
            const fileName = failure.getFileName();
            const failureString = failure.getFailure();
            const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            const line = lineAndCharacter.line + 1;
            const character = lineAndCharacter.character + 1;
            const code = failure.getRuleName();
            const properties = `sourcepath=${fileName};linenumber=${line};columnnumber=${character};code=${code};`;

            return `##vso[task.logissue type=warning;${properties}]${failureString}`;
        });

        return `${outputLines.join("\n")}\n`;
    }
}
