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
import * as fs from "fs";
import * as path from "path";

import {
    findConfigurationPath,
    IConfigurationFile,
    loadConfigurationFromPath,
    parseConfigFile,
    parseConfigList,
    RawConfigFile,
    rulesForFile,
} from "../src/configuration";
import { IOptions, RuleSeverity } from "./../src/language/rule/rule";
import { createTempFile } from "./utils";

describe("Configuration", () => {
    describe("parseConfigFile", () => {
        it("parses empty config", () => {
            const rawConfig = {};
            const expected = buildConfig();
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
                    r: "garbage" as any,
                    s: { junk: 1 } as any,
                },
            };
            const expected = buildConfig();
            expected.rules.set("a", {});
            expected.rules.set("b", {});
            expected.rules.set("c", { ruleSeverity: "off" });
            expected.rules.set("d", { ruleSeverity: "off" });
            expected.rules.set("e", { ruleArguments: [1] });
            expected.rules.set("f", { ruleArguments: [2, 3], ruleSeverity: "off" });
            expected.rules.set("g", { ruleSeverity: "off" });
            expected.rules.set("h", { ruleSeverity: "warning" });
            expected.rules.set("i", { ruleSeverity: "warning" });
            expected.rules.set("j", { ruleSeverity: "error" });
            expected.rules.set("k", { ruleSeverity: "off" });
            expected.rules.set("l", { ruleArguments: [1] });
            expected.rules.set("m", { ruleArguments: [2] });
            expected.rules.set("n", { ruleArguments: [{ no: false }] });
            expected.rules.set("o", { ruleArguments: [1], ruleSeverity: "warning" });
            expected.rules.set("p", { ruleSeverity: "off" });
            expected.rules.set("q", {});
            expected.rules.set("r", {});
            expected.rules.set("s", {});
            assertConfigEquals(parseConfigFile(rawConfig), expected);
        });

        it("resolves exclude pattern relative to the configuration file", () => {
            const config: RawConfigFile = {
                linterOptions: {
                    exclude: ["foo.ts", "**/*.d.ts"],
                },
            };
            assert.deepEqual(
                parseConfigFile(config, "/path").linterOptions,
                {
                    exclude: [path.resolve("/path", "foo.ts"), path.resolve("/path", "**/*.d.ts")],
                },
            );
        });

        it("resolves overrides files and excludedFiles relative to the config file", () => {
            const config: RawConfigFile = {
                overrides: [{
                    excludedFiles: ["foo.ts", "**/*foo.d.ts"],
                    files: ["bar.ts", "**/*bar.d.ts"],
                    rules: {},
                }],
            };
            assert.deepEqual(
                parseConfigFile(config, "/path").overrides,
                [{
                    excludedFiles: ["/path/foo.ts", "/path/**/*foo.d.ts"],
                    files: ["/path/bar.ts", "/path/**/*bar.d.ts"],
                    rules: new Map(),
                }],
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
        const externalCustomRulesConfig = buildConfig({
            jsRules: new Map<string, Partial<IOptions>>([
                ["rule-one", {}],
                ["rule-two", { ruleSeverity: "off" as RuleSeverity }],
            ]),
            rules: new Map<string, Partial<IOptions>>([
                ["rule-one", {}],
                ["rule-two", { ruleSeverity: "off" as RuleSeverity }],
            ]),
        });

        it("overrides defaultSeverity of base configs", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-default-severity.json");
            assert.equal(config.defaultSeverity, "warning");
        });

        it("inherits defaultSeverity from base config if not specified", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-default-severity-only-in-extended.json");
            assert.equal(config.defaultSeverity, "warning");
        });

        it("applies defaultSeverity to preceding base configs", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-default-severity-precedence.json");
            assert.equal(config.defaultSeverity, "off");
        });

        it("extends with relative path", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-relative.json");

            assert.isArray(config.rulesDirectory);

            const extendedConfig = config.extends[0];
            assert.equal<RuleSeverity | undefined>(
                "error",
                extendedConfig.rules.get("no-fail")!.ruleSeverity,
                "should have 'no-fail' in extended config");
            assert.equal<RuleSeverity | undefined>("error", extendedConfig.jsRules.get("no-fail")!.ruleSeverity);

            assert.equal<RuleSeverity | undefined>(
                "off",
                config.rules.get("always-fail")!.ruleSeverity,
                "should have 'always-fail' in top config");
            assert.equal<RuleSeverity | undefined>("off", config.jsRules.get("always-fail")!.ruleSeverity);
        });

        it("extends with package", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-package.json");

            const expectedConfig = buildConfig({
                defaultSeverity: "error",
                extends: [externalCustomRulesConfig],
                jsRules: new Map([
                    ["rule-two", { ruleSeverity: "error" as RuleSeverity }],
                    ["rule-three", { ruleSeverity: "off" as RuleSeverity }],
                ]),
                rules: new Map([
                    ["rule-two", { ruleSeverity: "error" as RuleSeverity }],
                    ["rule-three", { ruleSeverity: "off" as RuleSeverity }],
                ]),
                rulesDirectory: [
                    path.resolve("./test/config/node_modules/tslint-test-custom-rules/rules"),
                ],
            });

            assertConfigEquals(config, expectedConfig);
        });

        it("extends with package - boolean configuration", () => {
            const expectedConfig = buildConfig({
                defaultSeverity: "error",
                extends: [externalCustomRulesConfig],
                jsRules: new Map<string, Partial<IOptions>>([
                    ["rule-two", {}],
                    ["rule-three", { ruleSeverity: "off" as RuleSeverity }],
                ]),
                rules: new Map<string, Partial<IOptions>>([
                    ["rule-two", {}],
                    ["rule-three", { ruleSeverity: "off" as RuleSeverity }],
                ]),
                rulesDirectory: [
                    path.resolve("./test/config/node_modules/tslint-test-custom-rules/rules"),
                ],
            });

            const config = loadConfigurationFromPath("./test/config/tslint-extends-package-boolean.json");

            assertConfigEquals(config, expectedConfig);
        });

        it("extends only severity or only arguments", () => {
            const expectedConfig = buildConfig({
                defaultSeverity: "error",
                extends: [externalCustomRulesConfig],
                jsRules: new Map([
                    ["always-fail", { ruleSeverity: "warning" as RuleSeverity }],
                ]),
                rules: new Map([
                    ["always-fail", { ruleArguments: [2] }],
                ]),
                rulesDirectory: [
                    path.resolve("./test/config/node_modules/tslint-test-custom-rules/rules"),
                ],
            });
            const config = loadConfigurationFromPath("./test/config/tslint-extends-package-partial.json");

            assertConfigEquals(config, expectedConfig);
        });

        it("extends with package without customization", () => {
            const expectedConfig = buildConfig({
                defaultSeverity: "error",
                extends: [externalCustomRulesConfig],
                rulesDirectory: [
                    path.resolve("./test/config/node_modules/tslint-test-custom-rules/rules"),
                ],
            });

            const config = loadConfigurationFromPath("./test/config/tslint-extends-package-no-mod.json");

            assertConfigEquals(config, expectedConfig);
        });

        it("extends with builtin", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-builtin.json");
            const latestConfig = config.extends[0];
            const recommendedConfig = latestConfig.extends[0];

            assert.isUndefined(recommendedConfig.jsRules.get("no-var-keyword"));
            assert.equal<RuleSeverity | undefined>(
                "off",
                config.jsRules.get("no-eval")!.ruleSeverity,
                "has no-eval override in base config",
            );
            assert.deepEqual<Partial<IOptions> | undefined>(
                {},
                recommendedConfig.rules.get("no-var-keyword"),
                "has empty config for no-var-keyword in extended config",
            );
            assert.equal<RuleSeverity | undefined>("off", config.rules.get("no-eval")!.ruleSeverity);
        });

        it("resolve rule directory from package", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-custom-rules-with-package.json");
            assert.deepEqual(config.rulesDirectory, [path.join(process.cwd(), "test/config/node_modules/tslint-test-custom-rules/rules")]);
        });

        it("resolve rule directory from package fallback", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-custom-rules-with-package-fallback.json");
            assert.deepEqual(config.rulesDirectory, [path.join(process.cwd(), "test/config/relative-rules-directory")]);
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
                fs.writeFileSync(tmpfile!, JSON.stringify({ extends: "tslint-test-config-non-relative" }));
                const config = loadConfigurationFromPath(tmpfile!);
                const extendedConfig = config.extends[0];

                assertDeepMapEquals(extendedConfig.rules, new Map<string, Partial<IOptions>>([
                    ["class-name", {}],
                ]));
            });
        });

        it("extends with package two levels (and relative path in rulesDirectory)", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-package-two-levels.json");

            assert.lengthOf(config.rulesDirectory, 2);
            assert.isTrue(fs.existsSync(config.rulesDirectory[0]));
            assert.isTrue(fs.existsSync(config.rulesDirectory[1]));

            const expectedBaseRules = new Map([
                ["always-fail", { ruleSeverity: "off" }],
            ]);
            assertDeepMapEquals(config.jsRules, expectedBaseRules);
            assertDeepMapEquals(config.rules, expectedBaseRules);

            const expectedFirstExtendRules = new Map<string, Partial<IOptions>>([
                ["rule-two", {}],
                ["rule-four", {}],
            ]);
            assertDeepMapEquals(config.extends[0].jsRules, expectedFirstExtendRules);
            assertDeepMapEquals(config.extends[0].rules, expectedFirstExtendRules);

            const expectedSecondExtendRules = new Map<string, Partial<IOptions>>([
                ["rule-one", {}],
                ["rule-two", { ruleSeverity: "off" }],
            ]);
            assertDeepMapEquals(config.extends[0].extends[0].jsRules, expectedSecondExtendRules);
            assertDeepMapEquals(config.extends[0].extends[0].rules, expectedSecondExtendRules);
        });

        it("extends with array", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-package-array.json");

            const expectedBaseRules = new Map([
                ["always-fail", { ruleSeverity: "off" }],
            ]);
            assertDeepMapEquals(config.jsRules, expectedBaseRules);
            assertDeepMapEquals(config.rules, expectedBaseRules);

            const expectedFirstExtendRules = new Map<string, Partial<IOptions>>([
                ["rule-one", {}],
                ["rule-two", { ruleSeverity: "off" }],
            ]);
            assertDeepMapEquals(config.extends[0].jsRules, expectedFirstExtendRules);
            assertDeepMapEquals(config.extends[0].rules, expectedFirstExtendRules);

            const expectedSecondExtendRules = new Map([
                ["always-fail", { ruleSeverity: "error" }],
                ["no-fail", { ruleSeverity: "error" }],
                ["rule-two", { ruleSeverity: "error" }],
            ]);
            assertDeepMapEquals(config.extends[1].jsRules, expectedSecondExtendRules);
            assertDeepMapEquals(config.extends[1].rules, expectedSecondExtendRules);
        });

        it("can load .json files with comments", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-with-comments.json");

            const expectedRules = new Map<string, Partial<IOptions>>([
                ["rule-two", { ruleSeverity: "error" }],
                ["rule-three", { ruleArguments: ["//not a comment"] }],
                ["rule-four", { ruleArguments: ["/*also not a comment*/"] }],
            ]);

            assertDeepMapEquals(config.rules, expectedRules);
            assertDeepMapEquals(config.jsRules, expectedRules);
        });

        it("can load .json files with BOM", () => {
            assert.doesNotThrow(() => loadConfigurationFromPath("./test/config/tslint-with-bom.json"));
        });

        it("can load .yaml files with comments", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-with-comments.yaml");

            const expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("rule-two", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-three", { ruleArguments: ["#not a comment"] });

            assertDeepMapEquals(config.rules, expectedConfig.rules);
            assertDeepMapEquals(config.jsRules, expectedConfig.rules);
        });

        it("can load a built-in configuration", () => {
            const config = loadConfigurationFromPath("tslint:recommended");
            assert.strictEqual<RuleSeverity | undefined>(undefined, config.jsRules.get("no-eval")!.ruleSeverity);
            assert.strictEqual<RuleSeverity | undefined>(undefined, config.rules.get("no-eval")!.ruleSeverity);
        });

        it("throws on an invalid built-in configuration path", () => {
            assert.throws(() => {
                loadConfigurationFromPath("tslint:doesnotexist");
            });
        });
    });
});

