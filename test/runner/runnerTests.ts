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

import { Options, run, Status } from "../../src/runner";

const customRulesOptions: Options = {
    config: "./test/config/tslint-custom-rules.json",
    exclude: [],
    files: ["src/test.ts"],
    rulesDirectory: "./test/files/custom-rules",
};

describe("Runner Tests", () => {
    it("outputs absolute path with --outputAbsolutePaths", async () => {
        const { status, stdout, stderr } = await runLint({
            ...customRulesOptions,
            outputAbsolutePaths: true,
        });
        assert.equal(status, 2);
        // match either a path starting with `/` or something like `C:`
        assert.isTrue(/ERROR: (\/|\w:)/.test(stdout));
        assert.equal(stderr, "");
    });

    it("outputs relative path without --outputAbsolutePaths", async () => {
        const { status, stdout, stderr } = await runLint(customRulesOptions);
        assert.equal(status, 2);
        assert.include(stdout, "ERROR: src/");
        assert.equal(stderr, "");
    });
});

async function runLint(
    options: Options,
): Promise<{ status: Status; stdout: string; stderr: string }> {
    let stdout = "";
    let stderr = "";
    const status = await run(options, {
        log(m) {
            stdout += m;
        },
        error(m) {
            stderr += m;
        },
    });
    return { status, stdout, stderr };
}
