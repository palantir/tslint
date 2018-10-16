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

import * as Lint from "../../index";

// tslint:disable: object-literal-sort-keys
export const codeExamples = [
    {
        description: "Require curly braces whenever possible (default)",
        config: Lint.Utils.dedent`
            "rules": { "curly": true }
        `,
        pass: Lint.Utils.dedent`
            if (x > 0) {
                doStuff();
            }
        `,
        fail: Lint.Utils.dedent`
            if (x > 0)
                doStuff();

            if (x > 0) doStuff();
        `
    },
    {
        description: "Make an exception for single-line instances",
        config: Lint.Utils.dedent`
            "rules": { "curly": [true, "ignore-same-line"] }
        `,
        pass: Lint.Utils.dedent`
            if (x > 0) doStuff();
        `,
        fail: Lint.Utils.dedent`
            if (x > 0)
                doStuff()
        `
    },
    {
        description: "Error on unnecessary curly braces",
        config: Lint.Utils.dedent`
            "rules": { "curly": [true, "as-needed"] }
        `,
        pass: Lint.Utils.dedent`
            if (x > 0)
                doStuff();

            if (x > 0) {
                customerUpdates.push(getInfo(customerId));
                return customerUpdates;
            }
        `,
        fail: Lint.Utils.dedent`
            if (x > 0) {
                doStuff();
            }
        `
    }
];
