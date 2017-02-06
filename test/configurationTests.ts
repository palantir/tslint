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

import { extendConfigurationFile, IConfigurationFile, loadConfigurationFromPath } from "../src/configuration";
import { createTempFile } from "./utils";

describe("Configuration", () => {
    it("extendConfigurationFile", () => {
        const EMPTY_CONFIG: IConfigurationFile = {
            jsRules: {},
            linterOptions: {},
            rules: {},
            rulesDirectory: [],
        };

        assert.deepEqual(extendConfigurationFile({}, {}), EMPTY_CONFIG);
        assert.deepEqual(extendConfigurationFile({}, EMPTY_CONFIG), EMPTY_CONFIG);
        assert.deepEqual(extendConfigurationFile(EMPTY_CONFIG, {}), EMPTY_CONFIG);
        assert.deepEqual(extendConfigurationFile({}, {
            jsRules: { row: "oar" },
            linterOptions: {},
            rules: { foo: "bar" },
            rulesDirectory: "foo",
        }), {
            jsRules: { row: "oar" },
            linterOptions: {},
            rules: {foo: "bar"},
            rulesDirectory: ["foo"],
        });
        const actualConfig = extendConfigurationFile({
            jsRules: { row: "oar" },
            linterOptions: {},
            rules: {
                a: 1,
                b: 1,
            },
            rulesDirectory: ["foo", "bar"],
        }, {
            jsRules: { fly: "wings" },
            linterOptions: {},
            rules: {
                b: 2,
                c: 3,
            },
            rulesDirectory: "baz",
            });
        /* tslint:disable:object-literal-sort-keys */
        const expectedConfig = {
            jsRules: {
                row: "oar",
                fly: "wings",
            },
            linterOptions: {},
            rules: {
                a: 1,
                b: 2,
                c: 3,
            },
            rulesDirectory: ["foo", "bar", "baz"],
        };
        assert.deepEqual(actualConfig, expectedConfig);
    });

    describe("loadConfigurationFromPath", () => {
        it("extends with relative path", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-relative.json");

            assert.isArray(config.rulesDirectory);
            assert.equal("error", config.rules["no-fail"].severity, "did not pick up 'no-fail' in base config");
            assert.equal("none", config.rules["always-fail"].severity, "did not set 'always-fail' in top config");
            assert.equal("error", config.jsRules["no-fail"].severity);
            assert.equal("none", config.jsRules["always-fail"].severity);
        });

        it("extends with package", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-package.json");

            assert.isArray(config.rulesDirectory);
            /* tslint:disable:object-literal-sort-keys */
            assert.deepEqual(config.jsRules, {
                "rule-one": true,
                "rule-three": {
                    severity: "none",
                },
                "rule-two": {
                    severity: "error",
                },
            });
            assert.deepEqual(config.rules, {
                "rule-one": true,
                "rule-three": {
                    severity: "none",
                },
                "rule-two": {
                    severity: "error",
                },
            });
            /* tslint:enable:object-literal-sort-keys */
        });

        it("extends with package without customization", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-package-no-mod.json");

            assert.isArray(config.rulesDirectory);
            assert.deepEqual(config.jsRules, {
                "rule-one": true,
                "rule-two": false,
            });
            assert.deepEqual(config.rules, {
                "rule-one": true,
                "rule-two": false,
            });
        });

        it("extends with builtin", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-builtin.json");
            assert.isUndefined(config.jsRules["no-var-keyword"]);
            assert.equal("none", config.jsRules["no-eval"].severity);
            assert.isTrue(config.rules["no-var-keyword"]);
            assert.equal("none", config.rules["no-eval"].severity);
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
                assert.deepEqual(config.rules, {
                    "class-name": true,
                });
            });
        });

        it("extends with package two levels (and relative path in rulesDirectory)", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-package-two-levels.json");

            assert.isArray(config.rulesDirectory);
            assert.lengthOf(config.rulesDirectory, 2);
            assert.isTrue(fs.existsSync(config.rulesDirectory![0]));
            assert.isTrue(fs.existsSync(config.rulesDirectory![1]));
            /* tslint:disable:object-literal-sort-keys */
            assert.deepEqual(config.jsRules, {
                "always-fail": {
                    severity: "none",
                },
                "rule-one": true,
                "rule-two": true,
                "rule-four": true,
            });
            assert.deepEqual(config.rules, {
                "always-fail": {
                    severity: "none",
                },
                "rule-one": true,
                "rule-two": true,
                "rule-four": true,
            });
            /* tslint:enable:object-literal-sort-keys */
        });

        it("extends with array", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-extends-package-array.json");

            assert.isArray(config.rulesDirectory);
            assert.deepEqual(config.jsRules, {
                "always-fail": {
                    severity: "none",
                },
                "no-fail": {
                    severity: "error",
                },
                "rule-one": true,
                "rule-two": {
                    severity: "error",
                },
            });
            assert.deepEqual(config.rules, {
                "always-fail": {
                    severity: "none",
                },
                "no-fail": {
                    severity: "error",
                },
                "rule-one": true,
                "rule-two": {
                    severity: "error",
                },
            });
        });

        it("can load .json files with comments", () => {
            const config = loadConfigurationFromPath("./test/config/tslint-with-comments.json");

            /* tslint:disable:object-literal-sort-keys */
            assert.deepEqual(config.jsRules, {
                "rule-two": {
                    severity: "error",
                },
                "rule-three": "//not a comment",
                "rule-four": "/*also not a comment*/",
            });
            assert.deepEqual(config.rules, {
                "rule-two": {
                    severity: "error",
                },
                "rule-three": "//not a comment",
                "rule-four": "/*also not a comment*/",
            });
            /* tslint:enable:object-literal-sort-keys */
        });

        it("can load .json files with BOM", () => {
            assert.doesNotThrow(() => loadConfigurationFromPath("./test/config/tslint-with-bom.json"));
        });

        it("can load a built-in configuration", () => {
            const config = loadConfigurationFromPath("tslint:recommended");
            assert.isTrue(config.jsRules["no-eval"]);
            assert.isTrue(config.rules["no-eval"]);
        });

        it("throws on an invalid built-in configuration path", () => {
            assert.throws(() => {
                loadConfigurationFromPath("tslint:doesnotexist");
            });
        });
    });
});
