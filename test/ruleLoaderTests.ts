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
import { IOptions } from "../src/language/rule/rule";
import { camelize } from "../src/utils";

import { findRule, loadRules, RuleConstructor } from "./lint";

const builtRulesDir = "build/src/rules";
const srcRulesDir = "src/rules";
const testRulesDir = "test/rules";

describe("Rule Loader", () => {
    it("loads core rules", () => {
        const validConfiguration: IOptions[] = [
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "class-name",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "eofline",
                ruleSeverity: "error",
            },
            { ruleName: "forin", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "no-debugger",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: ["double"],
                ruleName: "quotemark",
                ruleSeverity: "error",
            },
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
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "class-name",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "invalidConfig1",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "invalidConfig2",
                ruleSeverity: "off",
            },
        ];

        const rules = loadRules(invalidConfiguration, [builtRulesDir]);
        assert.equal(rules.length, 1);
    });

    it("properly sets rule severity with options", () => {
        const withOptions: IOptions[] = [
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "callable-types",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: [140],
                ruleName: "max-line-length",
                ruleSeverity: "warning",
            },
        ];

        const rules = loadRules(withOptions, [builtRulesDir]);
        assert.equal(rules.length, 2);
        assert.equal(rules[0].getOptions().ruleSeverity, "error");
        assert.equal(rules[1].getOptions().ruleSeverity, "warning");
    });

    it("works with rulesDirectory argument as an Array", () => {
        const validConfiguration: IOptions[] = [
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "class-name",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "eofline",
                ruleSeverity: "error",
            },
            { ruleName: "forin", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "no-debugger",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: ["double"],
                ruleName: "quotemark",
                ruleSeverity: "error",
            },
        ];

        const rules = loadRules(validConfiguration, [builtRulesDir]);
        assert.equal(rules.length, 5);
    });

    it("loads rules for JS files, excluding typescript-only ones", () => {
        const validConfiguration: IOptions[] = [
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "class-name",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "await-promise",
                ruleSeverity: "error",
            },
        ];

        const rules = loadRules(validConfiguration, builtRulesDir, true);
        assert.equal(rules.length, 1);
    });

    it("tests exist for every rule", () => {
        const tests = fs
            .readdirSync(testRulesDir)
            .filter(
                file =>
                    !file.startsWith("_") &&
                    fs.statSync(path.join(testRulesDir, file)).isDirectory(),
            )
            .map(camelize)
            .sort();
        assert.deepEqual(everyRule(), tests, "List of rules doesn't match list of tests");
    });

    it("includes every rule in 'tslint:all'", () => {
        const expectedAllRules = everyRule().filter(
            ruleName => RULES_EXCLUDED_FROM_ALL_CONFIG.indexOf(ruleName) === -1,
        );
        const tslintAllRules = Object.keys(allRules)
            .map(camelize)
            .sort();

        assert.deepEqual(expectedAllRules, tslintAllRules, "rule is missing in tslint:all");
    });

    it("resolves custom rule directories as relative paths", () => {
        let rule: RuleConstructor | undefined;
        assert.doesNotThrow(() => {
            rule = findRule("always-fail", "test/files/custom-rules");
        });
        assert.isDefined(rule);
    });

    it("supports rulesDirectory set to empty string", () => {
        // see https://github.com/palantir/tslint/issues/3638
        assert.doesNotThrow(() => {
            findRule("always-fail", "");
        });
    });

    it("throws an error for invalid rulesDirectories", () => {
        assert.throws(() => {
            findRule("always-fail", "some/invalid/dir");
        });
    });
});

function everyRule(): string[] {
    return fs
        .readdirSync(srcRulesDir)
        .filter(file => /Rule.ts$/.test(file))
        .map(file => file.substr(0, file.length - "Rule.ts".length))
        .sort();
}
