---
layout: page
title: tslint.json
permalink: /usage/tslint-json/
---

When using [the CLI][0] or many [third-party tools][1], a file named `tslint.json` is used to
configure which rules get run.

`tslint.json` files can have the following fields specified:

* `extends?: string | string[]`: 
A path(s) to another configuration file which to extend.
This value is handled using node module resolution semantics.
For example a value of "tslint-config" would cause TSLint to try and load the main file of a module
named "tslint-config" as a configuration file.
A value of "./tslint-config", on the other hand, would be treated as a relative path to file.
* `rulesDirectory?: string | string[]`:
A path(s) to a directory of [custom rules][2]. This will always be treated as a relative or absolute path.
* `rules?: any`: Pairs of keys and values where each key is a rule name and each value is the configuration for that rule.
If a rule takes no options, you can simply set its value to a boolean, either `true` or `false`, to enable or disable it.
If a rule takes options, you set its value to an array where the first value is a boolean indicating if the rule is enabled and the next values are options handled by the rule.
Not all possible rules are listed here, be sure to [check out the full list][3]. These rules are applied to `.ts` and `.tsx` files.
* `jsRules?: any`: Same format as `rules`. These rules are applied to `.js` and `.jsx` files. 

`tslint.json` configuration files may have JavaScript-style `// single-line` and `/* multi-line */` comments in them (even though this is technically invalid JSON). If this confuses your syntax highlighter, you may want to switch it to JavaScript format.

An example `tslint.json` file might look like this:

```ts
{
    "rulesDirectory": ["path/to/custom/rules/directory/", "another/path/"],
    "rules": {
        "class-name": true,
        "comment-format": [true, "check-space"],
        "indent": [true, "spaces"],
        "no-duplicate-variable": true,
        "no-eval": true,
        "no-internal-module": true,
        "no-trailing-whitespace": true,
        "no-var-keyword": true,
        "one-line": [true, "check-open-brace", "check-whitespace"],
        "quotemark": [true, "double"],
        "semicolon": false,
        "triple-equals": [true, "allow-null-check"],
        "typedef-whitespace": [true, {
            "call-signature": "nospace",
            "index-signature": "nospace",
            "parameter": "nospace",
            "property-declaration": "nospace",
            "variable-declaration": "nospace"
        }],
        "variable-name": [true, "ban-keywords"],
        "whitespace": [true,
            "check-branch",
            "check-decl",
            "check-operator",
            "check-separator",
            "check-type"
        ]
    },
    "jsRules": {
        "indent": [true, "spaces"],
        "no-duplicate-variable": true,
        "no-eval": true,
        "no-trailing-whitespace": true,
        "one-line": [true, "check-open-brace", "check-whitespace"],
        "quotemark": [true, "double"],
        "semicolon": false,
        "triple-equals": [true, "allow-null-check"],
        "variable-name": [true, "ban-keywords"],
        "whitespace": [true,
            "check-branch",
            "check-decl",
            "check-operator",
            "check-separator",
            "check-type"
        ]
    }
}
```

[0]: {{site.baseurl | append: "/usage/cli"}}
[1]: {{site.baseurl | append: "/usage/third-party-tools"}}
[2]: {{site.baseurl | append: "/usage/custom-rules"}}
[3]: {{site.baseurl | append: "/rules"}}
