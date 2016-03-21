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

import {IConfigFile, extendConfigFile, getRulesDirectories} from "../src/configuration";
import {loadRules} from "./lint";

describe("Configuration", () => {
    it("extendConfigFile", () => {
        const EMPTY_CONFIG: IConfigFile = {
            rules: {},
            rulesDirectory: [],
        };

        assert.deepEqual(extendConfigFile({}, {}), EMPTY_CONFIG);
        assert.deepEqual(extendConfigFile({}, EMPTY_CONFIG), EMPTY_CONFIG);
        assert.deepEqual(extendConfigFile(EMPTY_CONFIG, {}), EMPTY_CONFIG);
        assert.deepEqual(extendConfigFile({}, {rules: {foo: "bar"}, rulesDirectory: "foo"}), {
            rules: {foo: "bar"},
            rulesDirectory: ["foo"],
        });
        assert.deepEqual(extendConfigFile({
            rules: {
                "a": 1,
                "b": 2,
            },
            rulesDirectory: ["foo", "bar"],
        }, {
            rules: {
                "b": 1,
                "c": 3,
            },
            rulesDirectory: "baz",
        }), {
            rules: {
                "a": 1,
                "b": 2,
                "c": 3,
            },
            rulesDirectory: ["foo", "bar", "baz"],
        });
    });

    it("resolves rules directories with a node_module: prefix correctly", () => {
        const resolvedDirectories = getRulesDirectories("node_module:tslint-eslint-rules/dist/rules");
        const rules = loadRules({"valid-typeof": true}, {}, resolvedDirectories);
        assert.strictEqual(rules.length, 1);
    });
});
