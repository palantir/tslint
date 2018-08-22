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
        description: "Prefer `while` loops instead of `for` loops without an initializer and incrementor.",
        config: Lint.Utils.dedent`
            "rules": { "prefer-while": true }
        `,
        pass: Lint.Utils.dedent`
            for(let i = 1; i < 10; i++) {
                console.log(i);
            }

            for (let i = 0; i < 10; i+=1) {
                console.log(i);
            }

            for (let i = 0; i < 10;) {
                i += 1;
            }
        `,
        fail: Lint.Utils.dedent`
            for(;;) {
                console.log('Hello World');
            }

            for(;true===true;) {
                console.log('Hello World');
            }
        `,
    },
];
