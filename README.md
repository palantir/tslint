tslint [![NPM version](https://badge.fury.io/js/tslint.png)](http://badge.fury.io/js/tslint) [![Builds](https://api.travis-ci.org/repositories/palantir/tslint.png?branch=master)](https://travis-ci.org/palantir/tslint)
======

A linter for the TypeScript language.

Supported Rules
-----

* `class-name` enforces PascalCased class and interface names.
* `curly` enforces braces for `if`/`for`/`do`/`while` statements.
* `eofline` enforces the file to end with a newline.
* `forin` enforces a `for ... in` statement to be filtered with an `if` statement.*
* `indent` enforces consistent indentation levels (currently disabled).
* `label-position` enforces labels only on sensible statements.
* `label-undefined` checks that labels are defined before usage.
* `max-line-length` sets the maximum length of a line.
* `no-arg` disallows access to `arguments.callee`.
* `no-bitwise` disallows bitwise operators.
* `no-console` disallows access to the specified properties on `console`. Rule options are properties to ban on the console variable.
* `no-construct` disallows access to the constructors of `String`, `Number`, and `Boolean`.
* `no-debugger` disallows `debugger` statements.
* `no-duplicate-key` disallows duplicate keys in object literals.
* `no-duplicate-variable` disallows duplicate variable declarations.
* `no-empty` disallows empty blocks.
* `no-eval` disallows `eval` function invocations.
* `no-string-literal` disallows object access via string literals.
* `no-trailing-whitespace` disallows trailing whitespace at the end of a line.
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
    * `"getAccessorPropertyAssignment"` checks get accessor assignments on object literals
    * `"getMemberAccessorDeclaration"` checks get member accessor declarations on classes
    * `"parameter"` checks type specifier of parameters
    * `"propertySignature"` checks return types of interface properties
    * `"variableDeclarator"` checks variable declarations
* `typedef-whitespace` enforces spacing whitespace for type definitions. Each rule option requires a value of `"space"` or `"nospace"`
   to require a space or no space before the type specifier's colon. Rule options:
    * `"callSignature"` checks return type of functions
    * `"catchClause"` checks type in exception catch blocks
    * `"indexSignature"` checks index type specifier of indexers
* `variable-name` allows only camelCased or UPPER_CASED variable names. Rule options:
	* `"allow-leading-underscore"` allows underscores at the beginnning.
* `whitespace` enforces spacing whitespace. Rule options:
	* `"check-branch"` checks branching statements (`if`/`else`/`for`/`while`) are followed by whitespace
	* `"check-decl"`checks that variable declarations have whitespace around the equals token
	* `"check-operator"` checks for whitespace around operator tokens
	* `"check-separator"` checks for whitespace after separator tokens (`,`/`;`)
	* `"check-type"` checks for whitespace before a variable type specification


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

By default, configuration is loaded from `.tslintrc` or `tslint.json`, if either exists in the current path.

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
    cd tslint
    git submodule init
    git submodule update

### Build ###

    npm install
    grunt

TODO
----
* Add more rules from jshint
* Disallow variables referenced outside of their scope definition
* Disallow unused variables
* Support pluggable formatters
