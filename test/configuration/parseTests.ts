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
import * as path from "path";
import { RawConfigFile } from "../../src/configuration/index";
import { parseConfigFile, parseConfigList } from "../../src/configuration/parse";
import { IOptions } from "../lint";
import { assertConfigEquals, buildConfig } from "./utils";

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
