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
import { ICodeExample } from "../../language/rule/rule";

// tslint:disable: object-literal-sort-keys
export const codeExamples: ICodeExample[] = [
    {
        description:
            "Disallow object literals to appear in type assertion expressions (default). Casing to `any` and `unknown` is allowed.",
        config: Lint.Utils.dedent`
            "rules": { "no-object-literal-type-assertion": true }
        `,
        pass: Lint.Utils.dedent`
            let foo = {} as any;
            let foo = {} as unknown;

            let foo = {} as any as Foo;
            let foo = {} as unknown as Foo;
        `,
        fail: Lint.Utils.dedent`
            let foo = {} as Foo;
            let foo = <Foo>{};
        `,
    },
    {
        description: "Allow using a type assertion when the object literal is used as an argument.",
        config: Lint.Utils.dedent`
            "rules": { "no-object-literal-type-assertion": [true, { "allow-arguments": true }] }
        `,
        pass: Lint.Utils.dedent`
            bar({} as Foo)
        `,
    },
];
