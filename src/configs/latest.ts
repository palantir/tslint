/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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

// tslint:disable object-literal-sort-keys
// tslint:disable:object-literal-key-quotes
export const rules = {
    // added in v3.x
    "no-invalid-this": false,
    "no-angle-bracket-type-assertion": true,

    // added in v4.1
    "only-arrow-functions": {
        options: [
            "allow-declarations",
            // the following option was added in 4.1
            "allow-named-functions",
        ],
    },
    "prefer-const": true,

    // added in v4.2
    "callable-types": true,
    "interface-over-type-literal": true,
    "no-empty-interface": true,
    "no-string-throw": true,

    // added in v4.3
    "import-spacing": true,
    "space-before-function-paren": {
        options: {
            "anonymous": "never",
            "asyncArrow": "always",
            "constructor": "never",
            "method": "never",
            "named": "never",
        },
    },
    "typeof-compare": true,
    "unified-signatures": true,

    // added in v4.4
    "arrow-return-shorthand": true,
    "no-unnecessary-initializer": true,
    "no-misused-new": true,

    // added in v4.5
    "ban-types": {
        options: [
            ["Object", "Avoid using the `Object` type. Did you mean `object`?"],
            ["Function", "Avoid using the `Function` type. Prefer a specific function type, like `() => void`."],
            ["Boolean", "Avoid using the `Boolean` type. Did you mean `boolean`?"],
            ["Number", "Avoid using the `Number` type. Did you mean `number`?"],
            ["String", "Avoid using the `String` type. Did you mean `string`?"],
            ["Symbol", "Avoid using the `Symbol` type. Did you mean `symbol`?"],
        ],
    },
    "no-duplicate-super": true,

    // added in v5.0
    "align": {
        options: [
            "parameters",
            "statements",
            "members",
            "elements",
        ],
    },
};
// tslint:enable object-literal-sort-keys

// work around "extends" being a keyword
const xtends = "tslint:recommended";
export { xtends as extends };
