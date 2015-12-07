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
import {RuleFailure} from "../language/rule/rule";

export class Formatter extends AbstractFormatter {
    public format(failures: RuleFailure[]): string {
        let output = "<pmd version=\"tslint\">";

        for (let failure of failures) {
            const failureString = failure.getFailure()
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/'/g, "&#39;")
                .replace(/"/g, "&quot;");

            const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();

            output += "<file name=\"" + failure.getFileName();
            output += "\"><violation begincolumn=\"" + (lineAndCharacter.character + 1);
            output += "\" beginline=\"" + (lineAndCharacter.line + 1);
            output += "\" priority=\"1\"";
            output += " rule=\"" + failureString + "\"> </violation></file>";
        }

        output += "</pmd>";
        return output;
    }
}