describe("parseConfigList", () => {
    let availableConfig: { [name: string]: RawConfigFile };
    const readConfig = (filePath: string, dir: string) => {
        const foundConfig = availableConfig[`${dir}/${filePath}`];
        if (foundConfig === undefined) {
            throw new Error(`no config at: ${dir}/${filePath}`);
        }

        return { config: foundConfig, filePath };
    };
    const resolveRulesDirectories = (dirs: string[]) => dirs;

    beforeEach(() => {
        availableConfig = {};
    });

    it("links an extended config", () => {
        availableConfig["./a"] = {
            rules: {
                ruleName: [true],
            },
        };
        const rawConfig = {
            extends: "a",
        };

        const config = parseConfigList(rawConfig, ".", readConfig);
        const expected = buildConfig({
            extends: [buildConfig({
                rules: new Map<string, Partial<IOptions>>([
                    ["ruleName", {}],
                ]),
            })],
        });
        expected.defaultSeverity = "error";

        assertConfigEquals(config, expected);
    });

    it("accumulates and de-dups rulesDirectory in the base config", () => {
        availableConfig["./a"] = {
            rulesDirectory: "dir-1",
        };
        availableConfig["./b"] = {
            rulesDirectory: ["dir-2", "dir-3"],
        };
        availableConfig["./c"] = {
            rulesDirectory: ["dir-2"],
        };
        const rawConfig = {
            extends: ["a", "b", "c"],
        };

        const config = parseConfigList(rawConfig, ".", readConfig, resolveRulesDirectories);

        assert.deepEqual(config.rulesDirectory, ["dir-1", "dir-2", "dir-3"]);
    });

    it("backfills exclude options and the last extends wins", () => {
        availableConfig["./a"] = {
            linterOptions: {
                exclude: ["src"],
            },
        };
        availableConfig["./b"] = {
            linterOptions: {
                exclude: ["lib", "bin"],
            },
        };

        const baseConfig = {
            extends: ["a", "b"],
        };

        const config = parseConfigList(baseConfig, ".", readConfig, resolveRulesDirectories);

        assert.deepEqual(config.linterOptions, {
            exclude: [
                path.resolve("lib"),
                path.resolve("bin"),
            ],
        });
    });

    it("prefers the base config exclude option over the extended config", () => {
        availableConfig["./a"] = {
            linterOptions: {
                exclude: ["bin"],
            },
        };

        const baseConfig = {
            extends: "a",
            linterOptions: {
                exclude: ["src"],
            },
        };
        const config = parseConfigList(baseConfig, ".", readConfig, resolveRulesDirectories);

        assert.deepEqual(config.linterOptions, {
            exclude: [
                path.resolve("src"),
            ],
        });
    });

    it("prefers a shallow config exclude option over a deep config", () => {
        availableConfig["./a"] = {
            extends: ["b"],
            linterOptions: {
                exclude: ["src"],
            },
        };
        availableConfig["./b"] = {
            linterOptions: {
                exclude: ["lib", "bin"],
            },
        };

        const baseConfig = {
            extends: ["a"],
        };

        const config = parseConfigList(baseConfig, ".", readConfig, resolveRulesDirectories);

        assert.deepEqual(config.linterOptions, {
            exclude: [
                path.resolve("src"),
            ],
        });
    });

    it("empty linter options does not replace exclude", () => {
        availableConfig["./a"] = {
            linterOptions: {
                exclude: ["src"],
            },
        };

        const baseConfig = {
            extends: ["a"],
            linterOptions: {},
        };

        const config = parseConfigList(baseConfig, ".", readConfig, resolveRulesDirectories);

        assert.deepEqual(config.linterOptions, {
            exclude: [
                path.resolve("src"),
            ],
        });
    });

    it("extending sets the default severity", () => {
        availableConfig["./a"] = {
            defaultSeverity: "warning",
        };

        const baseConfig = {
            extends: "a",
        };

        const config = parseConfigList(baseConfig, ".", readConfig, resolveRulesDirectories);

        assert.equal(config.defaultSeverity, "warning");
    });
});

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

    describe("overrides", () => {
        it("overrides the ruleSeverity when the file name matches", () => {
            const config = buildConfig({
                overrides: [{
                    excludedFiles: [],
                    files: [path.resolve("file-name")],
                    rules: new Map([
                        ["ruleName", { ruleSeverity: "warning" as RuleSeverity }],
                    ]),
                }],
                rules: new Map([
                    ["ruleName", { ruleSeverity: "error" as RuleSeverity, ruleArguments: ["arg"] }],
                ]),
            });

            const rules = rulesForFile(config, "file-name");

            assert.deepEqual(rules, [
                buildRuleOptions({ ruleArguments: ["arg"], ruleName: "ruleName", ruleSeverity: "warning" }),
            ]);
        });

        it("overrides the ruleArguments when the file name matches", () => {
            const config = buildConfig({
                overrides: [{
                    excludedFiles: [],
                    files: [path.resolve("file-name")],
                    rules: new Map([
                        ["ruleName", { ruleArguments: ["overrideArg"] }],
                    ]),
                }],
                rules: new Map([
                    ["ruleName", { ruleSeverity: "error" as RuleSeverity, ruleArguments: ["arg"] }],
                ]),
            });

            const rules = rulesForFile(config, "file-name");

            assert.deepEqual(rules, [
                buildRuleOptions({ ruleSeverity: "error" as RuleSeverity, ruleName: "ruleName", ruleArguments: ["overrideArg"] }),
            ]);
        });

        it("applies overrides in order", () => {
            const config = buildConfig({
                overrides: [
                    {
                        excludedFiles: [],
                        files: [path.resolve("file-name")],
                        rules: new Map([
                            ["ruleName", { ruleSeverity: "warning" as RuleSeverity }],
                        ]),
                    },
                    {
                        excludedFiles: [],
                        files: [path.resolve("file-name")],
                        rules: new Map([
                            ["ruleName", { ruleSeverity: "off" as RuleSeverity }],
                        ]),
                    },
                ],
                rules: new Map([
                    ["ruleName", { ruleSeverity: "error" as RuleSeverity, ruleArguments: ["arg"] }],
                ]),
            });

            const rules = rulesForFile(config, "file-name");

            assert.deepEqual(rules, [
                buildRuleOptions({ ruleSeverity: "off" as RuleSeverity, ruleName: "ruleName", ruleArguments: ["arg"] }),
            ]);
        });

        it("does not override when the file name does not match", () => {
            const config = buildConfig({
                overrides: [{
                    excludedFiles: [],
                    files: [path.resolve("file-name")],
                    rules: new Map([
                        ["ruleName", { ruleSeverity: "warning" as RuleSeverity }],
                    ]),
                }],
                rules: new Map([
                    ["ruleName", { ruleSeverity: "error" as RuleSeverity, ruleArguments: ["arg"] }],
                ]),
            });

            const rules = rulesForFile(config, "no-match");

            assert.deepEqual(rules, [
                buildRuleOptions({ ruleSeverity: "error" as RuleSeverity, ruleName: "ruleName", ruleArguments: ["arg"] }),
            ]);
        });

        it("excludedFiles overrides files matching", () => {
            const config = buildConfig({
                overrides: [{
                    excludedFiles: [path.resolve("file-name")],
                    files: [path.resolve("file-name")],
                    rules: new Map([
                        ["ruleName", { ruleSeverity: "warning" as RuleSeverity }],
                    ]),
                }],
                rules: new Map([
                    ["ruleName", { ruleSeverity: "error" as RuleSeverity, ruleArguments: ["arg"] }],
                ]),
            });

            const rules = rulesForFile(config, "file-name");

            assert.deepEqual(rules, [
                buildRuleOptions({ ruleSeverity: "error" as RuleSeverity, ruleName: "ruleName", ruleArguments: ["arg"] }),
            ]);
        });
    });
});

