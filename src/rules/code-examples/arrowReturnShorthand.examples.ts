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
        description:
            "Enforces usage of the shorthand return syntax when an arrow function's body does not span multiple lines.",
        config: Lint.Utils.dedent`
            "rules": { "arrow-return-shorthand": true }
        `,
        pass: Lint.Utils.dedent`
            const calc = (x: number, y: number) => ({ add: x + y, sub: x - y, mul: x * y });
            const calc2 = (x: number, y: number) => {
                return { add: x + y, sub: x - y, mul: x * y }
            };
        `,
        fail: Lint.Utils.dedent`
            const calc = (x: number, y: number) => { return { add: x + y, sub: x - y, mul: x * y } };
            const calc2 = (x: number, y: number) => {
                return { add: x + y, sub: x - y, mul: x * y }
            };
       `,
    },
    {
        description:
            "Enforces usage of the shorthand return syntax even when an arrow function's body spans multiple lines.",
        config: Lint.Utils.dedent`
            "rules": { "arrow-return-shorthand": [true, "multiline"] }
        `,
        pass: Lint.Utils.dedent`
            const calc = (x: number, y: number) => ({ add: x + y, sub: x - y, mul: x * y });
            const calc2 = (x: number, y: number) =>
                ({ add: x + y, sub: x - y, mul: x * y });
        `,
        fail: Lint.Utils.dedent`
            const calc = (x: number, y: number) => { return { add: x + y, sub: x - y, mul: x * y } };
            const calc2 = (x: number, y: number) => {
                return { add: x + y, sub: x - y, mul: x * y }
            };
       `,
    },
];
