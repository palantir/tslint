TSLint [![NPM version](https://badge.fury.io/js/tslint.svg)](http://badge.fury.io/js/tslint) [![Linux Build Status](https://travis-ci.org/palantir/tslint.svg?branch=master)](https://travis-ci.org/palantir/tslint) [![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/palantir/tslint?svg=true&branch=master)](https://ci.appveyor.com/project/ashwinr/tslint)
======

A linter for the TypeScript language.

Installation
------------

##### CLI

```npm install tslint -g```

##### Library

```npm install tslint```

Usage
-----

Please first ensure that the TypeScript source files compile correctly.

##### CLI

  usage: tslint

  Options:

    -c, --config              configuration file
    -f, --file                file to lint                  [required]
    -o, --out                 output file
    -r, --rules-dir           rules directory
    -s, --formatters-dir      formatters directory
    -t, --format              output format (prose, json)   [default: "prose"]

By default, configuration is loaded from `tslint.json`, if it exists in the current path, or the user's home directory, in that order.

tslint accepts the following commandline options:

    -f, --file:
        The location of the TypeScript file that you wish to lint. This
        option is required. Muliptle files are processed consecutively.

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
var options = {
  formatter: "json",
  configuration: configuration,
  rulesDirectory: "customRules/",
  formattersDirectory: "customFormatters/"
};

var Linter = require("tslint");

var ll = new Linter(fileName, contents, options);
var result = ll.lint();
```

Supported Rules
-----

A sample configuration file with all options is available [here](https://github.com/palantir/tslint/blob/master/docs/sample.tslint.json).

* `ban` bans the use of specific functions. Options are ["object", "function"] pairs that ban the use of object.function()
* `class-name` enforces PascalCased class and interface names.
* `comment-format` enforces rules for single-line comments. Rule options:
    * `"check-space"` enforces the rule that all single-line comments must begin with a space, as in `// comment`
        * note that comments starting with `///` are also allowed, for things such as `///<reference>`
    * `"check-lowercase"` enforces the rule that the first non-whitespace character of a comment must be lowercase, if applicable
* `curly` enforces braces for `if`/`for`/`do`/`while` statements.
* `eofline` enforces the file to end with a newline.
* `forin` enforces a `for ... in` statement to be filtered with an `if` statement.*
* `indent` enforces consistent indentation with tabs or spaces.
* `interface-name` enforces the rule that interface names must begin with a capital 'I'
* `jsdoc-format` enforces basic format rules for jsdoc comments -- comments starting with `/**`
    * each line contains an asterisk and asterisks must be aligned
    * each asterisk must be followed by either a space or a newline (except for the first and the last)
    * the only characters before the asterisk on each line must be whitepace characters
    * one line comments must start with `/** ` and end with ` */`
* `label-position` enforces labels only on sensible statements.
* `label-undefined` checks that labels are defined before usage.
* `max-line-length` sets the maximum length of a line.
* `member-ordering` enforces member ordering. Rule options:
    * `public-before-private` All public members must be declared before private members
    * `static-before-instance` All static members must be declared before instance members
    * `variables-before-functions` All variables needs to be declared before functions
* `no-any` diallows usages of `any` as a type decoration.
* `no-arg` disallows access to `arguments.callee`.
* `no-bitwise` disallows bitwise operators.
* `no-console` disallows access to the specified functions on `console`. Rule options are functions to ban on the console variable.
* `no-consecutive-blank-lines` disallows having more than one blank line in a row in a file
* `no-construct` disallows access to the constructors of `String`, `Number`, and `Boolean`.
* `no-constructor-vars` disallows the `public` and `private` modifiers for constructor parameters.
* `no-debugger` disallows `debugger` statements.
* `no-duplicate-key` disallows duplicate keys in object literals.
* `no-duplicate-variable` disallows duplicate variable declarations.
* `no-empty` disallows empty blocks.
* `no-eval` disallows `eval` function invocations.
* `no-string-literal` disallows object access via string literals.
* `no-switch-case-fall-through` disallows falling through case statements.
* `no-trailing-comma` disallows trailing comma within object literals.
* `no-trailing-whitespace` disallows trailing whitespace at the end of a line.
* `no-unreachable` disallows unreachable code after `break`, `catch`, `throw`, and `return` statements.
* `no-unused-expression` disallows unused expression statements, that is, expression statements that are not assignments or function invocations (and thus no-ops).
* `no-unused-variable` disallows unused imports, variables, functions and private class members.
    * `"check-parameters"` disallows unused function and constructor parameters.
        * NOTE: this option is experimental and does not work with classes that use abstract method declarations, among other things. Use at your own risk.
* `no-use-before-declare` disallows usage of variables before their declaration.
* `no-var-requires` disallows the use of require statements except in import statements, banning the use of forms such as `var module = require("module")`
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
* `variable-name` allows only camelCased or UPPER_CASED variable names. Rule options:
  * `"allow-leading-underscore"` allows underscores at the beginnning.
* `whitespace` enforces spacing whitespace. Rule options:
  * `"check-branch"` checks branching statements (`if`/`else`/`for`/`while`) are followed by whitespace
  * `"check-decl"`checks that variable declarations have whitespace around the equals token
  * `"check-operator"` checks for whitespace around operator tokens
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

Custom Rules
------------
TSLint ships with a set of core rules that can be configured. However, users are also allowed to write their own rules, which allows them to enforce specific behavior not covered by the core of TSLint. TSLint's internal rules are itself written to be pluggable, so adding a new rule is as simple as creating a new rule file named by convention. New rules can be written in either TypeScript or Javascript; if written in TypeScript, the code must be compiled to Javascript before invoking TSLint.

Rule names are always camel-cased and *must* contain the suffix `Rule`. Let us take the example of how to write a new rule to forbid all import statements (you know, *for science*). Let us name the rule file `noImportsRule.ts`. Rules can be referenced in `tslint.json` in their dasherized forms, so `"no-imports": true` would turn on the rule.

Now, let us first write the rule in TypeScript. At the top, we reference TSLint's [definition](https://github.com/palantir/tslint/blob/master/lib/tslint.d.ts) file. The exported class name must always be named `Rule` and extend from `Lint.Rules.AbstractRule`.

```typescript
/// <reference path='tslint.d.ts' />

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "import statement forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
    }
}
```

The walker takes care of all the work.

```typescript
class NoImportsWalker extends Lint.RuleWalker {
    public visitImportDeclaration(node: ts.ImportDeclaration) {
        // create a failure at the current position
        this.addFailure(this.createFailure(node.getStart(), node.width(), Rule.FAILURE_STRING));

        // call the base version of this visitor to actually parse this node
        super.visitImportDeclaration(node);
    }
}
```

Given a walker, TypeScript's parser visits the AST using the visitor pattern. So the rule walkers only need to override the appropriate visitor methods to enforce its checks. For reference, the base walker can be found in [syntaxWalker.ts](https://github.com/palantir/tslint/blob/1.4/src/language/walker/syntaxWalker.ts).

We still need to hook up this new rule to TSLint. First make sure to compile `noImportsRule.ts`: `tsc -m commonjs --noImplicitAny noImportsRule.ts tslint.d.ts`. Then, if using the CLI, provide the directory that contains this rule as an option to `--rules-dir`. If using TSLint as a library or via `grunt-tslint`, the `options` hash must contain `"rulesDirectory": "..."`. If you run the linter, you'll see that we have now successfully banned all import statements via TSLint!

Now, let us rewrite the same rule in Javascript.

```javascript

function Rule() {
    Lint.Rules.AbstractRule.apply(this, arguments);
}

Rule.prototype = Object.create(Lint.Rules.AbstractRule.prototype);
Rule.prototype.apply = function(sourceFile) {
    return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
};

function NoImportsWalker() {
    Lint.RuleWalker.apply(this, arguments);
}

NoImportsWalker.prototype = Object.create(Lint.RuleWalker.prototype);
NoImportsWalker.prototype.visitImportDeclaration = function (node) {
    // create a failure at the current position
    this.addFailure(this.createFailure(node.getStart(), node.width(), "import statement forbidden"));

    // call the base version of this visitor to actually parse this node
    Lint.RuleWalker.prototype.visitImportDeclaration.call(this, node);
};

exports.Rule = Rule;
```

As you can see, it's a pretty straightforward translation from the equivalent TypeScript code.

Finally, core rules cannot be overwritten with a custom implementation, and rules can also take in options (retrieved via `this.getOptions()`).

Custom Formatters
-----------------
Just like rules, additional formatters can also be supplied to TSLint via `--formatters-dir` on the CLI or `formattersDirectory` option on the library or `grunt-tslint`. Writing a new formatter is simpler than writing a new rule, as shown in the JSON formatter's code.

```javascript
/// <reference path='tslint.d.ts' />

export class Formatter extends Lint.Formatters.AbstractFormatter {
    public format(failures: Lint.RuleFailure[]): string {
        var failuresJSON = failures.map((failure: Lint.RuleFailure) => failure.toJson());
        return JSON.stringify(failuresJSON);
    }
}
```

Such custom formatters can also be written in Javascript. Additionally, formatter files are always named with the suffix `Formatter`, and referenced from TSLint without its suffix.

Development
-----------

To develop tslint simply clone the repository, install dependencies and run grunt:

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
