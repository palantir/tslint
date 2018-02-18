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
} from "../src/configuration";
import { IOptions, RuleSeverity } from "./../src/language/rule/rule";
import { assertConfigEquals, assertDeepMapEquals, buildConfig } from "./configuration/utils";
import { createTempFile } from "./utils";

describe("Configuration", () => {
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

function getEmptyConfig(): IConfigurationFile {
    return {
        extends: [],
        jsRules: new Map<string, Partial<IOptions>>(),
        linterOptions: {},
        rules: new Map<string, Partial<IOptions>>(),
        rulesDirectory: [],
    };
}