function getEmptyConfig(): IConfigurationFile {
    return {
        extends: [],
        jsRules: new Map<string, Partial<IOptions>>(),
        linterOptions: {},
        rules: new Map<string, Partial<IOptions>>(),
        rulesDirectory: [],
    };
}

export function buildConfig(overrides: Partial<IConfigurationFile> = {}): IConfigurationFile {
    return {
        extends: [],
        jsRules: new Map(),
        linterOptions: {},
        overrides: [],
        rules: new Map(),
        rulesDirectory: [],
        ...overrides,
    };
}

export function buildRuleOptions(overrides: Partial<IOptions> = {}): IOptions {
    return {
        disabledIntervals: [],
        ruleArguments: [],
        ruleName: "ruleName",
        ruleSeverity: "error",
        ...overrides,
    };

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

// this is needed since `deepEqual` doesn't go into Map object
export function assertConfigEquals(actual: IConfigurationFile, expected: IConfigurationFile) {
    assert.deepEqual(demapConfig(actual), demapConfig(expected));
}

export function demapConfig(config: IConfigurationFile) {
    // tslint:disable:no-unsafe-any
    const copy: any = { ...config };

    if (copy.jsRules) {
        copy.jsRules = demap(copy.jsRules);
    }

    if (copy.rules) {
        copy.rules = demap(copy.rules);
    }

    if (Array.isArray(copy.extends)) {
        copy.extends = copy.extends.map(demapConfig);
    }
    // tslint:enable

    return copy;
}

export function assertDeepMapEquals(actual: Map<any, any>, expected: Map<any, any>, message?: string) {
    assert.deepEqual(demap(actual), demap(expected), message);
}
