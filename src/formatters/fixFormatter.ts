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

import * as fs from "fs";
import {AbstractFormatter} from "../language/formatter/abstractFormatter";
import {IFormatterMetadata} from "../language/formatter/formatter";
import {dedent} from "../utils";
import {Fix, RuleFailure} from "./../language/rule/rule";

export class Formatter extends AbstractFormatter {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: IFormatterMetadata = {
        formatterName: "fix",
        description: "Formats the file passed in returns the formatted source",
        sample: dedent`
        export class FormattedClass {
            public someMethod() {
                return "This class has been formatted";
            }
        }`,
        consumer: "machine",
    };
    /* tslint:enable:object-literal-sort-keys */

    public format(failures: RuleFailure[]): string {
        this.ensureExactlyOneFileInFailuresList(failures);

        const fileName = failures[0].getFileName();
        const fixes = failures.map((f) => f.getFix()).filter((f): f is Fix => !!f) as Fix[];
        const source = fs.readFileSync(fileName, { encoding: "utf-8" });

        return Fix.applyAll(source, fixes);
    }

    public ensureExactlyOneFileInFailuresList(failures: RuleFailure[]) {
        const visitedCache: { [fileName: string]: true } = {};

        for (const failure of failures) {
            const fileName = failure.getFileName();

            if (!(fileName in visitedCache)) {
                visitedCache[fileName] = true;
            }

            if (Object.keys(visitedCache).length > 1) {
                const files = Object.keys(visitedCache);
                const filesFormattedForMsg = files.map((name) => `\t- ${name}`).join("\n");
                const msg = "Only one file can be formatted with the fix formatter. \n\n" +
                            `Attempted to format files:\n ${filesFormattedForMsg}`;
                throw new Error(msg);
            }
        }

        if (Object.keys(visitedCache).length !== 1) {
            throw new Error("Must have exactly one file with failures to apply Fix formatter.");
        }
    }
}
