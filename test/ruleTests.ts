/*
 * Copyright 2017 Palantir Technologies, Inc.
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

import { parseConfigFile } from "../src/configuration";
import { Linter } from "../src/linter";

describe("no-implicit-dependencies", () => {
    it("assumes empty package.json if not found", () => {
        const linter = new Linter({
            fix: false,
            formatter: "prose"
        });
        const config = parseConfigFile({
            rules: {
                "no-implicit-dependencies": true
            }
        });
        linter.lint(
            "/builtin-only.ts",
            `
                import * as fs from 'fs';
                const path = require('path');
            `,
            config
        );
        assert.equal(linter.getResult().errorCount, 0, "no error expected");

        linter.lint(
            "/test.ts",
            `
                import {assert} from "chai";
            `,
            config
        );
        assert.equal(linter.getResult().errorCount, 1, "expected one error");
    });
});
