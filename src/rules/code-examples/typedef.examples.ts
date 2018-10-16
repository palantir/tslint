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
        description: "Requires type definitions for call signatures",
        config: Lint.Utils.dedent`
            "rules": { "typedef": [true, "call-signature"] }
        `,
        pass: Lint.Utils.dedent`
            function add(x, y): number {
                return x + y;
            }
        `,
        fail: Lint.Utils.dedent`
            function add(x, y) {
                return x + y;
            }
        `
    },
    {
        description: "Requires type definitions for arrow call signatures",
        config: Lint.Utils.dedent`
            "rules": { "typedef": [true, "arrow-call-signature"] }
        `,
        pass: Lint.Utils.dedent`
            const add = (x, y): number => x + y;
        `,
        fail: Lint.Utils.dedent`
            const add = (x, y) => x + y;
        `
    },
    {
        description: "Requires type definitions for parameters",
        config: Lint.Utils.dedent`
            "rules": { "typedef": [true, "parameter"] }
        `,
        pass: Lint.Utils.dedent`
            function add(x: number, y: number) {
                return x + y;
            }
        `,
        fail: Lint.Utils.dedent`
            function add(x, y) {
                return x + y;
            }
        `
    },
    {
        description: "Requires type definitions for arrow function parameters",
        config: Lint.Utils.dedent`
            "rules": { "typedef": [true, "arrow-parameter"] }
        `,
        pass: Lint.Utils.dedent`
            const add = (x: number, y: number) => x + y;
        `,
        fail: Lint.Utils.dedent`
            const add = (x, y) => x + y;
        `
    },
    {
        description: "Requires type definitions for property declarations",
        config: Lint.Utils.dedent`
            "rules": { "typedef": [true, "property-declaration"] }
        `,
        pass: Lint.Utils.dedent`
            interface I {
                foo: number;
                bar: string;
            }
    `,
        fail: Lint.Utils.dedent`
            interface I {
                foo;
                bar;
            }
        `
    },
    {
        description: "Requires type definitions for variable declarations",
        config: Lint.Utils.dedent`
            "rules": { "typedef": [true, "variable-declaration"] }
        `,
        pass: Lint.Utils.dedent`
            let x: number;
        `,
        fail: Lint.Utils.dedent`
            let x;
        `
    },
    {
        description: "Requires type definitions for member variable declarations",
        config: Lint.Utils.dedent`
            "rules": { "typedef": [true, "member-variable-declaration"] }
        `,
        pass: Lint.Utils.dedent`
            class MyClass {
                x: number;
            }
        `,
        fail: Lint.Utils.dedent`
            class MyClass {
                x;
            }
        `
    },
    {
        description: "Requires type definitions when destructuring objects.",
        config: Lint.Utils.dedent`
            "rules": { "typedef": [true, "object-destructuring"] }
        `,
        pass: Lint.Utils.dedent`
            interface FooBar {
                foo: number;
                bar: string;
            }
            const foobar = { foo: 1, bar: '2' };
            const { foo, bar }: FooBar = foobar;
        `,
        fail: Lint.Utils.dedent`
            interface FooBar {
                foo: number;
                bar: string;
            }
            const foobar = { foo: 1, bar: '2' };
            const { foo, bar } = foobar;
        `
    },
    {
        description: "Requires type definitions when destructuring arrays.",
        config: Lint.Utils.dedent`
            "rules": { "typedef": [true, "array-destructuring"] }
        `,
        pass: Lint.Utils.dedent`
            const foobar = [1, '2'];
            const [foo, bar]: Array<number | string> = foobar;
        `,
        fail: Lint.Utils.dedent`
            const foobar = [1, '2'];
            const [foo, bar] = foobar;
        `
    }
];
