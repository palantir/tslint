---
title: TSLint command-line interface
layout: page
permalink: /usage/cli/
---

### Installation

__Local__ (in your project's working directory):

```sh
npm install tslint typescript --save-dev
# or
yarn add tslint typescript --dev
```

__Global__:

```sh
npm install tslint typescript -g
# or
yarn global add tslint typescript
```

{% include peer_dependencies.md %}

### CLI Usage

Please ensure that the TypeScript source files compile correctly _before_ running the linter.

Usage: `tslint [options] [file ...]`

Options:

```
-v, --version                          output the version number
-c, --config [config]                  configuration file
-e, --exclude <exclude>                exclude globs from path expansion
--fix                                  fixes linting errors for select rules (this may overwrite linted files)
--force                                return status code 0 even if there are lint errors
-i, --init                             generate a tslint.json config file in the current working directory
-o, --out [out]                        output file
--outputAbsolutePaths                  whether or not outputted file paths are absolute
-r, --rules-dir [rules-dir]            rules directory
-s, --formatters-dir [formatters-dir]  formatters directory
-t, --format [format]                  output format (prose, json, stylish, verbose, pmd, msbuild, checkstyle, vso, fileslist, codeFrame)
-q, --quiet                            hide non "error" severity linting errors from output
--test                                 test that tslint produces the correct output for the specified directory
-p, --project [project]                tsconfig.json file
--type-check                           (deprecated) check for type errors before linting the project
-h, --help                             output usage information
```

By default, TSLint looks for a configuration file named `tslint.json` in the directory
of the file being linted and, if not found, searches ancestor directories. Check out the [rules][0] section for more details on what rules are available.

tslint accepts the following command-line options:

```
-c, --config:
    The location of the configuration file that tslint will use to
    determine which rules are activated and what options to provide
    to the rules. If no option is specified, the config file named
    tslint.json is used, so long as it exists in the path.
    The format of the file is { rules: { /* rules list */ } },
    where /* rules list */ is a key: value comma-separated list of
    rulename: rule-options pairs. Rule-options can be either a
    boolean true/false value denoting whether the rule is used or not,
    or a list [boolean, ...] where the boolean provides the same role
    as in the non-list case, and the rest of the list are options passed
    to the rule that will determine what it checks for (such as number
    of characters for the max-line-length rule, or what functions to ban
    for the ban rule).

-e, --exclude:
    A filename or glob which indicates files to exclude from linting.
    This option can be supplied multiple times if you need multiple
    globs to indicate which files to exclude.

--fix:
    Fixes linting errors for select rules. This may overwrite linted files.

--force:
    Return status code 0 even if there are any lint errors.
    Useful while running as npm script.

-i, --init:
    Generates a tslint.json config file in the current working directory.

-o, --out:
    A filename to output the results to. By default, tslint outputs to
    stdout, which is usually the console where you're running it from.

--outputAbsolutePaths:
    If true, all paths in the output will be absolute.

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
    formatters are prose (human readable), json (machine readable)
    and verbose. prose is the default if this option is not used.
    Other built-in options include pmd, msbuild, checkstyle, and vso.
    Additional formatters can be added and used if the --formatters-dir
    option is set.

-q, --quiet
    Hide non "error" severity linting errors from output. This can be
    especially useful in CI environments, where you may want only "error"
    severity linting errors to cause linting to fail.

--test:
    Runs tslint on matched directories and checks if tslint outputs
    match the expected output in .lint files. Automatically loads the
    tslint.json files in the directories as the configuration file for
    the tests. See the full tslint documentation for more details on how
    this can be used to test custom rules.

-p, --project:
    The path or directory containing a tsconfig.json file that will be
    used to determine which files will be linted. This flag also enables
    rules that require the type checker.

--type-check:
    (deprecated) Checks for type errors before linting a project.
    --project must be specified in order to enable type checking.

-v, --version:
    The current version of tslint.

-h, --help:
    Prints this help message.
```

#### Exit Codes

The CLI process may exit with the following codes:

- `0`: Linting succeeded without errors (warnings may have occurred)
- `1`: An invalid command line argument or combination thereof was used
- `2`: Linting failed with one or more rule violations with severity `error`

[0]: {{site.baseurl | append: "/rules/"}}
