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
        description: "Disallows usage of comparison operators with non-primitive types.",
        config: Lint.Utils.dedent`
            "rules": { "strict-comparisons": true }
        `,
        pass: Lint.Utils.dedent`
            const object1 = {};
            const object2 = {};
            if (isEqual(object1, object2)) {}
        `,
        fail: Lint.Utils.dedent`
            const object1 = {};
            const object2 = {};
            if (object1 === object2) {}
        `,
    },
    {
        description:
            "Allows equality operators to be used with non-primitive types, while still disallowing the use of greater than and less than.",
        config: Lint.Utils.dedent`
            "rules": { "strict-comparisons": [true, {  "allow-object-equal-comparison": true }] }
        `,
        pass: Lint.Utils.dedent`
            const object1 = {};
            const object2 = {};
            if (object1 === object2) {}
        `,
        fail: Lint.Utils.dedent`
            const object1 = {};
            const object2 = {};
            if (object1 < object2) {}
        `,
    },
    {
        description: "Allows ordering operators to be used with string types.",
        config: Lint.Utils.dedent`
            "rules": { "strict-comparisons": [true, {  "allow-string-order-comparison": true }] }
        `,
        pass: Lint.Utils.dedent`
            const string1 = "";
            const string2 = "";
            if (string1 < string2) {}
        `,
        fail: Lint.Utils.dedent`
            const object1 = {};
            const object2 = {};
            if (object1 < object2) {}
        `,
    },
];
