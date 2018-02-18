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

import { assert } from "chai";
import { rulesForFile } from "../../src/configuration/rulesForFile";
import { IOptions, RuleSeverity } from "../lint";
import { buildConfig, buildRuleOptions } from "./utils";

describe("rulesForFile", () => {
    it("gets base rules with default severity", () => {
        const config = buildConfig({
            rules: new Map<string, Partial<IOptions>>([
                ["ruleName", {}],
            ]),
        });

        const ruleOptions = rulesForFile(config, "file.ts");

        assert.deepEqual(ruleOptions, [
            buildRuleOptions({
                ruleName: "ruleName",
                ruleSeverity: "error",
            }),
        ]);
    });

    it("recursively builds rules with the base config taking precedence", () => {
        const extended = buildConfig({
            jsRules: new Map(),
            rules: new Map([
                ["ruleName", { ruleSeverity: "error" as RuleSeverity }],
                ["fromExtended", { ruleSeverity: "error" as RuleSeverity }],
            ]),
        });

        const config = buildConfig({
            defaultSeverity: "error",
            extends: [extended],
            jsRules: new Map(),
            rules: new Map([
                ["ruleName", { ruleSeverity: "warning" as RuleSeverity }],
            ]),
        });

        const ruleOptions = rulesForFile(config, "file.ts");

        assert.deepEqual(ruleOptions, [
            buildRuleOptions({
                ruleName: "ruleName",
                ruleSeverity: "warning",
            }),
            buildRuleOptions({
                ruleName: "fromExtended",
                ruleSeverity: "error",
            }),
        ]);
    });

    it("recursively builds jsRules for JavaScript files", () => {
        const extended = buildConfig({
            jsRules: new Map([
                ["jsRuleName", { ruleSeverity: "error" as RuleSeverity }],
                ["jsFromExtended", { ruleSeverity: "error" as RuleSeverity }],
            ]),
        });

        const config = buildConfig({
            defaultSeverity: "error",
            extends: [extended],
            jsRules: new Map([
                ["jsRuleName", { ruleSeverity: "warning" as RuleSeverity }],
            ]),
        });

        const ruleOptions = rulesForFile(config, "file.js");

        assert.deepEqual(ruleOptions, [
            buildRuleOptions({
                ruleName: "jsRuleName",
                ruleSeverity: "warning",
            }),
            buildRuleOptions({
                ruleName: "jsFromExtended",
                ruleSeverity: "error",
            }),
        ]);
    });

    it("applies defaultSeverity if rule severity is default", () => {
        const config = buildConfig({
            defaultSeverity: "warning",
            rules: new Map<string, Partial<IOptions>>([
                ["a", { ruleSeverity: "error" }],
                ["b", { ruleSeverity: "warning" }],
                ["c", { ruleSeverity: "off" }],
                ["d", {}],
            ]),
        });

        assert.deepEqual(rulesForFile(config, "file.ts"), [
            buildRuleOptions({ ruleName: "a", ruleSeverity: "error" }),
            buildRuleOptions({ ruleName: "b", ruleSeverity: "warning" }),
            buildRuleOptions({ ruleName: "c", ruleSeverity: "off" }),
            buildRuleOptions({ ruleName: "d", ruleSeverity: "warning" }),
        ]);
    });
});
