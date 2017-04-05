---
layout: page
title: tslint.json
permalink: /usage/tslint-json/
---

When using [the CLI][0] or many [third-party tools][1], a file named `tslint.json` is used to
configure which rules get run.

`tslint.json` files can have the following fields specified:

* `extends?: string | string[]`:
A path or array of paths to other configuration files which are extended by this configuration.
This value is handled using node module resolution semantics.
For example a value of "tslint-config" would cause TSLint to try and load the main file of a module
named "tslint-config" as a configuration file.
A value of "./tslint-config", on the other hand, would be treated as a relative path to file.
* `rulesDirectory?: string | string[]`:
A path or array of paths to a directories of [custom rules][2]. This will always be treated as a relative or absolute path.
* `rules?: { [name: string]: RuleSetting }`: A map of rule names to their configuration settings.
  - Each rule is associated with an object containing:
    - `options?: any`: An array of values that are specific to a rule.
    - `severity?: "default" | "error" | "warning" | "off"`: Severity level. Level "error" will cause exit code 2.
  - A boolean value may be specified instead of the above object, and is equivalent to setting no options with default severity.
Not all possible rules are listed here, be sure to [check out the full list][3]. These rules are applied to `.ts` and `.tsx` files.
* `jsRules?: any`: Same format as `rules`. These rules are applied to `.js` and `.jsx` files.
* `defaultSeverity?: "error" | "warning" | "off"`: The severity level used when a rule specifies a default warning level. If undefined, "error" is used. This value is not inherited and is only applied to rules in this file.

`tslint.json` configuration files may have JavaScript-style `// single-line` and `/* multi-line */` comments in them (even though this is technically invalid JSON). If this confuses your syntax highlighter, you may want to switch it to JavaScript format.

An example `tslint.json` file might look like this:

```json
{
    "rulesDirectory": ["path/to/custom/rules/directory/", "another/path/"],
    "rules": {
        "max-line-length": {
            "options": [120],
        },
        "new-parens": true,
        "no-arg": true,
        "no-bitwise": true,
        "no-conditional-assignment": true,
        "no-consecutive-blank-lines": false,
        "no-console": {
            "options": [
                "debug",
                "info",
                "log",
                "time",
                "timeEnd",
                "trace",
            ],
        }
    },
    "jsRules": {
        "max-line-length": {
            "options": [120],
        }
    }
}
```

[0]: {{site.baseurl | append: "/usage/cli"}}
[1]: {{site.baseurl | append: "/usage/third-party-tools"}}
[2]: {{site.baseurl | append: "/usage/custom-rules"}}
[3]: {{site.baseurl | append: "/rules"}}
