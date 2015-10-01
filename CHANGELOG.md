Change Log
===

v2.5.1
---
* [new-rule] no-inferrable-types rule (#676)
* [new-rule-option] "avoid-escape" option for quotemark rule (#543)
* [bugfix] type declaration for tslint external module #686
* [enhancement] `AbstractRule` and `AbstractFormatter` are now abstract classes (#631)
	* Note: `Lint.abstract()` is now deprecated

v2.5.0
---
* Use TypeScript compiler `v1.6.2`
* [bugfixes] #637, #642, #650, #652
* [bugfixes] fix various false positives in `no-unused-variable` rule (#570, #613, #663)
* Update project setup for latest VSCode (#662)

v2.5.0-beta
---
* Use TypeScript compiler `v1.6.0-beta`
* [bugfix] Fix `no-internal-module` false positives on nested namespaces (#600)
* [docs] Add documentation for `sort-object-literal-keys` rule

v2.5.0-dev.5
---
* Upgrade TypeScript compiler to `v1.7.0-dev.20150828`
* [bugfix] Handle .tsx files appropriately (#597, #558)

v2.5.0-dev.4
---
* Upgrade TypeScript compiler to `v1.6.0-dev.20150825`

v2.5.0-dev.3
---
* Upgrade TypeScript compiler to `v1.6.0-dev.20150821`

v2.5.0-dev.2
---
* Upgrade TypeScript compiler to `v1.6.0-dev.20150811`
* [bug] fix `whitespace` false positive in JSX elements (#559)

v2.5.0-dev.1
---
* Upgrade TypeScript compiler to `v1.6.0-dev.20150805`
* [enhancement] Support `.tsx` syntax (#490)

v2.4.5
---
* [bugfix] fix false positives on `no-shadowed-variable` rule (#500)
* [enhancement] add `allow-trailing-underscore` option to `variable-name` rule

v2.4.4
---
* [bugfix] remove "typescript" block from package.json (#606)

v2.4.3
---
* [new-rule] `no-conditional-assignment` (#507)
* [new-rule] `member-access` (#552)
* [new-rule] `no-internal-module` (#513)
* [bugfix] small fixes to `sample.tslint.json` (#545)
* [bugfix] fix README docs for quotemark and indent (#523)
* [enhancement] update `findup-sync` and `underscore.string` dependencies
* [enhancement] add `"typescript"` field to `package.json` (#560)
* [enhancement] small improvements to CLI help text
* [enhancement] expose raw failures array in the JS API (#477)

v2.4.2
---
* [bug] remove npm-shrinkwrap.json from the published package

v2.4.0
---
* Upgraded Typescript compiler to 1.5.3
* [bugs] #332, #493, #509, #483
* [bug] fix error message in `no-var-keyword` rule
* [enhancement] CI tests are now run on node v0.12 in addition to v0.10
* **BREAKING**
	* `-f` option removed from CLI

v2.3.1-beta
---
* [bugs] #137 #434 #451 #456
* [new-rule] `no-require-imports` disallows `require()` style imports
* [new-rule] `no-shadowed-variable` moves over shadowed variable checking from `no-duplicate-variable` into its own rule
* **BREAKING**
	* `no-duplicate-variable` now only checks for duplicates within the same block scope; enable `no-shadowed-variable` to get duplicate-variable checking across block scopes
* [enhancement] `no-duplicate-variable`, `no-shadowed-variable`, and `no-use-before-declare` now support ES6 destructuring
* [enhancement] tslint CLI now uses a default configuration if no config file is found

v2.3.0-beta
---
* [bugs] #401 #367 #324 #352
* [new-rule] `no-var-keyword` disallows `var` in favor of `let` and `const`
* [new-rule] `sort-object-literal-keys` forces object-literal keys to be sorted alphabetically
* Add support for ES6 destructuring and module syntax (affects `variable-name`, `no-use-before-declare`, `whitespace` and `no-unused-variable`)
* Add support for ES6 for-of and spread operator syntax
* Use tsconfig.json & JSCS in the build system

v2.2.0-beta
---
* Upgraded Typescript compiler to 1.5.0-beta
* **BREAKING CHANGES**
	* due to changes to the typescript compiler API, old custom rules may no longer work and may need to be rewritten
	* the JSON formatter's line and character positions are now back to being 0-indexed instead of 1-indexed
* [bugs] #328 #334 #319 #351 #365 #254
* [bug] fixes for tslint behavior around template strings (fixes #357, #349, #332, and more)
* [new-rule] `align` rule now enforces vertical alignment on parameters, arguments, and statements
* [new-rule] `switch-default` enforces a `default` case in `switch` statements
* [feature] `no-duplicate-variable` rule now additionally checks if function parameters have been shadowed
* Additional fixes to existing rules to work as before with the typescript 1.5 compiler

v2.1.1
---
* [bugs] #292 #293 #295 #301 #302
* Some internal refactoring
* Added Windows CI testing (appveyor)

v2.1.0
---
* Fix crash on Windows

v2.0.1
---
* Upgraded Typescript compiler to 1.4
* **BREAKING CHANGES**
	* typedef rule options were modified:
		* index-signature removed as no longer necessary
		* property-signature renamed to property-declaration
		* variable-declarator renamed to variable-declaration
		* member-variable-declarator renamed to member-variable-declaration
	* typedef-whitespace rule options were modified:
		* catch-clause was removed as invalid
		* further options were added, see readme for more details
	* due to changes to the typescript compiler API, old custom rules may no longer work and may need to be rewritten
	* the JSON formatter's line and character positions are now 1-indexed instead of 0-indexed

v1.2.0
---
* [bug] #245

v1.0.1
---
* [bug] #238

v1.0.0
---
* upgrade TypeScript compiler to 1.3
* **BREAKING CHANGES**
	* all error messages now start with a lower-case character and do not end with a period
	* all rule options are consistent in nomenclature. The `typedef` and `typedef-whitespace` rules now take in hyphenated options
	* `unused-variables` rule cannot find unused private variables defined in the constructor due to a bug in 1.3 compiler
	* `indent` rule has changed to only check for tabs or spaces and not enforce indentation levels

v0.4.12
---
* multiple files with -f on cli
* config file search starts with input file

v0.4.11
---
* [bugs] #136, #163
* internal refactors

v0.4.10
---
* [bugs] #138, #145, #146, #148

v0.4.9
---
* [new-rule] `no-any` disallows all uses of `any`
* [bug] `/* tslint:disable */` now disables semicolon rule as well
* [bug] delete operator no longer results in a false positive for `no-unused-expression`

v0.4.8
---
* [new-rule] `no-var-requires` disallows require statements not part of an import statement
* [new-rule] `typedef` rule also checks for member variables
* [bug] `no-unused-variable` no longer triggers false positives for class members labeled only `static`
* [bug] `no-unused-expression` no longer triggers false positives for `"use strict";` expressions
* [bug] `use-strict` works correctly on function declarations
* [bug] config file is now discoverable from other drives on Windows

v0.4.7
---
* [new-rule] added `no-unused-expression` rule which disallows unused expression statements
* [feature] the `check-operator` option for the `whitespace` rule now checks whitespace around the => token
* [bug] `no-use-before-declare-rule` no longer triggers false positives for member variables of classes used before the class is declared
* [bug] semicolon at end of file no longer triggers false positives for `whitespace` rule
* [bug] hoisted functions no longer cause false positives for the `no-unreachable` rule
* [bug] the rule loader no longer transforms/ignores the leading and trailing underscores and dashes of rule names in the config file
* [bug] `export import` statements no longer false positives for `no-unused-variable-rule`
* [docs] added documentation for creating custom rules and formatters
* [docs] added sample `tslint.json` file, under `docs/sample.tslint.json`

v0.4.6
---
* [build] migrated build to use `grunt-ts` instead of `grunt-typescript`
* [feature] `package.json` now contains a `tslintConfig` paramater to allow users to specify the location of the configuration file there
* [feature] tslint now searches for the configuration file in the user's home directory if not found in the current path
* [bug] unbraced conditionals no longer cause false positives for the `no-unreachable` rule

v0.4.5
---
* [feature] `no-unused-variable` no longer checks parameters by defualt. Parameters are now only checked if the `check-parameters` option is set.
* [bug] `no-unused-variable` parameter check no longer fails on variable argument parameters (like ...args) and on cases where the parameters are broken up by newlines.

v0.4.4
---
* [bug] `no-unused-variable` validates function parameters and constructor methods
* [bug] `no-empty` and `no-trailing-comma` rules handle empty objects

v0.4.3
---
* [new-rule] `no-unused-variable`
* [new-rule] `no-trailing-comma`
* [new-rule] `no-use-before-declare`
* [feature] support `--version` in CLI
* [feature] expose rule names to custom formatters
* [feature] add `verbose` formatter
* [bug] `no-empty` allows constructors with member declaration parameters
* [bug] CLI supports `--help`
* [bug] `max-line-length` allows CRLF endings
