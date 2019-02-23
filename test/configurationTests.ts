/*
 * Copyright 2018 Palantir Technologies, Inc.
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

import {
    convertRuleOptions,
    extendConfigurationFile,
    findConfigurationPath,
    IConfigurationFile,
    loadConfigurationFromPath,
    parseConfigFile,
    RawConfigFile,
} from "../src/configuration";
import { IOptions, RuleSeverity } from "../src/language/rule/rule";

import { createTempFile } from "./utils";

describe("Configuration", () => {
    describe("parseConfigFile", () => {
        it("parses empty config", () => {
            const rawConfig = {};
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
            const rawConfig: RawConfigFile = {
                rules: {
                    a: true,
                    b: [true],
                    c: false,
                    d: [false],
                    e: [true, 1],
                    f: [false, 2, 3],
                    g: { severity: "off" },
                    h: { severity: "warn" },
                    i: { severity: "warning" },
                    j: { severity: "error" },
                    k: { severity: "none" },
                    l: { options: 1 },
                    m: { options: [2] },
                    n: { options: [{ no: false }] },
                    o: { severity: "warn", options: 1 },
                    p: null,
                    q: {},
                    r: "garbage" as any,
                    s: { junk: 1 } as any,
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
            expected.rules.set("l", { ruleArguments: [1], ruleSeverity: "error" });
            expected.rules.set("m", { ruleArguments: [2], ruleSeverity: "error" });
            expected.rules.set("n", { ruleArguments: [{ no: false }], ruleSeverity: "error" });
            expected.rules.set("o", { ruleArguments: [1], ruleSeverity: "warning" });
            expected.rules.set("p", { ruleArguments: [], ruleSeverity: "off" });
            expected.rules.set("q", { ruleArguments: undefined, ruleSeverity: "error" });
            expected.rules.set("r", { ruleArguments: undefined, ruleSeverity: "error" });
            expected.rules.set("s", { ruleArguments: undefined, ruleSeverity: "error" });
            assertConfigEquals(parseConfigFile(rawConfig), expected);
        });

        it("fills in default values", () => {
            const initial = getEmptyConfig();
            initial.rules.set("s", { ruleArguments: undefined, ruleSeverity: undefined });
            assert.deepEqual<IOptions>(convertRuleOptions(initial.rules)[0], {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "s",
                ruleSeverity: "error",
            });
        });

        it("resolves exclude pattern relative to the configuration file", () => {
            const config: RawConfigFile = {
                linterOptions: {
                    exclude: ["foo.ts", "**/*.d.ts"],
                },
            };
            assert.deepEqual(parseConfigFile(config, "/path").linterOptions, {
                exclude: [path.resolve("/path", "foo.ts"), path.resolve("/path", "**/*.d.ts")],
            });
        });

        it("parses jsRules when jsRules is a config", () => {
            const rawConfig: RawConfigFile = {
                jsRules: {
                    a: true,
                },
            };

            const expected = getEmptyConfig();
            expected.jsRules.set("a", { ruleArguments: [], ruleSeverity: "error" });
            assertConfigEquals(parseConfigFile(rawConfig), expected);
        });

        it("copies valid rules to jsRules when jsRules is a boolean", () => {
            let rawConfig: RawConfigFile = {
                jsRules: true,
                rules: {},
            };

            const expected = getEmptyConfig();
            assertConfigEquals(parseConfigFile(rawConfig), expected);

            rawConfig = {
                jsRules: true,
                rules: {
                    eofline: true,
                },
            };

            let { rules, jsRules } = parseConfigFile(rawConfig);
            assert.deepEqual(demap(rules), demap(jsRules));

            rawConfig = {
                jsRules: true,
                rules: {
                    eofline: true,
                    typedef: true,
                },
            };

            ({ rules, jsRules } = parseConfigFile(rawConfig));
            assert(jsRules.has("eofline"));
            assert(!jsRules.has("typedef"));

            rules.delete("typedef");
            assert.deepEqual(demap(rules), demap(jsRules));
        });
    });

    describe("defaultSeverity", () => {
        it("uses defaultSeverity if severity is default", () => {
            const rawConfig: RawConfigFile = {
                defaultSeverity: "warning",
                rules: {
                    a: { severity: "error" },
                    b: { severity: "warning" },
                    c: { severity: "off" },
                    d: { severity: "default" },
                },
            };

            const expected = getEmptyConfig();
            expected.rules.set("a", { ruleArguments: undefined, ruleSeverity: "error" });
            expected.rules.set("b", { ruleArguments: undefined, ruleSeverity: "warning" });
            expected.rules.set("c", { ruleArguments: undefined, ruleSeverity: "off" });
            expected.rules.set("d", { ruleArguments: undefined, ruleSeverity: "warning" });
            assertConfigEquals(parseConfigFile(rawConfig), expected);
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
            config.linterOptions = { exclude: ["foo"] };
            assertConfigEquals(extendConfigurationFile(EMPTY_CONFIG, config), config);
        });

        it("extends empty, with undefined ruleSeverity or ruleArguments", () => {
            const config = getEmptyConfig();
            config.jsRules.set("row", { ruleArguments: ["oar", "column"] });
            config.rules.set("foo", { ruleSeverity: "off" });
            config.linterOptions = {};
            assertConfigEquals(extendConfigurationFile(EMPTY_CONFIG, config), config);
        });

        it("unions values", () => {
            const baseConfig = getEmptyConfig();
            baseConfig.rules.set("foo", { ruleArguments: ["bar"], ruleSeverity: "off" });
            baseConfig.jsRules.set("row", { ruleArguments: ["oar", "column"] });
            baseConfig.rulesDirectory = ["foo"];

            const extendingConfig = getEmptyConfig();
            extendingConfig.rules.set("flow", { ruleArguments: ["river"] });
            extendingConfig.jsRules.set("good", {
                ruleArguments: ["does"],
                ruleSeverity: "warning",
            });
            extendingConfig.rulesDirectory = ["baz"];

            const expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("foo", { ruleArguments: ["bar"], ruleSeverity: "off" });
            expectedConfig.rules.set("flow", { ruleArguments: ["river"] });
            expectedConfig.jsRules.set("row", { ruleArguments: ["oar", "column"] });
            expectedConfig.jsRules.set("good", {
                ruleArguments: ["does"],
                ruleSeverity: "warning",
            });
            expectedConfig.rulesDirectory = ["foo", "baz"];

            const actualConfig = extendConfigurationFile(baseConfig, extendingConfig);
            assertConfigEquals(actualConfig, expectedConfig);
        });

        it("overrides values", () => {
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

        it("replaces exclude option", () => {
            const baseConfig = getEmptyConfig();
            baseConfig.linterOptions = {
                exclude: ["src"],
            };

            const extendingConfig = getEmptyConfig();
            extendingConfig.linterOptions = {
                exclude: ["lib", "bin"],
            };

            const expectedConfig = getEmptyConfig();
            expectedConfig.linterOptions = {
                exclude: ["lib", "bin"],
            };

            const actualConfig = extendConfigurationFile(baseConfig, extendingConfig);
            assertConfigEquals(actualConfig, expectedConfig);
        });

        it("empty linter options does not replace exclude", () => {
            const baseConfig = getEmptyConfig();
            baseConfig.linterOptions = {
                exclude: ["src"],
            };

            const extendingConfig = getEmptyConfig();
            extendingConfig.linterOptions = {};

            const expectedConfig = getEmptyConfig();
            expectedConfig.linterOptions = {
                exclude: ["src"],
            };

            const actualConfig = extendConfigurationFile(baseConfig, extendingConfig);
            assertConfigEquals(actualConfig, expectedConfig);
        });

        it("overrides defaultSeverity of base configs", () => {
            const config = loadConfigurationFromPath(
                "./test/config/tslint-extends-default-severity.json",
            );
            assert.equal<RuleSeverity | undefined>(
                config.rules.get("default-severity-unspecified")!.ruleSeverity,
                "warning",
                "should apply defaultSeverity to base config with no defaultSeverity",
            );
            assert.equal<RuleSeverity | undefined>(
                config.rules.get("default-severity-error")!.ruleSeverity,
                "warning",
                "should override defaultSeverity defined in base config",
            );
            assert.equal<RuleSeverity | undefined>(
                config.rules.get("default-severity-warning")!.ruleSeverity,
                "warning",
                "should apply defaultSeverity to extending config",
            );
        });

        it("inherits defaultSeverity from base config if not specified", () => {
            const config = loadConfigurationFromPath(
                "./test/config/tslint-extends-default-severity-only-in-extended.json",
            );
            assert.equal<RuleSeverity | undefined>(
                config.rules.get("default-severity-unspecified")!.ruleSeverity,
                "warning",
                "should apply defaultSeverity to base config with no defaultSeverity",
            );
            assert.equal<RuleSeverity | undefined>(
                config.rules.get("default-severity-error")!.ruleSeverity,
                "warning",
                "should override defaultSeverity defined in base config",
            );
            assert.equal<RuleSeverity | undefined>(
                config.rules.get("default-severity-warning")!.ruleSeverity,
                "warning",
                "should apply defaultSeverity to extending config",
            );
            assert.equal<RuleSeverity | undefined>(
                config.rules.get("default-severity-only-in-extended")!.ruleSeverity,
                "warning",
                "should inherit defaultSeverity from base configs",
            );
        });

        it("applies defaultSeverity to preceding base configs", () => {
            const config = loadConfigurationFromPath(
                "./test/config/tslint-extends-default-severity-precedence.json",
            );
            assert.equal<RuleSeverity | undefined>(
                config.rules.get("default-severity-unspecified")!.ruleSeverity,
                "off",
                "should apply defaultSeverity to base config with no defaultSeverity",
            );
            assert.equal<RuleSeverity | undefined>(
                config.rules.get("default-severity-error")!.ruleSeverity,
                "off",
                "should override defaultSeverity defined in preceding base config",
            );
            assert.equal<RuleSeverity | undefined>(
                config.rules.get("default-severity-warning")!.ruleSeverity,
                "off",
                "should override defaultSeverity defined in preceding base config",
            );
            assert.equal<RuleSeverity | undefined>(
                config.rules.get("default-severity-off")!.ruleSeverity,
                "off",
                "should not override last declared defaultSeverity",
            );
        });
    });

    describe("findConfigurationPath", () => {
        it("finds the closest tslint.json", () => {
            assert.strictEqual(
                findConfigurationPath(null, "./test/files/config-findup/contains-config"),
                path.resolve("test/files/config-findup/contains-config/tslint.json"),
            );
            assert.strictEqual(
                findConfigurationPath(null, "./test/files/config-findup/no-config"),
                path.resolve("./test/files/config-findup/tslint.json"),
            );
            assert.strictEqual(
                findConfigurationPath(null, "./test/files/config-findup"),
                path.resolve("./test/files/config-findup/tslint.json"),
            );

            // gulp-tslint uses a path including the filename
            assert.strictEqual(
                findConfigurationPath(null, "./test/files/config-findup/somefilename.ts"),
                path.resolve("./test/files/config-findup/tslint.json"),
            );
        });
        it("prefers json over yaml over yml configuration files", () => {
            assert.strictEqual(
                findConfigurationPath(null, "./test/files/config-findup/yaml-config"),
                path.resolve("test/files/config-findup/yaml-config/tslint.json"),
            );
            assert.strictEqual(
                findConfigurationPath(null, "./test/files/config-findup/yml-config"),
                path.resolve("test/files/config-findup/yml-config/tslint.yaml"),
            );
        });
    });

    describe("loadConfigurationFromPath", () => {
        it("extends with relative path", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-relative.json");
            assert.isArray(config.rulesDirectory);
            assert.equal<RuleSeverity | undefined>(
                "error",
                config.rules.get("no-fail")!.ruleSeverity,
                "should pick up 'no-fail' in base config",
            );
            assert.equal<RuleSeverity | undefined>(
                "off",
                config.rules.get("always-fail")!.ruleSeverity,
                "should set 'always-fail' in top config",
            );
            assert.equal<RuleSeverity | undefined>(
                "error",
                config.jsRules.get("no-fail")!.ruleSeverity,
            );
            assert.equal<RuleSeverity | undefined>(
                "off",
                config.jsRules.get("always-fail")!.ruleSeverity,
            );
        });

        it("extends with package", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-package.json");
            const expectedRules = getEmptyRules();
            expectedRules.set("rule-one", { ruleArguments: [], ruleSeverity: "error" });
            expectedRules.set("rule-two", { ruleArguments: undefined, ruleSeverity: "error" });
            expectedRules.set("rule-three", { ruleArguments: undefined, ruleSeverity: "off" });

            assertRulesEqual(config.rules, expectedRules);
            assertRulesEqual(config.jsRules, expectedRules);
        });

        it("extends with package - boolean configuration", () => {
            const config = loadConfigurationFromPath(
                "./test/config/tslint-extends-package-boolean.json",
            );
            const expectedRules = getEmptyRules();
            expectedRules.set("rule-one", { ruleArguments: [], ruleSeverity: "error" });
            expectedRules.set("rule-two", { ruleArguments: [], ruleSeverity: "error" });
            expectedRules.set("rule-three", { ruleArguments: [], ruleSeverity: "off" });

            assertRulesEqual(config.rules, expectedRules);
            assertRulesEqual(config.jsRules, expectedRules);
        });

        it("extends only severity or only arguments", () => {
            const config = loadConfigurationFromPath(
                "./test/config/tslint-extends-package-partial.json",
            );
            const expectedRules = getEmptyRules();
            expectedRules.set("always-fail", { ruleArguments: [2], ruleSeverity: "error" });
            expectedRules.set("rule-one", { ruleArguments: [], ruleSeverity: "error" });
            expectedRules.set("rule-two", { ruleArguments: [], ruleSeverity: "off" });

            const expectedJsRules = getEmptyRules();
            expectedJsRules.set("always-fail", {
                ruleArguments: undefined,
                ruleSeverity: "warning",
            });
            expectedJsRules.set("rule-one", { ruleArguments: [], ruleSeverity: "error" });
            expectedJsRules.set("rule-two", { ruleArguments: [], ruleSeverity: "off" });

            assertRulesEqual(config.rules, expectedRules);
            assertRulesEqual(config.jsRules, expectedJsRules);
        });

        it("extends with package without customization", () => {
            const config = loadConfigurationFromPath(
                "./test/config/tslint-extends-package-no-mod.json",
            );
            const expectedRules = getEmptyRules();
            expectedRules.set("rule-one", { ruleArguments: [], ruleSeverity: "error" });
            expectedRules.set("rule-two", { ruleArguments: [], ruleSeverity: "off" });

            assertRulesEqual(config.rules, expectedRules);
            assertRulesEqual(config.jsRules, expectedRules);
        });

        it("extends with builtin", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-builtin.json");
            assert.isUndefined(config.jsRules.get("no-var-keyword"));
            assert.equal<RuleSeverity | undefined>(
                "off",
                config.jsRules.get("no-eval")!.ruleSeverity,
            );
            assert.equal<RuleSeverity | undefined>(
                "error",
                config.rules.get("no-var-keyword")!.ruleSeverity,
            );
            assert.equal<RuleSeverity | undefined>(
                "off",
                config.rules.get("no-eval")!.ruleSeverity,
            );
        });

        it("resolve rule directory from package", () => {
            const config = loadConfigurationFromPath(
                "./test/config/tslint-custom-rules-with-package.json",
            );
            assert.deepEqual(config.rulesDirectory, [
                path.join(process.cwd(), "test/config/node_modules/tslint-test-custom-rules/rules"),
            ]);
        });

        it("resolve rule directory from package fallback", () => {
            const config = loadConfigurationFromPath(
                "./test/config/tslint-custom-rules-with-package-fallback.json",
            );
            assert.deepEqual(config.rulesDirectory, [
                path.join(process.cwd(), "test/config/relative-rules-directory"),
            ]);
        });

        describe("with config not relative to tslint", () => {
            let tmpfile: string | undefined;

            beforeEach(() => {
                tmpfile = createTempFile("json");
            });

            afterEach(() => {
                if (tmpfile !== undefined) {
                    fs.unlinkSync(tmpfile);
                }
            });

            it("extends with package installed relative to tslint", () => {
                fs.writeFileSync(
                    tmpfile!,
                    JSON.stringify({ extends: "tslint-test-config-non-relative" }),
                );
                const config = loadConfigurationFromPath(tmpfile!);

                const expectedRules = getEmptyRules();
                expectedRules.set("class-name", { ruleArguments: [], ruleSeverity: "error" });

                assertRulesEqual(config.rules, expectedRules);
                assertRulesEqual(config.jsRules, expectedRules);
            });
        });

        it("extends with package two levels (and relative path in rulesDirectory)", () => {
            const config = loadConfigurationFromPath(
                "./test/config/tslint-extends-package-two-levels.json",
            );

            assert.lengthOf(config.rulesDirectory, 2);
            assert.isTrue(fs.existsSync(config.rulesDirectory[0]));
            assert.isTrue(fs.existsSync(config.rulesDirectory[1]));

            const expectedRules = getEmptyRules();
            expectedRules.set("always-fail", { ruleArguments: undefined, ruleSeverity: "off" });
            expectedRules.set("rule-one", { ruleArguments: [], ruleSeverity: "error" });
            expectedRules.set("rule-two", { ruleArguments: [], ruleSeverity: "error" });
            expectedRules.set("rule-four", { ruleArguments: [], ruleSeverity: "error" });

            assertRulesEqual(config.rules, expectedRules);
            assertRulesEqual(config.jsRules, expectedRules);
        });

        it("extends with array", () => {
            const config = loadConfigurationFromPath(
                "./test/config/tslint-extends-package-array.json",
            );

            const expectedRules = getEmptyRules();
            expectedRules.set("always-fail", { ruleArguments: undefined, ruleSeverity: "off" });
            expectedRules.set("no-fail", { ruleArguments: undefined, ruleSeverity: "error" });
            expectedRules.set("rule-one", { ruleArguments: [], ruleSeverity: "error" });
            expectedRules.set("rule-two", { ruleArguments: undefined, ruleSeverity: "error" });

            assertRulesEqual(config.rules, expectedRules);
            assertRulesEqual(config.jsRules, expectedRules);
        });

        it("can load .json files with comments", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-with-comments.json");

            const expectedRules = getEmptyRules();
            expectedRules.set("rule-two", {
                ruleArguments: undefined,
                ruleSeverity: "error",
            });
            expectedRules.set("rule-three", {
                ruleArguments: ["//not a comment"],
                ruleSeverity: "error",
            });
            expectedRules.set("rule-four", {
                ruleArguments: ["/*also not a comment*/"],
                ruleSeverity: "error",
            });

            assertRulesEqual(config.rules, expectedRules);
            assertRulesEqual(config.jsRules, expectedRules);
        });

        it("can load .json files with BOM", () => {
            assert.doesNotThrow(() =>
                loadConfigurationFromPath("./test/config/tslint-with-bom.json"),
            );
        });

        it("can load .yaml files with comments", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-with-comments.yaml");

            const expectedRules = getEmptyRules();
            expectedRules.set("rule-two", {
                ruleArguments: undefined,
                ruleSeverity: "error",
            });
            expectedRules.set("rule-three", {
                ruleArguments: ["#not a comment"],
                ruleSeverity: "error",
            });

            assertRulesEqual(config.rules, expectedRules);
            assertRulesEqual(config.jsRules, expectedRules);
        });

        it("can load .yaml files with merge key", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-with-merge.yaml");

            const expectedRules = getEmptyRules();
            expectedRules.set("rule-one", {
                ruleArguments: undefined,
                ruleSeverity: "warning",
            });
            expectedRules.set("rule-two", {
                ruleArguments: ["common rule"],
                ruleSeverity: "error",
            });
            expectedRules.set("rule-three", {
                ruleArguments: ["ts rule"],
                ruleSeverity: "error",
            });

            const expectedJsRules = getEmptyRules();
            expectedJsRules.set("rule-one", {
                ruleArguments: undefined,
                ruleSeverity: "error",
            });
            expectedJsRules.set("rule-two", {
                ruleArguments: ["common rule"],
                ruleSeverity: "error",
            });
            expectedJsRules.set("rule-three", {
                ruleArguments: ["js rule"],
                ruleSeverity: "error",
            });

            assertRulesEqual(config.rules, expectedRules);
            assertRulesEqual(config.jsRules, expectedJsRules);
        });

        it("can load a built-in configuration", () => {
            const config = loadConfigurationFromPath("tslint:recommended");
            assert.strictEqual<RuleSeverity | undefined>(
                "error",
                config.jsRules.get("no-eval")!.ruleSeverity,
            );
            assert.strictEqual<RuleSeverity | undefined>(
                "error",
                config.rules.get("no-eval")!.ruleSeverity,
            );
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
        extends: [],
        jsRules: getEmptyRules(),
        linterOptions: {},
        rules: getEmptyRules(),
        rulesDirectory: [],
    };
}

function getEmptyRules(): Map<string, Partial<IOptions>> {
    return new Map<string, Partial<IOptions>>();
}

function demap<T>(map: Map<string, T>) {
    if (map == undefined) {
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
    // tslint:disable no-unsafe-any strict-boolean-expressions
    if (actual && (actual.jsRules || actual.rules)) {
        assertRulesEqual(actual.jsRules, expected.jsRules);
        assertRulesEqual(actual.rules, expected.rules);
    }
    // tslint:enable no-unsafe-any
}

function assertRulesEqual(
    actual: Map<string, Partial<IOptions>>,
    expected: Map<string, Partial<IOptions>>,
) {
    assert.deepEqual(demap(actual), demap(expected));
}
