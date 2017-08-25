/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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

import { join as joinPaths } from "path";

import { findRule } from "../ruleLoader";
import { hasOwnProperty } from "../utils";

// tslint:disable object-literal-sort-keys
// tslint:disable object-literal-key-quotes
export const rules = {
    // TypeScript Specific

    "adjacent-overload-signatures": true,
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
    "member-access": {
        "options": ["check-accessor", "check-constructor"],
    },
    "member-ordering": {
        "options": [{
            "order": "statics-first",
            "alphabetize": true,
        }],
    },
    "no-any": true,
    "no-empty-interface": true,
    "no-import-side-effect": true,
    // Technically this is not the strictest setting, but don't want to conflict with "typedef"
    "no-inferrable-types": {
        "options": ["ignore-params"],
    },
    "no-internal-module": true,
    "no-magic-numbers": true,
    "no-namespace": true,
    "no-non-null-assertion": true,
    "no-reference": true,
    "no-this-assignment": true,
    "no-var-requires": true,
    "only-arrow-functions": true,
    "prefer-for-of": true,
    "promise-function-async": true,
    "typedef": {
        "options": [
            "call-signature",
            "arrow-call-signature",
            "parameter",
            "arrow-parameter",
            "property-declaration",
            "variable-declaration",
            "member-variable-declaration",
        ],
    },
    "typedef-whitespace": {
        "options": [
            {
                "call-signature": "nospace",
                "index-signature": "nospace",
                "parameter": "nospace",
                "property-declaration": "nospace",
                "variable-declaration": "nospace",
            },
            {
                "call-signature": "onespace",
                "index-signature": "onespace",
                "parameter": "onespace",
                "property-declaration": "onespace",
                "variable-declaration": "onespace",
            },
        ],
    },
    "unified-signatures": true,

    // Functionality
    "await-promise": true,
    // "ban": no sensible default
    "curly": true,
    "forin": true,
    // "import-blacklist": no sensible default
    "label-position": true,
    "no-arg": true,
    "no-bitwise": true,
    "no-conditional-assignment": true,
    "no-console": true,
    "no-construct": true,
    "no-debugger": true,
    "no-duplicate-super": true,
    "no-duplicate-variable": {
        "options": ["check-parameters"],
    },
    "no-empty": true,
    "no-eval": true,
    "no-floating-promises": true,
    "no-for-in-array": true,
    "no-inferred-empty-object-type": true,
    "no-invalid-template-strings": true,
    // "no-invalid-this": Won't this be deprecated?
    "no-misused-new": true,
    "no-null-keyword": true,
    "no-object-literal-type-assertion": true,
    "no-shadowed-variable": true,
    "no-string-literal": true,
    "no-string-throw": true,
    "no-sparse-arrays": true,
    "no-submodule-imports": true,
    "no-unbound-method": true,
    "no-unsafe-any": true,
    "no-unsafe-finally": true,
    "no-unused-expression": true,
    "no-unused-variable": true,
    "no-use-before-declare": true,
    "no-var-keyword": true,
    "no-void-expression": true,
    "prefer-conditional-expression": true,
    "radix": true,
    "restrict-plus-operands": true,
    "strict-boolean-expressions": true,
    "strict-type-predicates": true,
    "switch-default": true,
    "triple-equals": true,
    "use-default-type-parameter": true,
    "use-isnan": true,

    // Maintainability

    "cyclomatic-complexity": true,
    "eofline": true,
    "indent": {
        "options": ["spaces"],
    },
    "linebreak-style": {
        "options": ["LF"],
    },
    "max-classes-per-file": {
        "options": [1],
    },
    "max-file-line-count": {
        "options": [1000],
    },
    "max-line-length": {
        "options": [120],
    },
    "no-default-export": true,
    "no-duplicate-imports": true,
    "no-irregular-whitespace": true,
    "no-mergeable-namespace": true,
    "no-parameter-reassignment": true,
    "no-require-imports": true,
    "no-trailing-whitespace": true,
    "object-literal-sort-keys": true,
    "prefer-const": true,
    "trailing-comma": {
        "options": [{
            "multiline": "always",
            "singleline": "never",
        }],
    },

    // Style

    "align": {
        "options": [
            "parameters",
            "arguments",
            "statements",
            "elements",
            "members",
        ],
    },
    "array-type": {
        "options": ["array-simple"],
    },
    "arrow-parens": true,
    "arrow-return-shorthand": {
        "options": ["multiline"],
    },
    "binary-expression-operand-order": true,
    "callable-types": true,
    "class-name": true,
    "comment-format": {
        "options": [
            "check-space",
            "check-uppercase",
        ],
    },
    "completed-docs": true,
    // "file-header": No sensible default
    "deprecation": true,
    "encoding": true,
    "import-spacing": true,
    "interface-name": true,
    "interface-over-type-literal": true,
    "jsdoc-format": true,
    "match-default-export-name": true,
    "new-parens": true,
    "newline-before-return": true,
    "no-angle-bracket-type-assertion": true,
    "no-boolean-literal-compare": true,
    "no-consecutive-blank-lines": true,
    "no-parameter-properties": true,
    "no-reference-import": true,
    "no-unnecessary-callback-wrapper": true,
    "no-unnecessary-initializer": true,
    "no-unnecessary-qualifier": true,
    "no-unnecessary-type-assertion": true,
    "number-literal-format": true,
    "object-literal-key-quotes": {
        "options": ["consistent-as-needed"],
    },
    "object-literal-shorthand": true,
    "one-line": {
        "options": [
            "check-catch",
            "check-else",
            "check-finally",
            "check-open-brace",
            "check-whitespace",
        ],
    },
    "one-variable-per-declaration": true,
    "ordered-imports": {
        "options": [{
            "import-sources-order": "case-insensitive",
            "named-imports-order": "case-insensitive",
        }],
    },
    "prefer-function-over-method": true,
    "prefer-method-signature": true,
    "prefer-object-spread": true,
    "prefer-switch": true,
    "prefer-template": true,
    "quotemark": {
        "options": [
            "double",
            "avoid-escape",
            "avoid-template",
        ],
    },
    "return-undefined": true,
    "semicolon": {
        "options": ["always"],
    },
    "space-before-function-paren": {
        "options": [{
            "anonymous": "never",
            "asyncArrow": "always",
            "constructor": "never",
            "method": "never",
            "named": "never",
        }],
    },
    "space-within-parens": {
        "options": [0],
    },
    "switch-final-break": true,
    "type-literal-delimiter": true,
    "variable-name": {
        "options": [
            "ban-keywords",
            "check-format",
        ],
    },
    "whitespace": {
        "options": [
            "check-branch",
            "check-decl",
            "check-operator",
            "check-module",
            "check-separator",
            "check-type",
            "check-typecast",
            "check-preblock",
        ],
    },
};

export const RULES_EXCLUDED_FROM_ALL_CONFIG =
    ["ban", "fileHeader", "importBlacklist", "noInvalidThis", "noSwitchCaseFallThrough", "typeofCompare"];

// Exclude typescript-only rules from jsRules, otherwise it's identical.
export const jsRules: { [key: string]: any } = {};
for (const key in rules) {
    if (!hasOwnProperty(rules, key)) {
        continue;
    }

    const Rule = findRule(key, joinPaths(__dirname, "..", "rules"));
    if (Rule === undefined) {
        throw new Error(`Couldn't find rule '${key}'.`);
    }
    if (!Rule.metadata.typescriptOnly) {
        jsRules[key] = (rules as any)[key];
    }
}
