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

import { assert } from "chai";
import * as fs from "fs";
import * as path from "path";
import { rules as allRules, RULES_EXCLUDED_FROM_ALL_CONFIG } from "../src/configs/all";
import { camelize } from "../src/utils";
import { IOptions } from "./../src/language/rule/rule";
import { loadRules } from "./lint";

const builtRulesDir = "build/src/rules";
const srcRulesDir = "src/rules";
const testRulesDir = "test/rules";

describe("Rule Loader", () => {
    it("loads core rules", () => {
        const validConfiguration: IOptions[] = [
            { ruleName: "class-name", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "eofline", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "forin", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "no-debugger", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "quotemark", ruleArguments: ["double"], ruleSeverity: "error", disabledIntervals: [] },
        ];

        const rules = loadRules(validConfiguration, builtRulesDir);
        assert.equal(rules.length, 5);
    });

    it("ignores off rules", () => {
        const validConfiguration: IOptions[] = [
            { ruleName: "forin", ruleArguments: [], ruleSeverity: "off", disabledIntervals: [] },
        ];
        const rules = loadRules(validConfiguration, builtRulesDir);
        assert.equal(rules.length, 0);
    });

    it("ignores invalid rules", () => {
        const invalidConfiguration: IOptions[] = [
            { ruleName: "class-name", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "invalidConfig1", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "invalidConfig2", ruleArguments: [], ruleSeverity: "off", disabledIntervals: [] },
        ];

        const rules = loadRules(invalidConfiguration, [builtRulesDir]);
        assert.equal(rules.length, 1);
    });

    it("properly sets rule severity with options", () => {
        const withOptions: IOptions[] = [
            { ruleName: "callable-types", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "max-line-length", ruleArguments: [140], ruleSeverity: "warning", disabledIntervals: [] },
        ];

        const rules = loadRules(withOptions, [builtRulesDir]);
        assert.equal(rules.length, 2);
        assert.equal(rules[0].getOptions().ruleSeverity, "error");
        assert.equal(rules[1].getOptions().ruleSeverity, "warning");
    });

    it("works with rulesDirectory argument as an Array", () => {
        const validConfiguration: IOptions[] = [
            { ruleName: "class-name", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "eofline", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "forin", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "no-debugger", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "quotemark", ruleArguments: ["double"], ruleSeverity: "error", disabledIntervals: [] },
        ];

        const rules = loadRules(validConfiguration, [builtRulesDir]);
        assert.equal(rules.length, 5);
    });

    it("loads js rules", () => {
        const validConfiguration: IOptions[] = [
            { ruleName: "class-name", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "await-promise", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
        ];

        const rules = loadRules(validConfiguration, builtRulesDir, true);
        assert.equal(rules.length, 1);
    });

    it("tests every rule", () => {
        const tests = fs.readdirSync(testRulesDir)
            .filter((file) => !file.startsWith("_") && fs.statSync(path.join(testRulesDir, file)).isDirectory())
            .map(camelize)
            .sort();
        assert.deepEqual(everyRule(), tests, "List of rules doesn't match list of tests");
    });

    it("includes every rule in 'tslint:all'", () => {
        const expectedAllRules = everyRule().filter((ruleName) =>
            RULES_EXCLUDED_FROM_ALL_CONFIG.indexOf(ruleName) === -1);
        const tslintAllRules = Object.keys(allRules).map(camelize).sort();

        assert.deepEqual(expectedAllRules, tslintAllRules, "rule is missing in tslint:all");
    });
});

function everyRule(): string[] {
    return fs.readdirSync(srcRulesDir)
        .filter((file) => /Rule.ts$/.test(file))
        .map((file) => file.substr(0, file.length - "Rule.ts".length))
        .sort();
}
