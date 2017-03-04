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

export const rules = {
    "adjacent-overload-signatures": true,
    "align": {
        options: [
            "parameters",
            "statements",
        ],
    },
    "array-type": {
        options: ["array-simple"],
    },
    "arrow-parens": true,
    "class-name": true,
    "comment-format": {
        options: ["check-space"],
    },
    "curly": true,
    "cyclomatic-complexity": false,
    "eofline": true,
    "forin": true,
    "indent":  {
        options: ["spaces"],
    },
    "interface-name": {
        options: ["always-prefix"],
    },
    "jsdoc-format": true,
    "label-position": true,
    "max-classes-per-file": {
        options: [1],
    },
    "max-line-length": {
        options: [120],
    },
    "member-access": true,
    "member-ordering": {
        options: {
            order: "statics-first",
        },
    },
    "new-parens": true,
    "no-any": false,
    "no-arg": true,
    "no-bitwise": true,
    "no-conditional-assignment": true,
    "no-consecutive-blank-lines": true,
    "no-console": {
        options: [
            "debug",
            "info",
            "log",
            "time",
            "timeEnd",
            "trace",
        ],
    },
    "no-construct": true,
    "no-debugger": true,
    "no-empty": true,
    "no-eval": true,
    "no-internal-module": true,
    "no-namespace": true,
    "no-parameter-properties": false,
    "no-reference": true,
    "no-shadowed-variable": true,
    "no-string-literal": true,
    "no-switch-case-fall-through": false,
    "no-trailing-whitespace": true,
    "no-unsafe-finally": true,
    "no-unused-expression": true,
    "no-unused-new": true,
    // disable this rule as it is very heavy performance-wise and not that useful
    "no-use-before-declare": false,
    "no-var-keyword": true,
    "no-var-requires": true,
    "object-literal-key-quotes": {
        options: ["consistent-as-needed"],
    },
    "object-literal-shorthand": true,
    "object-literal-sort-keys": true,
    "one-line": {
        options: [
            "check-catch",
            "check-else",
            "check-finally",
            "check-open-brace",
            "check-whitespace",
        ],
    },
    "one-variable-per-declaration": {
        options: ["ignore-for-loop"],
    },
    "only-arrow-functions": {
        options: ["allow-declarations"],
    },
    "ordered-imports": {
        options: {
            "import-sources-order": "case-insensitive",
            "named-imports-order": "case-insensitive",
        },
    },
    "prefer-for-of": true,
    "quotemark": {
        options: [
            "double",
            "avoid-escape",
        ],
    },
    "radix": true,
    "semicolon": {
        options: ["always"],
    },
    "switch-default": true,
    "trailing-comma": {
        options: {
            multiline: "always",
            singleline: "never",
        },
    },
    "triple-equals": {
        options: ["allow-null-check"],
    },
    "typedef": false,
    "typedef-whitespace": {
        options: [{
            "call-signature": "nospace",
            "index-signature": "nospace",
            "parameter": "nospace",
            "property-declaration": "nospace",
            "variable-declaration": "nospace",
        }, {
            "call-signature": "onespace",
            "index-signature": "onespace",
            "parameter": "onespace",
            "property-declaration": "onespace",
            "variable-declaration": "onespace",
        }],
    },
    "use-isnan": true,
    "variable-name": {
        options: [
            "ban-keywords",
            "check-format",
            "allow-pascal-case",
        ],
    },
    "whitespace": {
        options: [
            "check-branch",
            "check-decl",
            "check-operator",
            "check-separator",
            "check-type",
            "check-typecast",
        ],
    },
};
export const jsRules = {
    "align": {
        options: [
            "parameters",
            "statements",
        ],
    },
    "class-name": true,
    "curly": true,
    "eofline": true,
    "forin": true,
    "indent":  {
        options: ["spaces"],
    },
    "jsdoc-format": true,
    "label-position": true,
    "max-line-length": {
        options: [120],
    },
    "new-parens": true,
    "no-arg": true,
    "no-bitwise": true,
    "no-conditional-assignment": true,
    "no-consecutive-blank-lines": true,
    "no-console": {
        options: [
            "debug",
            "info",
            "log",
            "time",
            "timeEnd",
            "trace",
        ],
    },
    "no-construct": true,
    "no-debugger": true,
    "no-duplicate-variable": true,
    "no-empty": true,
    "no-eval": true,
    "no-reference": true,
    "no-shadowed-variable": true,
    "no-string-literal": true,
    "no-switch-case-fall-through": false,
    "no-trailing-whitespace": true,
    "no-unused-expression": true,
    "no-unused-new": true,
    // disable this rule as it is very heavy performance-wise and not that useful
    "no-use-before-declare": false,
    "object-literal-sort-keys": true,
    "one-line": {
        options: [
            "check-catch",
            "check-else",
            "check-finally",
            "check-open-brace",
            "check-whitespace",
        ],
    },
    "one-variable-per-declaration": {
        options: ["ignore-for-loop"],
    },
    "quotemark": {
        options: [
            "double",
            "avoid-escape",
        ],
    },
    "radix": true,
    "semicolon": {
        options: ["always"],
    },
    "switch-default": true,
    "trailing-comma": {
        options: {
            multiline: "always",
            singleline: "never",
        },
    },
    "triple-equals": {
        options: ["allow-null-check"],
    },
    "use-isnan": true,
    "variable-name": {
        options: [
            "ban-keywords",
            "check-format",
            "allow-pascal-case",
        ],
    },
    "whitespace": {
        options: [
            "check-branch",
            "check-decl",
            "check-operator",
            "check-separator",
            "check-type",
            "check-typecast",
        ],
    },
};
