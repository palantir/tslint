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

export const codeExamples = [
    {
        config: Lint.Utils.dedent`
            "rules": { "no-async-without-await": true }
        `,
        description: "Do not use the async keyword in case it is not actually needed",
        fail: Lint.Utils.dedent`
            async function f() {
                fetch();
            }

            async function f() {
                async function g() {
                    await h();
                }
            }
        `,
        pass: Lint.Utils.dedent`
            async function f() {
                await fetch();
            }

            const f = async () => {
                await fetch();
            };

            const f = async () => {
                return 'value';
            };
        `,
    },
];
