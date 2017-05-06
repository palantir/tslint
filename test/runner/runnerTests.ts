/*
 * Copyright 2017 Palantir Technologies, Inc.
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

import { assert } from "chai";
import * as streams from "memory-streams";
import { Runner } from "../../src/runner";
import { IRunnerOptions } from "./../../src/runner";

const customRulesOptions: IRunnerOptions = {
    config: "./test/config/tslint-custom-rules.json",
    files: ["src/test.ts"],
    rulesDirectory: "./test/files/custom-rules",
};

describe("Runner Tests", () => {
    it("outputs absolute path with --outputAbsolutePaths", () => {
        const output = runLint({ ...customRulesOptions, outputAbsolutePaths: true });

        // match either a path starting with `/` or something like `C:`
        assert.isTrue(/ERROR: (\/|\w:)/.test(output));
    });

    it("outputs relative path without --outputAbsolutePaths", () => {
        const output = runLint(customRulesOptions);
        assert.include(output, "ERROR: src/");
    });
});

function runLint(options: IRunnerOptions, callback?: (status: number) => void) {
    const output = new streams.WritableStream();
    const runner = new Runner(options, output);
    if (callback === undefined) {
        callback = () => {
            // do nothing
        };
    }
    runner.run(callback);
    return output.toString();
}
