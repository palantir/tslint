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
import * as Utils from "../utils";

export class Formatter extends AbstractFormatter {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: IFormatterMetadata = {
        formatterName: "json",
        description: "Formats errors as simple JSON.",
        sample: Utils.dedent`
        [
            {
                "endPosition": {
                    "character": 13,
                    "line": 0,
                    "position": 13
                },
                "failure": "Missing semicolon",
                "fix": {
                    "innerStart": 13,
                    "innerLength": 0,
                    "innerText": ";"
                },
                "name": "myFile.ts",
                "ruleName": "semicolon",
                "startPosition": {
                    "character": 13,
                    "line": 0,
                    "position": 13
                }
            }
        ]`,
        consumer: "machine",
    };
    /* tslint:enable:object-literal-sort-keys */

    public format(failures: RuleFailure[]): string {
        const failuresJSON = failures.map(failure => failure.toJson());
        return JSON.stringify(failuresJSON);
    }
}
