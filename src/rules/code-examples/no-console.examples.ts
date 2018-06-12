/**
 * @license
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

import * as Lint from "../../index";

// tslint:disable: object-literal-sort-keys
export const codeExamples = [
    {
        description: "Disallow all console calls (default)",
        config: Lint.Utils.dedent`
            "rules": { "no-console": true }
        `,
        pass: Lint.Utils.dedent`
            LogService.Log("Hello world!");
        `,
        fail: Lint.Utils.dedent`
            console.log("Hello world!");
        `,
    },
    {
        description: "Choose which console methods to disallow",
        config: Lint.Utils.dedent`
            "rules": { "no-console": [true, "log", "warn"] }
        `,
        pass: Lint.Utils.dedent`
            LogService.Log("Hello world!");
            console.error("Something went wrong...");
        `,
        fail: Lint.Utils.dedent`
            console.log("Hello world!");
            console.warn("Something concerning happened...");
        `,
    },
    {
        description: "Choose which console methods to disallow and provide a custom error message",
        config: Lint.Utils.dedent`
            "rules": {
                "no-console": [
                    true,
                    {
                        "banned-methods": ["error"],
                        "failure-string": "Instead of using console, try importing LogService."
                    }
                ]
            }
        `,
        pass: Lint.Utils.dedent`
            LogService.Log("Hello world!");
            console.log("Hello world!");
        `,
        fail: Lint.Utils.dedent`
            console.error("Something went wrong...");
            // Calls to 'console.error' are not allowed. Instead of using console, try importing LogService.
        `,
    },
];
