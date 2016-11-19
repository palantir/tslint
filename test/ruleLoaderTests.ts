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

import {loadRules} from "./lint";

describe("Rule Loader", () => {
    const RULES_DIRECTORY = "build/src/rules";

    it("loads core rules", () => {
        const validConfiguration: {[name: string]: any} = {
            "class-name": true,
            "eofline": true,
            "forin": false,
            "no-debugger": true,
            "quotemark": "single",
        };

        const rules = loadRules(validConfiguration, {}, RULES_DIRECTORY);
        assert.equal(rules.length, 5);
    });

    it("throws if an invalid rule is found", () => {
        const invalidConfiguration: {[name: string]: any} = {
            invalidConfig1: true,
            invalidConfig2: false,
        };

        assert.throws(
            () => loadRules(invalidConfiguration, {}, RULES_DIRECTORY),
            /invalidConfig1\ninvalidConfig2/,
        );
    });

    it("doesn't ignore leading or trailing underscores or dashes", () => {
        /* tslint:disable:object-literal-sort-keys */
        const invalidConfiguration: {[name: string]: any} = {
            "_indent": 6,
            "forin_": true,
            "-quotemark": "single",
            "eofline-": true,
        };
        /* tslint:enable:object-literal-sort-keys */

        assert.throws(
            () => loadRules(invalidConfiguration, {}, RULES_DIRECTORY),
            /_indent\nforin_\n-quotemark\neofline-/,
        );
    });

    it("works with rulesDirectory argument as an Array", () => {
        const validConfiguration: {[name: string]: any} = {
            "class-name": true,
            "eofline": true,
            "forin": false,
            "no-debugger": true,
            "quotemark": "single",
        };

        const rules = loadRules(validConfiguration, {}, [RULES_DIRECTORY]);
        assert.equal(rules.length, 5);
    });

    it("loads js rules", () => {
        const validConfiguration: {[name: string]: any} = {
            "class-name": true,
        };

        const rules = loadRules(validConfiguration, {}, RULES_DIRECTORY, true);
        assert.equal(rules.length, 1);
    });

    it("throws if an invalid rule is adopted", () => {
        const invalidConfiguration: {[name: string]: any} = {
            "array-type": [true, "array"],
        };

        assert.throws(
            () => loadRules(invalidConfiguration, {}, RULES_DIRECTORY, true),
            /array-type/,
        );
    });
});
