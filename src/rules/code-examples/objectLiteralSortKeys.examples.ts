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
        description: "Requires that an object literal's keys be sorted alphabetically.",
        config: Lint.Utils.dedent`
            "rules": { "object-literal-sort-keys": true }
        `,
        pass: Lint.Utils.dedent`
            let o = {
                bar: 2,
                foo: 1
            };
        `,
        fail: Lint.Utils.dedent`
            let o = {
                foo: 1,
                bar: 2
            };
        `
    },
    {
        description: Lint.Utils
            .dedent`Requires that an object literal's keys be sorted by interface-definition.
            If there is no interface fallback to alphabetically.`,
        config: Lint.Utils.dedent`
            "rules": {
                "object-literal-sort-keys": {
                    "options": "match-declaration-order"
                }
            }
        `,
        pass: Lint.Utils.dedent`
            interface I {
                foo: number;
                bar: number;
            }

            let o: I = {
                foo: 1,
                bar: 2
            };
        `,
        fail: Lint.Utils.dedent`
            interface I {
                foo: number;
                bar: number;
            }

            let o: I = {
                bar: 2,
                foo: 1
            };
        `
    }
];
