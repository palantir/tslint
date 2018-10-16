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
        description: "Requires a `default` case in `switch` statements.",
        config: Lint.Utils.dedent`
            "rules": { "switch-default": true }
        `,
        pass: Lint.Utils.dedent`
            let foo: number = 1;
            switch (foo) {
                case 1:
                    doSomething();
                    break;
                case 2:
                    doSomething2();
                    break;
                default:
                    console.log('default');
                    break;
            }
        `,
        fail: Lint.Utils.dedent`
            let foo: number = 1;
            switch (foo) {
                case 1:
                    doSomething();
                    break;
                case 2:
                    doSomething2();
                    break;
            }
        `
    }
];
