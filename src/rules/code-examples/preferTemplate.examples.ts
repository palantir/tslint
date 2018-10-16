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
        description: "Enforces the use of template strings whenever possible.",
        config: Lint.Utils.dedent`
            "rules": { "prefer-template": true }
        `,
        pass: Lint.Utils.dedent`
            const x: number = 1;
            const y: number = 1;
            const myString: string = \`\${x} is equals \${y}\`;
        `,
        fail: Lint.Utils.dedent`
            const x: number = 1;
            const y: number = 1;
            const myString: string = x + ' is equals ' + y;
        `
    },
    {
        description: "Enforces the use of template strings, but allows up to one concatenation.",
        config: Lint.Utils.dedent`
            "rules": { "prefer-template": [true, "allow-single-concat"] }
        `,
        pass: Lint.Utils.dedent`
            const x: number = 1;
            const y: number = 1;
            const myString: string = x + ' is equals 1';
            const myString: string = \`\${x} is equals \${y}\`;
        `,
        fail: Lint.Utils.dedent`
            const x: number = 1;
            const y: number = 1;
            const myString: string = x + ' is equals ' + y;
        `
    }
];
