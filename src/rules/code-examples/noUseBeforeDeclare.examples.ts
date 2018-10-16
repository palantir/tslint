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

// tslint:disable: object-literal-sort-keys
export const codeExamples = [
    {
        description: "Check that referenced variables are declared beforehand (default)",
        config: Lint.Utils.dedent`
            "rules": { "no-use-before-declare": true }
        `,
        pass: Lint.Utils.dedent`
            var hello = 'world';
            var foo;

            console.log(hello, foo, capitalize(hello));
            // 'world', undefined, 'WORLD'

            function capitalize(val) {
                return val.toUpperCase();
            }

            import { default as foo1 } from "./lib";
            import foo2 from "./lib";
            import _, { map, foldl } from "./underscore";
            import * as foo3 from "./lib";
            import "./lib";

            function declaredImports() {
                console.log(foo1);
                console.log(foo2);
                console.log(foo3);
                map([], (x) => x);
            }
        `,
        fail: Lint.Utils.dedent`
            console.log(hello, foo);

            var hello = 'world';
            var foo;

            function undeclaredImports() {
                console.log(foo1);
                console.log(foo2);
                console.log(foo3);
                map([], (x) => x);
            }

            import { default as foo1 } from "./lib";
            import foo2 from "./lib";
            import _, { map, foldl } from "./underscore";
            import * as foo3 from "./lib";
            import "./lib";
        `
    }
];
