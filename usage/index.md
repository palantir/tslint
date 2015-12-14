---
layout: page
title: Usage
permalink: /usage/
menu: main
order: 1
---

Installation
------------

##### CLI

```
npm install tslint -g
npm install typescript -g
```

##### Library

```
npm install tslint
npm install typescript
```

##### Peer dependencies

The `typescript` module is a peer dependency of TSLint, which allows you to update the compiler independently from the
linter. This also means that `tslint` will have to use the same version of `tsc` used to actually compile your sources.

Breaking changes in the latest dev release of `typescript@next` might break something in the linter if we haven't built against that release yet. If this happens to you, you can try:

1. picking up `tslint@next`, which may have some bugfixes not released in `tslint@latest`
   (see [release notes here](https://github.com/palantir/tslint/releases)).
2. rolling back `typescript` to a known working version.

Usage
-----

Please ensure that the TypeScript source files compile correctly _before_ running the linter.

##### CLI

Usage: `tslint [options] [file ...]`

Options:

```
-c, --config              configuration file
-o, --out                 output file
-r, --rules-dir           rules directory
-s, --formatters-dir      formatters directory
-t, --format              output format (prose, json)   [default: "prose"]
```

By default, TSLint looks for a configuration file named `tslint.json` in the directory
of the file being linted and, if not found, searches ancestor directories. A [sample config file](https://github.com/palantir/tslint/blob/master/docs/sample.tslint.json) with all possible rules is available. Check out the [rules](rules) section for more details on what rules are available. 

tslint accepts the following command-line options:

```
-c, --config:
    The location of the configuration file that tslint will use to
    determine which rules are activated and what options to provide
    to the rules. If no option is specified, the config file named
    tslint.json is used, so long as it exists in the path.
    The format of the file is { rules: { /* rules list */ } },
    where /* rules list */ is a key: value comma-seperated list of
    rulename: rule-options pairs. Rule-options can be either a
    boolean true/false value denoting whether the rule is used or not,
    or a list [boolean, ...] where the boolean provides the same role
    as in the non-list case, and the rest of the list are options passed
    to the rule that will determine what it checks for (such as number
    of characters for the max-line-length rule, or what functions to ban
    for the ban rule).

-o, --out:
    A filename to output the results to. By default, tslint outputs to
    stdout, which is usually the console where you're running it from.

-r, --rules-dir:
    An additional rules directory, for user-created rules.
    tslint will always check its default rules directory, in
    node_modules/tslint/lib/rules, before checking the user-provided
    rules directory, so rules in the user-provided rules directory
    with the same name as the base rules will not be loaded.

-s, --formatters-dir:
    An additional formatters directory, for user-created formatters.
    Formatters are files that will format the tslint output, before
    writing it to stdout or the file passed in --out. The default
    directory, node_modules/tslint/build/formatters, will always be
    checked first, so user-created formatters with the same names
    as the base formatters will not be loaded.

-t, --format:
    The formatter to use to format the results of the linter before
    outputting it to stdout or the file passed in --out. The core
    formatters are prose (human readable) and json (machine readable),
    and prose is the default if this option is not used. Additional
    formatters can be added and used if the --formatters-dir option
    is set.

--help:
    Prints this help message.
```

##### Library

```ts
var fileName = "Specify file name";

var configuration = {
    rules: {
        "variable-name": true,
        "quotemark": [true, "double"]
    }
};

var options = {
    formatter: "json",
    configuration: configuration,
    rulesDirectory: "customRules/", // can be an array of directories
    formattersDirectory: "customFormatters/"
};

var Linter = require("tslint");
var fs = require("fs");
var contents = fs.readFileSync(fileName, "utf8");

var ll = new Linter(fileName, contents, options);
var result = ll.lint();
```

TSLint Rule Flags
-----
You can enable/disable TSLint or a subset of rules within a file with the following comment rule flags:

* `/* tslint:disable */` - Disable all rules for the rest of the file
* `/* tslint:enable */` - Enable all rules for the rest of the file
* `/* tslint:disable:rule1 rule2 rule3... */` - Disable the listed rules for the rest of the file
* `/* tslint:enable:rule1 rule2 rule3... */` - Enable the listed rules for the rest of the file

Rules flags enable or disable rules as they are parsed. A rule is enabled or disabled until a later directive commands otherwise. Disabling an already disabled rule or enabling an already enabled rule has no effect.

For example, imagine the directive `/* tslint:disable */` on the first line of a file, `/* tslint:enable:ban class-name */` on the 10th line and `/* tslint:enable */` on the 20th. No rules will be checked between the 1st and 10th lines, only the `ban` and `class-name` rules will be checked between the 10th and 20th, and all rules will be checked for the remainder of the file.

Custom Rules (from the TypeScript community)
---------------

If we don't have all the rules you're looking for, you can either write your own custom rules or use custom rules that others have developed. The repos below are a good source of custom rules:

- [ESLint rules for TSLint](https://github.com/buzinas/tslint-eslint-rules) - Improve your TSLint with the missing ESLint Rules
- [tslint-microsoft-contrib](https://github.com/Microsoft/tslint-microsoft-contrib) - A set of TSLint rules used on some Microsoft projects