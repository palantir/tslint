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

/// <reference path='references.ts' />

describe("Configuration", () => {
    it("recognizes valid rules", () => {
        var validConfiguration = {
            "forin": false,
            "quotemark": "single",
            "eofline": true,
            "indent": 6,
            "debug": true
        };
        
        var rules = Lint.Configuration.getConfiguredRules(validConfiguration);
        assert.equal(rules.length, 5);
    });

    it("skips invalid rules", () => {
        var invalidConfiguration = {
            "invalidConfig1": true,
            "invalidConfig2": false
        };

        var rules = Lint.Configuration.getConfiguredRules(invalidConfiguration);
        assert.deepEqual(rules, []);
    });
});
