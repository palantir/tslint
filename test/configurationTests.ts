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

import * as fs from "fs";

import {
    convertRuleOptions,
    extendConfigurationFile,
    IConfigurationFile,
    loadConfigurationFromPath,
    parseConfigFile,
} from "../src/configuration";
import { IOptions } from "./../src/language/rule/rule";
import { createTempFile } from "./utils";

describe.only("Configuration", () => {
    describe("parseConfigFile", () => {
        it("parses empty config", () => {
            const rawConfig = {
            };
            const expected = getEmptyConfig();
            assertConfigEquals(parseConfigFile(rawConfig), expected);
        });

        it("arrayifies `extends`", () => {
            const rawConfig = {
                extends: "a",
            };
            const expected = getEmptyConfig();
            expected.extends = ["a"];
            assertConfigEquals(parseConfigFile(rawConfig), expected);
        });

        it("parses different ways of storing options", () => {
            const rawConfig = {
                rules: {
                    a: true,
                    b: [true],
                    c: false,
                    d: [false],
                    e: [true, 1],
                    f: [false, 2, 3],
                    g: { severity: "off"},
                    h: { severity: "warn"},
                    i: { severity: "warning"},
                    j: { severity: "error"},
                    k: { severity: "none" },
                    l: { options: 1 },
                    m: { options: [2] },
                    n: { options: [{ no: false }] },
                    o: { severity: "warn", options: 1 },
                    p: null,
                    q: {},
                    r: "garbage",
                    s: { junk: 1 },
                },
            };
            const expected = getEmptyConfig();
            expected.rules.set("a", { ruleArguments: [], ruleSeverity: "error" });
            expected.rules.set("b", { ruleArguments: [], ruleSeverity: "error" });
            expected.rules.set("c", { ruleArguments: [], ruleSeverity: "off" });
            expected.rules.set("d", { ruleArguments: [], ruleSeverity: "off" });
            expected.rules.set("e", { ruleArguments: [1], ruleSeverity: "error" });
            expected.rules.set("f", { ruleArguments: [2, 3], ruleSeverity: "off" });
            expected.rules.set("g", { ruleArguments: undefined, ruleSeverity: "off" });
            expected.rules.set("h", { ruleArguments: undefined, ruleSeverity: "warning" });
            expected.rules.set("i", { ruleArguments: undefined, ruleSeverity: "warning" });
            expected.rules.set("j", { ruleArguments: undefined, ruleSeverity: "error" });
            expected.rules.set("k", { ruleArguments: undefined, ruleSeverity: "off" });
            expected.rules.set("l", { ruleArguments: [1], ruleSeverity: undefined });
            expected.rules.set("m", { ruleArguments: [2], ruleSeverity: undefined });
            expected.rules.set("n", { ruleArguments: [{ no: false }], ruleSeverity: undefined });
            expected.rules.set("o", { ruleArguments: [1], ruleSeverity: "warning" });
            expected.rules.set("p", { ruleArguments: [], ruleSeverity: "off" });
            expected.rules.set("q", { ruleArguments: undefined, ruleSeverity: undefined });
            expected.rules.set("r", { ruleArguments: undefined, ruleSeverity: "off" });
            expected.rules.set("s", { ruleArguments: undefined, ruleSeverity: undefined });
            assertConfigEquals(parseConfigFile(rawConfig), expected);
        });

        it("fills in default values", () => {
            const initial = getEmptyConfig();
            initial.rules.set("s", { ruleArguments: undefined, ruleSeverity: undefined });
            assert.deepEqual(convertRuleOptions(initial.rules)[0], {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "s",
                ruleSeverity: "error",
            });
        });
    });

    describe("extendConfigurationFile", () => {
        const EMPTY_CONFIG = getEmptyConfig();

        it("verifies that empty extending empty is empty", () => {
            assertConfigEquals(extendConfigurationFile(EMPTY_CONFIG, EMPTY_CONFIG), EMPTY_CONFIG);
        });

        it("extends empty with non-empty", () => {
            const config = getEmptyConfig();
            config.jsRules.set("row", { ruleArguments: ["oar", "column"], ruleSeverity: "error" });
            config.rules.set("foo", { ruleArguments: ["bar"], ruleSeverity: "off" });
            config.rulesDirectory = ["foo"];
            config.linterOptions = { typeCheck: true };
            assertConfigEquals(extendConfigurationFile(EMPTY_CONFIG, config), config);
        });

        it("extends empty, with undefined ruleSeverity or ruleArguments", () => {
            const config = getEmptyConfig();
            config.jsRules.set("row", { ruleArguments: ["oar", "column"] });
            config.rules.set("foo", { ruleSeverity: "off" });
            config.linterOptions = { };
            assertConfigEquals(extendConfigurationFile(EMPTY_CONFIG, config), config);
        });

        it ("unions values", () => {
            const baseConfig = getEmptyConfig();
            baseConfig.rules.set("foo", { ruleArguments: ["bar"], ruleSeverity: "off" });
            baseConfig.jsRules.set("row", { ruleArguments: ["oar", "column"] });
            baseConfig.rulesDirectory = ["foo"];

            const extendingConfig = getEmptyConfig();
            extendingConfig.rules.set("flow", { ruleArguments: ["river"] });
            extendingConfig.jsRules.set("good", { ruleArguments: ["does"], ruleSeverity: "warning" });
            extendingConfig.rulesDirectory = ["baz"];

            const expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("foo", { ruleArguments: ["bar"], ruleSeverity: "off" });
            expectedConfig.rules.set("flow", { ruleArguments: ["river"] });
            expectedConfig.jsRules.set("row", { ruleArguments: ["oar", "column"] });
            expectedConfig.jsRules.set("good", { ruleArguments: ["does"], ruleSeverity: "warning" });
            expectedConfig.rulesDirectory = ["foo", "baz"];

            const actualConfig = extendConfigurationFile(baseConfig, extendingConfig);
            assertConfigEquals(actualConfig, expectedConfig);
        });

        it ("overrides values", () => {
            const baseConfig = getEmptyConfig();
            baseConfig.rules.set("foo", { ruleArguments: ["bar"], ruleSeverity: "off" });
            baseConfig.jsRules.set("row", { ruleArguments: ["oar", "column"] });
            baseConfig.rulesDirectory = ["foo"];

            const extendingConfig = getEmptyConfig();
            extendingConfig.rules.set("foo", { ruleSeverity: "warning" });
            extendingConfig.jsRules.set("row", { ruleArguments: ["skid"] });
            extendingConfig.rulesDirectory = ["foo"];

            const expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("foo", { ruleArguments: ["bar"], ruleSeverity: "warning" });
            expectedConfig.jsRules.set("row", { ruleArguments: ["skid"] });
            expectedConfig.rulesDirectory = ["foo"];

            const actualConfig = extendConfigurationFile(baseConfig, extendingConfig);
            assertConfigEquals(actualConfig, expectedConfig);
        });

        it("merges cli options", () => {
            const baseConfig = getEmptyConfig();
            baseConfig.cliOptions.exclude = "src";
            baseConfig.cliOptions.fix = true;

            const extendingConfig = getEmptyConfig();
            extendingConfig.cliOptions.exclude = [
                "lib",
                "bin",
            ];

            const expectedConfig = getEmptyConfig();
            expectedConfig.cliOptions.exclude = [
                "lib",
                "bin",
            ];
            expectedConfig.cliOptions.fix = true;

            const actualConfig = extendConfigurationFile(baseConfig, extendingConfig);
            assertConfigEquals(actualConfig, expectedConfig);
        });
    });

    describe("loadConfigurationFromPath", () => {
        it("extends with relative path", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-relative.json");
            assert.isArray(config.rulesDirectory);
            assert.equal("error", config.rules.get("no-fail")!.ruleSeverity, "did not pick up 'no-fail' in base config");
            assert.equal("off", config.rules.get("always-fail")!.ruleSeverity, "did not set 'always-fail' in top config");
            assert.equal("error", config.jsRules.get("no-fail")!.ruleSeverity);
            assert.equal("off", config.jsRules.get("always-fail")!.ruleSeverity);
        });

        it("extends with package", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-package.json");
            const expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("rule-one", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-two", { ruleSeverity: "off" });
            expectedConfig.rules.set("rule-three", { ruleSeverity: "error" });

            assertConfigEquals(config.jsRules, expectedConfig.rules);
            assertConfigEquals(config.rules, expectedConfig.rules);
        });

        it("extends with package - boolean configuration", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-package-boolean.json");
            const expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("rule-one", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-two", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-three", { ruleSeverity: "off" });

            assertConfigEquals(config.jsRules, expectedConfig.rules);
            assertConfigEquals(config.rules, expectedConfig.rules);
        });

        it("extends only severity or only arguments", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-package-partial.json");
            const expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("always-fail", { ruleSeverity: "error", ruleArguments: [2] });
            expectedConfig.jsRules.set("always-fail", { ruleSeverity: "warning", ruleArguments: [1] });

            assertConfigEquals(config.jsRules, expectedConfig.jsRules);
            assertConfigEquals(config.rules, expectedConfig.rules);
        });

        it("extends with package without customization", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-package-no-mod.json");
            const expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("rule-one", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-two", { ruleSeverity: "off" });

            assertConfigEquals(config.jsRules, expectedConfig.rules);
            assertConfigEquals(config.rules, expectedConfig.rules);
        });

        it("extends with builtin", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-builtin.json");
            assert.isUndefined(config.jsRules.get("no-var-keyword"));
            assert.equal("off", config.jsRules.get("no-eval")!.ruleSeverity);
            assert.equal("error", config.rules.get("no-var-keyword")!.ruleSeverity);
            assert.equal("off", config.rules.get("no-eval")!.ruleSeverity);
        });

        describe("with config not relative to tslint", () => {
            let tmpfile: string | null;

            beforeEach(() => {
                tmpfile = createTempFile("json");
            });

            afterEach(() => {
                if (tmpfile != null) {
                    fs.unlinkSync(tmpfile);
                }
            });

            it("extends with package installed relative to tslint", () => {
                fs.writeFileSync(tmpfile!, JSON.stringify({ extends: "tslint-test-config-non-relative" }));
                const config = loadConfigurationFromPath(tmpfile!);

                const expectedConfig = getEmptyConfig();
                expectedConfig.rules.set("class-name", { ruleSeverity: "error" });
                assertConfigEquals(config.rules, expectedConfig.rules);
            });
        });

        it("extends with package two levels (and relative path in rulesDirectory)", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-package-two-levels.json");

            assert.lengthOf(config.rulesDirectory, 2);
            assert.isTrue(fs.existsSync(config.rulesDirectory![0]));
            assert.isTrue(fs.existsSync(config.rulesDirectory![1]));

            const expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("always-fail", { ruleSeverity: "off" });
            expectedConfig.rules.set("rule-one", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-two", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-four", { ruleSeverity: "error" });

            assertConfigEquals(config.jsRules, expectedConfig.rules);
            assertConfigEquals(config.rules, expectedConfig.rules);
        });

        it("extends with array", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-package-array.json");

            const expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("always-fail", { ruleSeverity: "off" });
            expectedConfig.rules.set("no-fail", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-one", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-two", { ruleSeverity: "error" });

            assertConfigEquals(config.jsRules, expectedConfig.rules);
            assertConfigEquals(config.rules, expectedConfig.rules);
        });

        it("can load .json files with comments", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-with-comments.json");

            const expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("rule-two", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-three", { ruleSeverity: "error", ruleArguments: ["//not a comment"] });
            expectedConfig.rules.set("rule-four", { ruleSeverity: "error", ruleArguments: ["/*also not a comment*/"] });

            assertConfigEquals(config.rules, expectedConfig.rules);
            assertConfigEquals(config.jsRules, expectedConfig.rules);
        });

        it("can load .json files with BOM", () => {
            assert.doesNotThrow(() => loadConfigurationFromPath("./test/config/tslint-with-bom.json"));
        });

        it("can load a built-in configuration", () => {
            const config = loadConfigurationFromPath("tslint:recommended");
            assert.strictEqual("error", config.jsRules.get("no-eval")!.ruleSeverity);
            assert.strictEqual("error", config.rules.get("no-eval")!.ruleSeverity);
        });

        it("throws on an invalid built-in configuration path", () => {
            assert.throws(() => {
                loadConfigurationFromPath("tslint:doesnotexist");
            });
        });
    });
});

function getEmptyConfig(): IConfigurationFile {
    return {
        cliOptions: {},
        extends: [],
        jsRules: new Map<string, Partial<IOptions>>(),
        linterOptions: {},
        rules: new Map<string, Partial<IOptions>>(),
        rulesDirectory: [],
    };
}

function demap<T>(map: Map<string, T>) {
    if (map == null) {
        return map;
    }
    const output: { [key: string]: T } = {};
    map.forEach((value, key) => {
        output[key] = value;
    });
    return output;
}

// this is needed since `assertConfigEquals` doesn't go into Map object
function assertConfigEquals(actual: any, expected: any) {
    assert.deepEqual(actual, expected);
    if (actual && (actual.jsRules || actual.rules)) {
        assert.deepEqual(demap(actual.jsRules), demap(expected.jsRules));
        assert.deepEqual(demap(actual.rules), demap(expected.rules));
    }
}
