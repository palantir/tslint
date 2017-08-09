/*
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

import * as colors from "colors";
import * as glob from "glob";
import * as path from "path";

import { consoleTestResultHandler, runTest } from "../src/test";

/* tslint:disable:no-console */
console.log();
console.log(colors.underline("Testing Lint Rules:"));

const testDirectories = glob.sync("test/rules/**/tslint.json").map(path.dirname);
const rule: string = process.argv[2];

if (rule !== undefined) {
    const directories = testDirectories.filter(
        (directory: string) =>
            rule.toLowerCase() === directory.split("/")[2].toLowerCase(),
    );
    if (directories.length === 0) {
        console.log(`Sorry, no rules found by the name "${rule}"... Exiting status 0.`);
        process.exit(0);
    }
    const start: number = Date.now();
    for (const testDirectory of directories) {
        const results = runTest(testDirectory);
        const didAllTestsPass = consoleTestResultHandler(results);
        if (!didAllTestsPass) {
            process.exit(1);
        }
    }
    const end: number = Date.now();

    console.log(`All tests for rule "${rule}" passed!`);
    console.log();
    console.log(`It took ${ end - start }ms to run these tests.`);
    process.exit(0);
}

for (const testDirectory of testDirectories) {
    const results = runTest(testDirectory);
    const didAllTestsPass = consoleTestResultHandler(results);
    if (!didAllTestsPass) {
        process.exit(1);
    }
}

process.exit(0);
