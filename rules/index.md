---
layout: page
title: Rules
permalink: /rules/
menu: main
order: 2
---
TSLint supports a variety of rules that help keep TypeScript code
maintainable, readable, and correct:

* `align` enforces vertical alignment. Rule options:
  * `"parameters"` checks alignment of function parameters.
  * `"arguments"` checks alignment of function call arguments.
  * `"statements"` checks alignment of statements.
* `ban` bans the use of specific functions. Options are ["object", "function"] pairs that ban the use of object.function().
* `class-name` enforces PascalCased class and interface names.
* `comment-format` enforces rules for single-line comments. Rule options:
    * `"check-space"` enforces the rule that all single-line comments must begin with a space, as in `// comment`
        * note that comments starting with `///` are also allowed, for things such as `///<reference>`
    * `"check-lowercase"` enforces the rule that the first non-whitespace character of a comment must be lowercase, if applicable.
    * `"check-uppercase"` enforces the rule that the first non-whitespace character of a comment must be uppercase, if applicable.
* `curly` enforces braces for `if`/`for`/`do`/`while` statements.
* `eofline` enforces the file to end with a newline.
* `forin` enforces a `for ... in` statement to be filtered with an `if` statement.*
* `indent` enforces indentation with tabs or spaces. Rule options (one is required):
    * `"tabs"` enforces consistent tabs.
    * `"spaces"` enforces consistent spaces.
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
    * `"check-accessor"` enforces explicit visibility on get/set accessors (can only be public)
    * `"check-constructor"` enforces explicit visibility on constructors (can only be public)
* `member-ordering` enforces member ordering. Rule options:
    * `public-before-private` All public members must be declared before private members.
    * `static-before-instance` All static members must be declared before instance members.
    * `variables-before-functions` All variables needs to be declared before functions.
* `no-any` diallows usages of `any` as a type decoration.
* `no-arg` disallows access to `arguments.callee`.
* `no-bitwise` disallows bitwise operators.
* `no-conditional-assignment` disallows any type of assignment in any conditionals. This applies to `do-while`, `for`, `if`, and `while` statements.
* `no-consecutive-blank-lines` disallows having more than one blank line in a row in a file.
* `no-console` disallows access to the specified functions on `console`. Rule options are functions to ban on the console variable.
* `no-construct` disallows access to the constructors of `String`, `Number`, and `Boolean`.
* `no-constructor-vars` disallows the `public` and `private` modifiers for constructor parameters.
* `no-debugger` disallows `debugger` statements.
* `no-duplicate-key` disallows duplicate keys in object literals.
* `no-duplicate-variable` disallows duplicate variable declarations in the same block scope.
* `no-empty` disallows empty blocks.
* `no-eval` disallows `eval` function invocations.
* `no-inferrable-types` disallows explicit type declarations for variables or parameters initialized to a number, string, or boolean.
* `no-internal-module` disallows internal `module` (use `namespace` instead).
* `no-null-keyword` disallows use of the `null` keyword literal
* `no-require-imports` disallows invocation of `require()` (use ES6-style imports instead).
* `no-shadowed-variable` disallows shadowed variable declarations.
* `no-string-literal` disallows object access via string literals.
* `no-switch-case-fall-through` disallows falling through case statements.
* `no-trailing-whitespace` disallows trailing whitespace at the end of a line.
* `no-unreachable` disallows unreachable code after `break`, `catch`, `throw`, and `return` statements.
* `no-unused-expression` disallows unused expression statements, that is, expression statements that are not assignments or function invocations (and thus no-ops).
* `no-unused-variable` disallows unused imports, variables, functions and private class members. Rule options:
    * `"check-parameters"` disallows unused function and constructor parameters.
        * NOTE: this option is experimental and does not work with classes that use abstract method declarations, among other things. Use at your own risk.
    * `"react"` relaxes the rule for a namespace import named `React` (from either the module `"react"` or `"react/addons"`). Any JSX expression in the file will be treated as a usage of `React` (because it expands to `React.createElement`).
