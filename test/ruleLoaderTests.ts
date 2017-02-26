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
import { rules as allRules } from "../src/configs/all";
import { IEnableDisablePosition } from "../src/ruleLoader";
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
            { ruleName: "forin", ruleArguments: [], ruleSeverity: "off", disabledIntervals: [] },
            { ruleName: "no-debugger", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "quotemark", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
        ];

        const rules = loadRules(validConfiguration, new Map<string, IEnableDisablePosition[]>(), builtRulesDir);
        assert.equal(rules.length, 5);
    });

    it("ignores invalid rules", () => {
        const invalidConfiguration: IOptions[] = [
            { ruleName: "class-name", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "invalidConfig1", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "invalidConfig2", ruleArguments: [], ruleSeverity: "off", disabledIntervals: [] },
        ];

        const rules = loadRules(invalidConfiguration, new Map<string, IEnableDisablePosition[]>(), [builtRulesDir]);
        assert.equal(rules.length, 1);
    });

    it("properly sets rule severity with options", () => {
        const withOptions: IOptions[] = [
            { ruleName: "callable-types", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "max-line-length", ruleArguments: [140], ruleSeverity: "warning", disabledIntervals: [] },
        ];

        const rules = loadRules(withOptions, new Map<string, IEnableDisablePosition[]>(), [builtRulesDir]);
        assert.equal(rules.length, 2);
        assert.equal(rules[0].getOptions().ruleSeverity, "error");
        assert.equal(rules[1].getOptions().ruleSeverity, "warning");
    });

    it("loads disabled rules if rule in enableDisableRuleMap", () => {
        const validConfiguration: IOptions[] = [
            { ruleName: "forin", ruleArguments: [], ruleSeverity: "off", disabledIntervals: [] },
        ];

        const enableDisableMap = new Map<string, IEnableDisablePosition[]>();
        enableDisableMap.set("forin", [{ isEnabled: true, position: 4 }]);
        const rules = loadRules(validConfiguration, enableDisableMap, builtRulesDir);
        assert.equal(rules.length, 1);
    });

    it("works with rulesDirectory argument as an Array", () => {
        const validConfiguration: IOptions[] = [
            { ruleName: "class-name", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "eofline", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "forin", ruleArguments: [], ruleSeverity: "off", disabledIntervals: [] },
            { ruleName: "no-debugger", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "quotemark", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
        ];

        const rules = loadRules(validConfiguration, new Map<string, IEnableDisablePosition[]>(), [builtRulesDir]);
        assert.equal(rules.length, 5);
    });

    it("loads js rules", () => {
        const validConfiguration: IOptions[] = [
            { ruleName: "class-name", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            { ruleName: "await-promise", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
        ];

        const rules = loadRules(validConfiguration, new Map<string, IEnableDisablePosition[]>(), builtRulesDir, true);
        assert.equal(rules.length, 1);
    });

    it("tests every rule", () => {
        const tests = fs.readdirSync(testRulesDir)
            .filter((file) => !file.startsWith("_") && fs.statSync(path.join(testRulesDir, file)).isDirectory())
            .map(camelize)
            .sort();
        const diffResults = diffLists(everyRule(), tests);
        let testFailed = false;
        for (const { added, removed, value } of diffResults) {
            if (added) {
                console.warn(`Test has no matching rule: ${value}`);
                testFailed = true;
            } else if (removed) {
                console.warn(`Missing test: ${value}`);
                testFailed = true;
            }
        }

        assert.isFalse(testFailed, "List of rules doesn't match list of tests");
    });

    it("includes every rule in 'tslint:all'", () => {
        const actualAllRules = everyRule().filter((ruleName) => {
            // Some rules intentionally excluded
            switch (ruleName) {
                case "ban":
                case "fileHeader":
                case "importBlacklist":
                case "noInvalidThis":
                case "noSwitchCaseFallThrough":
                case "noUnusedVariable":
                case "switchDefault":
                case "typeofCompare":
                    return false;
                default:
                    return true;
            }
        });
        const tslintAllRules = Object.keys(allRules).map(camelize).sort();
        const diffResults = diffLists(actualAllRules, tslintAllRules);

        let testFailed = false;
        for (const { added, removed, value } of diffResults) {
            if (added) {
                console.warn(`Rule in 'tslint:all' does not exist: ${value}`);
                testFailed = true;
            } else if (removed) {
                console.warn(`Rule not in 'tslint:all': ${value}`);
                testFailed = true;
            }
        }

        assert.isFalse(testFailed, "Bad 'tslint:all'");
    });

    it("ensures that `.ts` files in `rules/` end in `.test.ts` to avoid being linted", () => {
        walkSync(testRulesDir, (filename) => {
            if (/\.ts$/.test(filename)) {
                assert.match(filename, /\.test\.ts$/);
            }
        });
    });

    const walkSync = (dir: string, cb: (filename: string) => void) => {
        fs.readdirSync(dir).forEach((file) => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                walkSync(fullPath, cb);
            } else {
                cb(fullPath);
            }
        });
    };
});

function diffLists(actual: string[], expected: string[]): diff.IDiffResult[] {
    return diff.diffLines(actual.join("\n"), expected.join("\n"));
}

function everyRule(): string[] {
    return fs.readdirSync(srcRulesDir)
            .filter((file) => /Rule.ts$/.test(file))
            .map((file) => file.substr(0, file.length - "Rule.ts".length))
            .sort();
}
