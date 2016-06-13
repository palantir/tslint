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

import {runTest, consoleTestResultHandler} from "../src/test";

// needed to get colors to show up when passing through Grunt
(colors as any).enabled = true;

/* tslint:disable:no-console */
console.log();
console.log(colors.underline("Testing Lint Rules:"));
/* tslint:enable:no-console */

const testDirectories = glob.sync("test/rules/**/tslint.json").map(path.dirname);

for (const testDirectory of testDirectories) {
    const results = runTest(testDirectory);
    const didAllTestsPass = consoleTestResultHandler(results);
    if (!didAllTestsPass) {
        process.exit(1);
    }
}

process.exit(0);
