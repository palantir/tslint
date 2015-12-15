---
layout: page
title: tslint.json
permalink: /usage/tslint-json/
---

When using [the CLI][0] or many [third-party tools][1], a file named `tslint.json` is used to
configure which rules get run.

An example `tslint.json` file might look like this:

```ts
{
    "rulesDirectory": ["path/to/custom/rules/direcotry/", "another/path/"],
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
    }
}
```

If a rule takes no options, you can simply set it to a boolean, either `true` or `false`, to enable or disable it. If a rule takes options, you set it to an array where the first value is a boolean indicating if the rule is enabled and the next values are options handled by the rule.

Note that the `rulesDirectory` field is optional and only needed if you're using [custom rules][2]. Not all possible rules are listed here, be sure to [check out the full list][3].


[0]: {{site.baseurl | append: "/usage/cli"}}
[1]: {{site.baseurl | append: "/usage/third-party-tools"}}
[2]: {{site.baseurl | append: "/usage/custom-rules"}}
[3]: {{site.baseurl | append: "/rules"}}
