/**
 * @license
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

export class Formatter extends AbstractFormatter {
    public format(failures: RuleFailure[]): string {
        const outputLines = failures.map((failure: RuleFailure) => {
            const fileName = failure.getFileName();
            const failureString = failure.getFailure();
            const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            const line = lineAndCharacter.line + 1;
            const character = lineAndCharacter.character + 1;
            const code = (failure.getRuleName ? failure.getRuleName() : "");
            const properties = `sourcepath=${fileName};linenumber=${line};columnnumber=${character};code=${code};`;

            return `##vso[task.logissue type=warning;${properties}]${failureString}`;
        });

        return outputLines.join("\n") + "\n";
    }
}
