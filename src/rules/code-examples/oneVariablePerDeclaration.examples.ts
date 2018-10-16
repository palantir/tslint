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
        description: "Disallows multiple variable definitions in the same declaration statement.",
        config: Lint.Utils.dedent`
            "rules": { "one-variable-per-declaration": true }
        `,
        pass: Lint.Utils.dedent`
            const foo = 1;
            const bar = '2';
        `,
        fail: Lint.Utils.dedent`
            const foo = 1, bar = '2';
       `
    },
    {
        description:
            "Disallows multiple variable definitions in the same declaration statement but allows them in for-loops.",
        config: Lint.Utils.dedent`
            "rules": { "one-variable-per-declaration": [true, "ignore-for-loop"] }
        `,
        pass: Lint.Utils.dedent`
            for (let i = 0, j = 10; i < 10; i++) {
                doSomething(j, i);
            }
        `
    }
];
