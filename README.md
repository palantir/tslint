tslint [![NPM version](https://badge.fury.io/js/tslint.png)](http://badge.fury.io/js/tslint)
======

A linter for the TypeScript language.

Supported Rules
-----

* `bitwise` disallows bitwise operators.
* `classname` enforces PascalCased class and interface names.
* `curly` enforces braces for `if`/`for`/`do`/`while` statements.
* `debug` disallows `debugger` statements.
* `dupkey` disallows duplicate keys in object literals.
* `eofline` enforces the file to end with a newline.
* `eqeqeq` enforces === and !== in favor of == and !=.
* `evil` disallows `eval` function invocations.
* `forin` enforces a `for ... in` statement to be filtered with an `if` statement.*
* `indent` enforces consistent indentation levels (currently disabled).
* `labelpos` enforces labels only on sensible statements.
* `label-undefined` checks that labels are defined before usage.
* `maxlen` sets the maximum length of a line.
* `noarg` disallows access to `arguments.callee`.
* `noconsole` disallows access to the specified properties on `console`. Rule options are properties to ban on the console variable.
* `noconstruct` disallows access to the constructors of `String`, `Number`, and `Boolean`.
* `nounreachable` disallows unreachable code after `break`, `catch`, `throw`, and `return` statements.
* `noempty` disallows empty blocks.
* `oneline` enforces the specified tokens to be on the same line as the expression preceding it. Rule options:
	* `"check-catch"` checks that `catch` is on the same line as the closing brace for `try`
	* `"check-else"` checks that `else` is on the same line as the closing brace for `if`
	* `"check-open-brace"` checks that an open brace falls on the same line as its preceding expression.
	* `"check-whitespace"` checks preceding whitespace for the specified tokens.
* `quotemark` enforces consistent single or double quoted string literals.
* `radix` enforces the radix parameter of `parseInt`
* `semicolon` enforces semicolons at the end of every statement.
* `sub` disallows object access via string literals.
* `trailing` disallows trailing whitespace at the end of a line.
* `varname` allows only camelCased or UPPER_CASED variable names.
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
	  -c, --config  configuration file
	  -f, --file    file to lint                 [required]
	  -o, --out     output file
	  -t, --format  output format (prose, json)  [default: "prose"]

By default, configuration is loaded from `.tslintrc` or `tslint.json`, if either exists in the current path.

##### Library

	var options = {
		formatter: "json",
	    configuration: configuration
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