* `no-use-before-declare` disallows usage of variables before their declaration.
* `no-var-keyword` disallows usage of the `var` keyword, use `let` or `const` instead.
* `no-var-requires` disallows the use of require statements except in import statements, banning the use of forms such as `var module = require("module")`.
* `object-literal-sort-keys` checks that keys in object literals are declared in alphabetical order (useful to prevent merge conflicts).
* `one-line` enforces the specified tokens to be on the same line as the expression preceding it. Rule options:
  * `"check-catch"` checks that `catch` is on the same line as the closing brace for `try`.
  * `"check-else"` checks that `else` is on the same line as the closing brace for `if`.
  * `"check-open-brace"` checks that an open brace falls on the same line as its preceding expression.
  * `"check-whitespace"` checks preceding whitespace for the specified tokens.
* `quotemark` enforces consistent single or double quoted string literals. Rule options (at least one of `"double"` or `"single"` is required):
    * `"single"` enforces single quotes.
    * `"double"` enforces double quotes.
    * `"avoid-escape"` allows you to use the "other" quotemark in cases where escaping would normally be required. For example, `[true, "double", "avoid-escape"]` would not report a failure on the string literal `'Hello "World"'`.
* `radix` enforces the radix parameter of `parseInt`.
* `semicolon` enforces semicolons at the end of every statement.
* `switch-default` enforces a `default` case in `switch` statements.
* `trailing-comma` enforces or disallows trailing comma within array and object literals, destructuring assignment and named imports.
  Each rule option requires a value of `"always"` or `"never"`. Rule options:
    * `"multiline"` checks multi-line object literals.
    * `"singleline"` checks single-line object literals.
* `triple-equals` enforces === and !== in favor of == and !=.
* `typedef` enforces type definitions to exist. Rule options:
    * `"call-signature"` checks return type of functions.
    * `"parameter"` checks type specifier of function parameters.
    * `"property-declaration"` checks return types of interface properties.
    * `"variable-declaration"` checks variable declarations.
    * `"member-variable-declaration"` checks member variable declarations.
* `typedef-whitespace` enforces spacing whitespace for type definitions. Each rule option requires a value of `"space"` or `"nospace"`
   to require a space or no space before the type specifier's colon. Rule options:
    * `"call-signature"` checks return type of functions.
    * `"index-signature"` checks index type specifier of indexers.
    * `"parameter"` checks function parameters.
    * `"property-declaration"` checks object property declarations.
    * `"variable-declaration"` checks variable declaration.
* `use-strict` enforces ECMAScript 5's strict mode.
    * `check-module` checks that all top-level modules are using strict mode.
    * `check-function` checks that all top-level functions are using strict mode.
* `variable-name` checks variables names for various errors.  Rule options:
  * `"check-format"`: allows only camelCased or UPPER_CASED variable names
    * `"allow-leading-underscore"` allows underscores at the beginning.
    * `"allow-trailing-underscore"` allows underscores at the end.
  * `"ban-keywords"`: disallows the use of certain TypeScript keywords (`any`, `Number`, `number`, `String`, `string`, `Boolean`, `boolean`, `undefined`) as variable or parameter names.
* `whitespace` enforces spacing whitespace. Rule options:
  * `"check-branch"` checks branching statements (`if`/`else`/`for`/`while`) are followed by whitespace.
  * `"check-decl"`checks that variable declarations have whitespace around the equals token.
  * `"check-operator"` checks for whitespace around operator tokens.
  * `"check-module"` checks for whitespace in import & export statements.
  * `"check-separator"` checks for whitespace after separator tokens (`,`/`;`).
  * `"check-type"` checks for whitespace before a variable type specification.
  * `"check-typecast"` checks for whitespace between a typecast and its target.
