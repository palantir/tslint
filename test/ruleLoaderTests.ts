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

import * as diff from "diff";
import * as fs from "fs";
import * as path from "path";
import { camelize } from "../src/utils";
import { loadRules } from "./lint";

describe("Rule Loader", () => {
    const builtRulesDir = "build/src/rules";
    const srcRulesDir = "src/rules";
    const testRulesDir = "test/rules";

    it("loads core rules", () => {
        const validConfiguration: {[name: string]: any} = {
            "class-name": true,
            "eofline": true,
            "forin": false,
            "no-debugger": true,
            "quotemark": [true, "single"],
        };

        const rules = loadRules(validConfiguration, {}, builtRulesDir);
        assert.equal(rules.length, 4);
    });

    it("ignores invalid rules", () => {
        const invalidConfiguration: {[name: string]: any} = {
            "class-name": true,
            "invalidConfig1": true,
            "invalidConfig2": false,
        };

        const rules = loadRules(invalidConfiguration, {}, [builtRulesDir]);
        assert.equal(rules.length, 1);
    });

    it("loads disabled rules if rule in enableDisableRuleMap", () => {
        const validConfiguration: {[name: string]: any} = {
            "class-name": true,
            "eofline": true,
            "forin": false,
            "no-debugger": true,
            "quotemark": [true, "single"],
        };

        const rules = loadRules(validConfiguration, {forin: [{isEnabled: true, position: 4}]}, builtRulesDir);
        assert.equal(rules.length, 5);
    });

    it("works with rulesDirectory argument as an Array", () => {
        const validConfiguration: {[name: string]: any} = {
            "class-name": true,
            "eofline": true,
            "forin": false,
            "no-debugger": true,
            "quotemark": [true, "single"],
        };

        const rules = loadRules(validConfiguration, {}, [builtRulesDir]);
        assert.equal(rules.length, 4);
    });

    it("loads js rules", () => {
        const validConfiguration: {[name: string]: any} = {
            "class-name": true,
        };

        const rules = loadRules(validConfiguration, {}, builtRulesDir, true);
        assert.equal(rules.length, 1);
    });

    it("tests every rule", () => {
        const rules = fs.readdirSync(srcRulesDir)
            .filter((file) => /Rule.ts$/.test(file))
            .map((file) => file.substr(0, file.length - "Rule.ts".length))
            .sort()
            .join("\n");
        const tests = fs.readdirSync(testRulesDir)
            .filter((file) => !file.startsWith("_") && fs.statSync(path.join(testRulesDir, file)).isDirectory())
            .map(camelize)
            .sort()
            .join("\n");
        const diffResults = diff.diffLines(rules, tests);
        let testFailed = false;
        for (const result of diffResults) {
            if (result.added) {
                console.warn("Test has no matching rule: " + result.value);
                testFailed = true;
            } else if (result.removed) {
                console.warn("Missing test: " + result.value);
                testFailed = true;
            }
        }

        assert.isFalse(testFailed, "List of rules doesn't match list of tests");
    });
});
