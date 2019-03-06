/**
 * @license
 * Copyright 2019 Palantir Technologies, Inc.
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
            'Disallows "else" following "if" blocks ending with "return", "break", "continue" or "throw" statement. ',
        config: Lint.Utils.dedent`
            "rules": { "unnecessary-else": true }
        `,
        pass: Lint.Utils.dedent`
            if (someCondition()) {
                return;
            }
            // some code here

            if (someCondition()) {
                continue;
            }
            // some code here

            if (someCondition()) {
                throw;
            }
            // some code here

            if (someCondition()) {
                break;
            }
            // some code here

        `,
        fail: Lint.Utils.dedent`
            if (someCondition()) {
                return;
            } else {
                // some code here
            }

            if (someCondition()) {
                break;
            } else {
                // some code here
            }

            if (someCondition()) {
                throw;
            } else {
                // some code here
            }

            if (someCondition()) {
                continue;
            } else {
                // some code here
            }
        `,
    },
];
