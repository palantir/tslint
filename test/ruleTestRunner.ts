/*
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

import chalk from "chalk";
import * as glob from "glob";
import * as path from "path";

import { consoleTestResultHandler, runTest } from "../src/test";

process.stdout.write(chalk.underline("\nTesting Lint Rules:\n"));

const testDirectories = glob.sync("test/rules/**/tslint.json").map(path.dirname);

for (const testDirectory of testDirectories) {
    const results = runTest(testDirectory);
    const didAllTestsPass = consoleTestResultHandler(results, {
        log(m) {
            process.stdout.write(m);
        },
        error(m) {
            process.stderr.write(m);
        },
    });
    if (!didAllTestsPass) {
        process.exitCode = 1;
        break;
    }
}
