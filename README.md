tslint
======

A linter for the TypeScript language.

Rules
-----

* `semicolon` enforces semicolons at the end of every statement.
* `eqeqeq` enforces === and !== in favor of == and !=.
* `maxlen` sets the maximum length of a line.
* `whitespace` enforces whitespace between a keyword and a conditional, surrounding an operator,
   and enclosing "=" within variable declarations and import/export statements.
* `quotemark` enforces consistent single or double quoted string literals.
* `oneline` enforces an opening brace to be on the same line as the expression preceding it.
* `trailing` disallows trailing whitespace at the end of a line.
* `bitwise` disallows bitwise operators.
* `evil` disallows `eval` function invocations.
* `eofline` enforces the file to end with a newline.
* `classname` enforces PascalCased class names.
* `varname` allows only camelCased or UPPER_CASED variable names.
* `noarg` disallows access to `arguments.callee`.
* `sub` disallows object access via string literals.
* `forin` enforces a `for ... in` statement to be filtered with an `if` statement.
* `curly` enforces braces for if/for/do/while statements.
* `indent` enforces consistent indentation for the whole file.

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
* Disallow variables referenced outside of their scope definition
* Disallow unused variables
