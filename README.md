tslint [![NPM version](https://badge.fury.io/js/tslint.png)](http://badge.fury.io/js/tslint) [![Builds](https://api.travis-ci.org/repositories/palantir/tslint.png?branch=master)](https://travis-ci.org/palantir/tslint)
======

A linter for the TypeScript language.

Supported Rules
-----

* `ban` bans the use of specific functions. Options are ["object", "function"] pairs that ban the use of object.function()
* `class-name` enforces PascalCased class and interface names.
* `comment-format` enforces rules for single-line comments. Rule options:
    * `"check-space"` enforces the rule that all single-line comments must begin with a space, as in `// comment`
        * note that comments starting with `///` are also allowed, for things such as ///<reference>
    * `"check-lowercase"` enforces the rule that the first non-whitespace character of a comment must be lowercase, if applicable
* `curly` enforces braces for `if`/`for`/`do`/`while` statements.
* `eofline` enforces the file to end with a newline.
* `forin` enforces a `for ... in` statement to be filtered with an `if` statement.*
* `indent` enforces consistent indentation levels (currently disabled).
* `interface-name` enforces the rule that interface names must begin with a capital 'I'
* `jsdoc-format` enforces basic format rules for jsdoc comments -- comments starting with `/**`
    * each line contains an asterisk and asterisks must be aligned
    * each asterisk must be followed by either a space or a newline (except for the first and the last)
    * the only characters before the asterisk on each line must be whitepace characters
* `label-position` enforces labels only on sensible statements.
* `label-undefined` checks that labels are defined before usage.
* `max-line-length` sets the maximum length of a line.
* `no-arg` disallows access to `arguments.callee`.
* `no-bitwise` disallows bitwise operators.
* `no-console` disallows access to the specified functions on `console`. Rule options are functions to ban on the console variable.
* `no-consecutive-blank-lines` disallows having more than one blank line in a row in a file
* `no-construct` disallows access to the constructors of `String`, `Number`, and `Boolean`.
* `no-debugger` disallows `debugger` statements.
* `no-duplicate-key` disallows duplicate keys in object literals.
* `no-duplicate-variable` disallows duplicate variable declarations.
* `no-empty` disallows empty blocks.
* `no-eval` disallows `eval` function invocations.
* `no-string-literal` disallows object access via string literals.
* `no-trailing-comma` disallows trailing comma within object literals.
* `no-trailing-whitespace` disallows trailing whitespace at the end of a line.
* `no-unused-variable` disallows unused imports, variables, functions and private class members.
* `no-unreachable` disallows unreachable code after `break`, `catch`, `throw`, and `return` statements.
* `one-line` enforces the specified tokens to be on the same line as the expression preceding it. Rule options:
	* `"check-catch"` checks that `catch` is on the same line as the closing brace for `try`
	* `"check-else"` checks that `else` is on the same line as the closing brace for `if`
	* `"check-open-brace"` checks that an open brace falls on the same line as its preceding expression.
	* `"check-whitespace"` checks preceding whitespace for the specified tokens.
* `quotemark` enforces consistent single or double quoted string literals.
* `radix` enforces the radix parameter of `parseInt`
* `semicolon` enforces semicolons at the end of every statement.
* `triple-equals` enforces === and !== in favor of == and !=.
* `typedef` enforces type definitions to exist. Rule options:
    * `"callSignature"` checks return type of functions
    * `"catchClause"` checks type in exception catch blocks
    * `"indexSignature"` checks index type specifier of indexers
    * `"parameter"` checks type specifier of parameters
    * `"propertySignature"` checks return types of interface properties
    * `"variableDeclarator"` checks variable declarations
* `typedef-whitespace` enforces spacing whitespace for type definitions. Each rule option requires a value of `"space"` or `"nospace"`
   to require a space or no space before the type specifier's colon. Rule options:
    * `"callSignature"` checks return type of functions
    * `"catchClause"` checks type in exception catch blocks
    * `"indexSignature"` checks index type specifier of indexers
* `use-strict` enforces ECMAScript 5's strict mode
    * `check-module` checks that all top-level modules are using strict mode
    * `check-function` checks that all top-level functions are using strict mode
* `variable-name` allows only camelCased or UPPER_CASED variable names. Rule options:
	* `"allow-leading-underscore"` allows underscores at the beginnning.
* `whitespace` enforces spacing whitespace. Rule options:
	* `"check-branch"` checks branching statements (`if`/`else`/`for`/`while`) are followed by whitespace
	* `"check-decl"`checks that variable declarations have whitespace around the equals token
	* `"check-operator"` checks for whitespace around operator tokens
	* `"check-separator"` checks for whitespace after separator tokens (`,`/`;`)
	* `"check-type"` checks for whitespace before a variable type specification

tslint rule flags
-----
You can disable/enable tslint inside a file, or some subset of the tslint rules, with the following comment rule flags:

* `/* tslint:disable */` will disable all rules for the rest of the file
* `/* tslint:enable */` will enable all rules for the rest of the file
* `/* tslint:disable:rule1 rule2 rule3... */` will disable the listed rules for the rest of the file
* `/* tslint:enable:rule1 rule2 rule3... */` will enable the listed rules for the rest of the file

Rules flags will enable and disable rules as they are passed, each directive will turn the rules listed in the flag on or off until a later flag turns the rule on or off.
Disabling an already disabled rule and enabling an already enabled rule will have no effect.

For instance: imagine we have a file with `/* tslint:disable */` on the first line of a file, `/* tslint:enable:ban class-name */` on the tenth line and a `/* tslint:enable */` on the twentieth. No rules will be checked between the first line and the tenth, only the ban and class-name rules will be checked between the tenth and twentieth, and all rules will be checked for the remainder of the file.

Installation
------------

##### CLI

    sudo npm install tslint -g

##### Library

    npm install tslint

Usage
-----

Please first ensure that the TypeScript source files compile correctly.

##### CLI

    usage: tslint

	Options:
	  -c, --config  		 configuration file
	  -f, --file    		 file to lint                 [required]
	  -o, --out     		 output file
      -r, --rules-dir   	 rules directory
      -s, --formatters-dir   formatters directory
	  -t, --format  		 output format (prose, json)  [default: "prose"]

By default, configuration is loaded from `tslint.json`, if it exists in the current path.

tslint accepts the following commandline options:

    -f, --file:
        The location of the TypeScript file that you wish to lint. This
        option is required.

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
        An additional rules directory, for additional user-created rules.
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

	var options = {
		formatter: "json",
	    configuration: configuration,
	    rulesDirectory: "customRules/",
	    formattersDirectory: "customFormatters/"
	};

	var Linter = require("tslint");

	var ll = new Linter(fileName, contents, options);
	var result = ll.lint();

Development
-----------

### Setup ###

    git clone git@github.com:palantir/tslint.git

### Build ###

    npm install
    grunt

TODO
----
* Add more rules from jshint
* Disallow unused variables
