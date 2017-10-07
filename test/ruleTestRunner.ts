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

import { Status } from "../src/runner";
import { consoleTestResultHandler, runTest } from "../src/test";

const logger = console;

logger.log();
logger.log(colors.underline("Testing Lint Rules:"));

const testDirectories = glob.sync("test/rules/**/tslint.json").map(path.dirname);

async function runRuleTests(): Promise<Status> {
    for (const testDirectory of testDirectories) {
        const results = await runTest(testDirectory);
        const didAllTestsPass = consoleTestResultHandler(results);
        if (!didAllTestsPass) {
            return Status.FatalError;
        }
    }

    return Status.Ok;
}

// tslint:disable-next-line:no-floating-promises
runRuleTests()
    .catch((error: Error) => {
        logger.error(colors.underline("Error Testing Lint Rules:"));
        logger.error(error);
        process.exitCode = Status.FatalError;
    })
    .then((exitCode: Status) => {
        process.exitCode = exitCode;
    });
