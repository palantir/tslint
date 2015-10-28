[![NPM version](https://badge.fury.io/js/tslint.svg)](http://badge.fury.io/js/tslint)
[![Downloads](http://img.shields.io/npm/dm/tslint.svg)](https://npmjs.org/package/tslint)
[![Linux Build Status](https://travis-ci.org/palantir/tslint.svg?branch=master)](https://travis-ci.org/palantir/tslint)
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/palantir/tslint?svg=true&branch=master)](https://ci.appveyor.com/project/ashwinr/tslint)
[![Join the chat at https://gitter.im/palantir/tslint](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/palantir/tslint?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

TSLint
======

A linter for the TypeScript language.

Installation
------------

##### CLI

```npm install tslint -g```

##### Library

```npm install tslint```

##### `next` distribution

The [`next` branch of the TSLint repo](https://github.com/palantir/tslint/tree/next) tracks the latest TypeScript
compiler and allows you to lint TS code that uses the latest features of the language. Releases from this branch
are published to npm with the `next` dist-tag, so you can get the latest dev version of TSLint via
`npm install tslint@next`.

Usage
-----

Please first ensure that the TypeScript source files compile correctly.

##### CLI

  usage: `tslint [options] [file ...]`

  Options:

    -c, --config              configuration file
    -o, --out                 output file
    -r, --rules-dir           rules directory
    -s, --formatters-dir      formatters directory
    -t, --format              output format (prose, json)   [default: "prose"]

By default, configuration is loaded from `tslint.json`, if it exists in the current path, or the user's home directory, in that order.

tslint accepts the following command-line options:

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
        node_modules/tslint/build/rules, before checking the user-provided
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

##### Library

```javascript
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
    rulesDirectory: "customRules/",
    formattersDirectory: "customFormatters/"
};

var Linter = require("tslint");
var fs = require("fs");
var contents = fs.readFileSync(fileName, "utf8");

var ll = new Linter(fileName, contents, options);
var result = ll.lint();
```

Supported Rules
-----

A sample configuration file with all options is available [here](https://github.com/palantir/tslint/blob/master/docs/sample.tslint.json).

* `align` enforces vertical alignment. Rule options:
  * `"parameters"` checks alignment of function parameters.
  * `"arguments"` checks alignment of function call arguments.
  * `"statements"` checks alignment of statements.
* `ban` bans the use of specific functions. Options are ["object", "function"] pairs that ban the use of object.function()
* `class-name` enforces PascalCased class and interface names.
* `comment-format` enforces rules for single-line comments. Rule options:
    * `"check-space"` enforces the rule that all single-line comments must begin with a space, as in `// comment`
        * note that comments starting with `///` are also allowed, for things such as `///<reference>`
    * `"check-lowercase"` enforces the rule that the first non-whitespace character of a comment must be lowercase, if applicable
    * `"check-uppercase"` enforces the rule that the first non-whitespace character of a comment must be uppercase, if applicable
* `curly` enforces braces for `if`/`for`/`do`/`while` statements.
* `eofline` enforces the file to end with a newline.
* `forin` enforces a `for ... in` statement to be filtered with an `if` statement.*
* `indent` enforces indentation with tabs or spaces. Rule options (one is required):
    * `"tabs"` enforces consistent tabs
    * `"spaces"` enforces consistent spaces
* `interface-name` enforces the rule that interface names must begin with a capital 'I'
* `jsdoc-format` enforces basic format rules for jsdoc comments -- comments starting with `/**`
    * each line contains an asterisk and asterisks must be aligned
    * each asterisk must be followed by either a space or a newline (except for the first and the last)
    * the only characters before the asterisk on each line must be whitespace characters
    * one line comments must start with `/** ` and end with ` */`
* `label-position` enforces labels only on sensible statements.
* `label-undefined` checks that labels are defined before usage.
* `max-line-length` sets the maximum length of a line.
* `member-access` enforces using explicit visibility on class members
* `member-ordering` enforces member ordering. Rule options:
    * `public-before-private` All public members must be declared before private members
    * `static-before-instance` All static members must be declared before instance members
    * `variables-before-functions` All variables needs to be declared before functions
* `no-any` diallows usages of `any` as a type decoration.
* `no-arg` disallows access to `arguments.callee`.
* `no-bitwise` disallows bitwise operators.
* `no-conditional-assignment` disallows any type of assignment in any conditionals. This applies to `do-while`, `for`, `if`, and `while` statements.
* `no-console` disallows access to the specified functions on `console`. Rule options are functions to ban on the console variable.
* `no-consecutive-blank-lines` disallows having more than one blank line in a row in a file
* `no-construct` disallows access to the constructors of `String`, `Number`, and `Boolean`.
* `no-constructor-vars` disallows the `public` and `private` modifiers for constructor parameters.
* `no-debugger` disallows `debugger` statements.
* `no-duplicate-key` disallows duplicate keys in object literals.
* `no-duplicate-variable` disallows duplicate variable declarations in the same block scope.
* `no-shadowed-variable` disallows shadowed variable declarations.
* `no-empty` disallows empty blocks.
* `no-eval` disallows `eval` function invocations.
* `no-inferrable-types` disallows explicit type declarations for variables or parameters initialized to a number, string, or boolean
* `no-internal-module` disallows internal `module`, use `namespace` instead.
* `no-require-imports` disallows require() style imports
* `no-string-literal` disallows object access via string literals.
* `no-switch-case-fall-through` disallows falling through case statements.
* `no-trailing-whitespace` disallows trailing whitespace at the end of a line.
* `no-unreachable` disallows unreachable code after `break`, `catch`, `throw`, and `return` statements.
* `no-unused-expression` disallows unused expression statements, that is, expression statements that are not assignments or function invocations (and thus no-ops).
* `no-unused-variable` disallows unused imports, variables, functions and private class members.
    * `"check-parameters"` disallows unused function and constructor parameters.
        * NOTE: this option is experimental and does not work with classes that use abstract method declarations, among other things. Use at your own risk.
* `no-use-before-declare` disallows usage of variables before their declaration.
* `no-var-keyword` disallows usage of the `var` keyword, use `let` or `const` instead.
* `no-var-requires` disallows the use of require statements except in import statements, banning the use of forms such as `var module = require("module")`
* `object-literal-sort-keys` checks that keys in object literals are declared in alphabetical order
* `one-line` enforces the specified tokens to be on the same line as the expression preceding it. Rule options:
  * `"check-catch"` checks that `catch` is on the same line as the closing brace for `try`
  * `"check-else"` checks that `else` is on the same line as the closing brace for `if`
  * `"check-open-brace"` checks that an open brace falls on the same line as its preceding expression.
  * `"check-whitespace"` checks preceding whitespace for the specified tokens.
* `quotemark` enforces consistent single or double quoted string literals. Rule options (at least one of `"double"` or `"single"` is required):
    * `"single"` enforces single quotes
    * `"double"` enforces double quotes
    * `"avoid-escape"` allows you to use the "other" quotemark in cases where escaping would normally be required. For example, `[true, "double", "avoid-escape"]` would not report a failure on the string literal `'Hello "World"'`.
* `radix` enforces the radix parameter of `parseInt`
* `semicolon` enforces semicolons at the end of every statement.
* `switch-default` enforces a `default` case in `switch` statements.
* `trailing-comma` enforces or disallows trailing comma within array and object literals, destructuring assignment and named imports.
  Each rule option requires a value of `"always"` or `"never"`. Rule options:
    * `"multiline"` checks multi-line object literals
    * `"singleline"` checks single-line object literals
* `triple-equals` enforces === and !== in favor of == and !=.
* `typedef` enforces type definitions to exist. Rule options:
    * `"call-signature"` checks return type of functions
    * `"parameter"` checks type specifier of function parameters
    * `"property-declaration"` checks return types of interface properties
    * `"variable-declaration"` checks variable declarations
    * `"member-variable-declaration"` checks member variable declarations
* `typedef-whitespace` enforces spacing whitespace for type definitions. Each rule option requires a value of `"space"` or `"nospace"`
   to require a space or no space before the type specifier's colon. Rule options:
    * `"call-signature"` checks return type of functions
    * `"index-signature"` checks index type specifier of indexers
    * `"parameter"` checks function parameters
    * `"property-declaration"` checks object property declarations
    * `"variable-declaration"` checks variable declaration
* `use-strict` enforces ECMAScript 5's strict mode
    * `check-module` checks that all top-level modules are using strict mode
    * `check-function` checks that all top-level functions are using strict mode
* `variable-name` checks variables names for various errors.  Rule options:
  * `"check-format"`: allows only camelCased or UPPER_CASED variable names
    * `"allow-leading-underscore"` allows underscores at the beginnning
    * `"allow-trailing-underscore"` allows underscores at the end
  * `"ban-keywords"`: disallows the use of certain TypeScript keywords (`any`, `Number`, `number`, `String`, `string`, `Boolean`, `boolean`, `undefined`) as variable or parameter names
* `whitespace` enforces spacing whitespace. Rule options:
  * `"check-branch"` checks branching statements (`if`/`else`/`for`/`while`) are followed by whitespace
  * `"check-decl"`checks that variable declarations have whitespace around the equals token
  * `"check-operator"` checks for whitespace around operator tokens
  * `"check-module"` checks for whitespace in import & export statements
  * `"check-separator"` checks for whitespace after separator tokens (`,`/`;`)
  * `"check-type"` checks for whitespace before a variable type specification
  * `"check-typecast"` checks for whitespace between a typecast and its target

TSLint Rule Flags
-----
You can enable/disable TSLint or a subset of rules within a file with the following comment rule flags:

* `/* tslint:disable */` - Disable all rules for the rest of the file
* `/* tslint:enable */` - Enable all rules for the rest of the file
* `/* tslint:disable:rule1 rule2 rule3... */` - Disable the listed rules for the rest of the file
* `/* tslint:enable:rule1 rule2 rule3... */` - Enable the listed rules for the rest of the file

Rules flags enable or disable rules as they are parsed. A rule is enabled or disabled until a later directive commands otherwise. Disabling an already disabled rule or enabling an already enabled rule has no effect.

For example, imagine the directive `/* tslint:disable */` on the first line of a file, `/* tslint:enable:ban class-name */` on the 10th line and `/* tslint:enable */` on the 20th. No rules will be checked between the 1st and 10th lines, only the `ban` and `class-name` rules will be checked between the 10th and 20th, and all rules will be checked for the remainder of the file.

Custom Rules & Custom Formatters
--------------------------------
See the [Custom Rules](https://github.com/palantir/tslint/wiki/Custom-Rules) and [Custom Formatters](https://github.com/palantir/tslint/wiki/Custom-Formatters) wiki pages for more information.

Development
-----------

To develop TSLint simply clone the repository, install dependencies and run grunt:

```bash
git clone git@github.com:palantir/tslint.git
npm install
grunt
```

Creating a new Release
----------------------

1. Bump up the version number in package.json and tslint.ts
2. Add a section for the new release in CHANGELOG.md
3. Run `grunt` to build the latest sources
4. Commit
5. Run `npm publish`
6. Create a git tag for the new release and push it
