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
        description: "Disallows usages of `any` as a type declaration.",
        config: Lint.Utils.dedent`
            "rules": { "no-any": true }
        `,
        pass: Lint.Utils.dedent`
            let foo: object;
        `,
        fail: Lint.Utils.dedent`
            let foo: any;
        `,
    },
    {
        description:
            "Disallows usages of `any` as a type declaration except rest spread parameters.",
        config: Lint.Utils.dedent`
            "rules": { "no-any": [true, "ignore-rest-args"] }
        `,
        pass: Lint.Utils.dedent`
            function foo(a: number, ...rest: any[]): void {
                return;
            }
        `,
    },
];
