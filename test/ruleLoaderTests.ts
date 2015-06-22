/*
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

describe("Rule Loader", () => {
    const path = require("path");
    const rulesDirectory = path.join(global.process.cwd(), "build/rules");

    it("loads core rules", () => {
        const validConfiguration: {[name: string]: any} = {
            "forin": false,
            "quotemark": "single",
            "eofline": true,
            "class-name": true,
            "no-debugger": true
        };

        const rules = Lint.loadRules(validConfiguration, {}, rulesDirectory);
        assert.equal(rules.length, 5);
    });

    it("skips invalid rules", () => {
        const invalidConfiguration: {[name: string]: any} = {
            "invalidConfig1": true,
            "invalidConfig2": false
        };

        const rules = Lint.loadRules(invalidConfiguration, {}, rulesDirectory);
        assert.deepEqual(rules, []);
    });

    it("doesn't ignore leading or trailing underscores or dashes", () => {
        const invalidConfiguration: {[name: string]: any} = {
            "_indent": 6,
            "forin_": true,
            "-quotemark": "single",
            "eofline-": true
        };

        const rules = Lint.loadRules(invalidConfiguration, {}, rulesDirectory);
        assert.deepEqual(rules, []);
    });
});
