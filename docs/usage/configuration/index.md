---
layout: page
title: Configuring TSLint
permalink: /usage/configuration/
---

### TSLint Configuration

When using [the CLI][0] or many [third-party tools][1], a file named `tslint.json` or `tslint.yaml` is used to
configure which rules get run and each of their options.

`tslint.json` or `tslint.yaml` files can have the following fields specified:

-   `extends?: string | string[]`:
    The name of a built-in configuration preset (see built-in presets below), or a path or
    array of paths to other configuration files which are extended by this configuration.
    This value is handled using node module resolution semantics.
    For example, a value of `"tslint-config"` would tell TSLint to try and load the main file of a module
    named "tslint-config" as a configuration file. Specific files inside node modules can also be
    specified, eg. `"tslint-config/path/to/submodule"`. Relative paths to JSON files or JS modules
    are also supported, e.g. `"./tslint-config"`.
-   `rulesDirectory?: string | string[]`:
    A path to a directory or an array of paths to directories of [custom rules][2]. These values are handled using node module resolution semantics, if an `index.js` is placed in your rules directory. We fallback to use relative or absolute paths, if the module can't be resolved. If you want to avoid module resolution you can directly use a relative or absolute path (e.g. with `./`).
-   `rules?: { [name: string]: RuleSetting }`: A map of rule names to their configuration settings.
    -   These rules are applied to `.ts` and `.tsx` files.
    -   Each rule is associated with an object containing:
        -   `options?: any`: An array of values that are specific to a rule.
        -   `severity?: "default" | "error" | "warning" | "off"`: Severity level. Level "error" will cause exit code 2.
    -   Legacy: An array may be specified instead of the above object, and is equivalent to setting the rule with the default severity if the first value in the array is `true`, with configuration parameters in the remainder of the array.
        -   `"no-empty": [true, "allow-empty-catch"]` is strictly equivalent to `"no-empty": { "options": ['allow-empty-catch'], "severity": 'default' }`
    -   Legacy: A boolean value may be specified instead of the above object, and is equivalent to setting no options with default severity.
    -   Any rules specified in this block will override those configured in any base configuration being extended.
    -   [Check out the full rules list here][3].
-   `jsRules?: any | boolean`: Same format as `rules` or explicit `true` to copy all valid active rules from rules. These rules are applied to `.js` and `.jsx` files.
-   `defaultSeverity?: "error" | "warning" | "off"`: The severity level that is applied to rules in this config file as well as rules in any inherited config files which have their severity set to "default". If undefined, "error" is used as the defaultSeverity.
-   `linterOptions?: { exclude?: string[] }`:
    -   `exclude: string[]`: An array of globs. Any file matching these globs will not be linted. All exclude patterns are relative to the configuration file they were specified in.
    -   `format: string`: Default [lint formatter][4]

`tslint.json` configuration files may have JavaScript-style `// single-line` and `/* multi-line */` comments in them (even though this is technically invalid JSON). If this confuses your syntax highlighter, you may want to switch it to JavaScript format.

An example `tslint.json` file might look like this:

```json
{
    "extends": "tslint:recommended",
    "rulesDirectory": ["path/to/custom/rules/directory/", "another/path/"],
    "rules": {
        "max-line-length": {
            "options": [120]
        },
        "new-parens": true,
        "no-arg": true,
        "no-bitwise": true,
        "no-conditional-assignment": true,
        "no-consecutive-blank-lines": false,
        "no-console": {
            "severity": "warning",
            "options": ["debug", "info", "log", "time", "timeEnd", "trace"]
        }
    },
    "jsRules": {
        "max-line-length": {
            "options": [120]
        }
    }
}
```

The corresponding YAML file looks like this:

```yaml
---
extends: "tslint:recommended"
rulesDirectory:
    - path/to/custom/rules/directory/
    - another/path/
rules:
    max-line-length:
        options: [120]
    new-parens: true
    no-arg: true
    no-bitwise: true
    no-conditional-assignment: true
    no-consecutive-blank-lines: false
    no-console:
        severity: warning
        options:
            - debug
            - info
            - log
            - time
            - timeEnd
            - trace
jsRules:
    max-line-length:
        options: [120]
...
```

### Rule severity

The severity level of each rule can be configured to `default`, `error`, `warning`/`warn`, or `off`/`none`. If no severity level is specified, `default` is used. The `defaultSeverity` top-level option replaces the severity level for each rule that uses severity level `default` in the current file. Valid values for `defaultSeverity` include `error`, `warning`/`warn`, and `off`/`none`.

### Configuration presets

TSLint ships with a handful of built-in configurations presets. You may inspect their source [here](https://github.com/palantir/tslint/tree/master/src/configs).

**`tslint:recommended`** is a stable, somewhat opinionated set of rules which we encourage for general TypeScript programming. This configuration follows semver, so it will _not_ have breaking changes across minor or patch releases.

**`tslint:latest`** extends `tslint:recommended` and is continuously updated to include configuration for the latest rules in every TSLint release. Using this config may introduce breaking changes across minor releases as new rules are enabled which cause lint failures in your code. When TSLint reaches a major version bump, `tslint:recommended` will be updated to be identical to `tslint:latest`.

**`tslint:all`** turns on all rules to their strictest settings. This will use type checking, so it must be combined with the `--project` option.
(Exceptions include rules such as [`"ban"`][rule-ban], [`"import-blacklist"`][rule-import-blacklist], and [`"file-header"`][rule-file-header], which have no sensible defaults, and deprecated rules.)

### Custom rules

If TSLint's core rules don't have all the lint checks you're looking for,
you may [write your own custom rules][2] or use custom rules that others have developed.

Some commonly used custom rule packages in the TSLint community are listed in the
[README](https://github.com/palantir/tslint/blob/master/README.md).

[0]: {{site.baseurl | append: "/usage/cli"}}
[1]: {{site.baseurl | append: "/usage/third-party-tools"}}
[2]: {{site.baseurl | append: "/develop/custom-rules"}}
[3]: {{site.baseurl | append: "/rules"}}
[4]: {{site.baseurl | append: "/formatters"}}
[rule-ban]: {{site.baseurl | append: "/rules/ban"}}
[rule-import-blacklist]: {{site.baseurl | append: "/rules/import-blacklist"}}
[rule-file-header]: {{site.baseurl | append: "/rules/file-header"}}
