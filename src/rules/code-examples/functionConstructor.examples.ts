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

export const codeExamples = [
    {
        config: Lint.Utils.dedent`
            "rules": { "function-constructor": true }
        `,
        description: "Use inline lambdas instead of calling Function",
        fail: Lint.Utils.dedent`
            let doesNothing = new Function();
        `,
        pass: Lint.Utils.dedent`
            let doesNothing = () => {};
        `,
    },
    {
        config: Lint.Utils.dedent`
            "rules": { "function-constructor": true }
        `,
        description: "Use parameters instead of constructor strings",
        fail: Lint.Utils.dedent`
            let addNumbers = new Function("a", "b", "return a + b");
        `,
        pass: Lint.Utils.dedent`
            let addNumbers = (a, b) => a + b;
        `,
    },
];
