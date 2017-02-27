Change Log
===

v4.5.0
---

- [new-rule] `no-import-side-effect` (#2155)
- [new-rule] `match-default-export-name` (#2117)
- [new-rule] `no-non-null-assertion` (#2221)
- [new-rule] `ban-types` (#2175)
- [new-rule] `no-duplicate-super` (#2038)
- [new-rule] `newline-before-return` (#2173)
- [new-rule-option] `completed-docs` adds options for location, type, and privacy. Also adds interfaces, enums, types (#2095)
- [new-rule-option] `no-inferrable-types` adds option  `ignore-properties` (#2178)
- [new-rule-option] `typedef` adds options `object-destructuring` and `array-destructuring` options (#2146)
- [new-rule-option] `member-ordering` adds option `alphabetize` (#2101)
- [new-rule-option] `no-trailing-whitespace` adds option `ignore-jsdoc` (#2177)
- [new-rule-option] `no-trailing-whitespace` adds option `ignore-comments` option (#2153)
- [new-fixer] `no-inferrable-types` automatically remove inferrable type annotations (#2178)
- [new-fixer] `no-any` (#2165)
- [new-fixer] `noConsecutiveBlankLines` (#2201)
- [new-fixer] `object-literal-shorthand` (#2165)
- [bugfix] `no-switch-case-fallthrough` handle break, throw, continue and return nested in block, if-else and switch (#2218)
- [bugfix] `no-switch-case-fallthrough` allow empty case clauses before default clause (#2218)
- [bugfix] `no-mergeable-namespace` ignore property types that can't be merged (#2105)
- [bugfix] `object-literal-key-quotes` no need to quote a float if its .toString() is the same. (#2144)
- [bugfix] `no-consecutive-blank-lines` Correctly apply fixes at EOF (#2239)
- [bugfix]: Fixes installation issue with node 7.5 (#2212)
- [bugfix]: `quotemark` now handles escaped chars (#2224)
- [enhancement] Don't exit when a rule requires type checking but type checking is not enabled (#2188)
- [enhancement] `no-switch-case-fallthrough` allow single line comment `// falls through` (#2218)
- [enhancement] `no-unbound-method` allows property access and binary expressions (#2143)

Thanks to our contributors!

- Andy Hanson
- Stefan Reichel
- Shlomi Assaf
- Josh Goldberg
- Minko Gechev
- Irfan Hudda
- Klaus Meinhardt
- Martin Probst
- Naoto Usuyama
- Caleb Eggensperger
- Arturs Vonda
- Joscha Feth
- Moritz
- Alexander Rusakov
- Alex Ryan
- Andy
- Yuichi Nukiyama

v4.4.2
---

* [bugfix] `whitespace` rule caused false positive on EOF (#2131)
* [bugfix] WebStorm fails because `json` formatter parameter has extra space (#2132)

v4.4.1
---

* [bugfix] errant space in recommended ruleset (couldn't find `no-misused-new`)

v4.4.0
---

* [new-rule] `arrow-return-shorthand` (#1972)
* [new-rule] `no-unbound-method` (#2089)
* [new-rule] `no-boolean-literal-compare` (#2013)
* [new-rule] `no-unsafe-any` (#2047)
* [new-rule] `no-unnecessary-qualifier` (#2008)
* [new-rule] `no-unnecessary-initializer` (#2106)
* [new-rule] `await-promise` (#2102)
* [new-rule] `no-floating-promises` (#1632)
* [new-rule] `strict-type-predicates` (#2046)
* [new-rule] `no-misused-new` (#1963)
* [new-rule] `prefer-method-signature` (#2028)
* [new-rule] `prefer-function-over-method` (#2037)
* [new-rule-option] `allow-fast-null-checks` added to `no-unused-expression` (#1638)
* [new-rule-option] `comment-format-rule` adds `ignore-words` and `ignore-pattern` options (#1757)
* [new-rule-option] `whitespace` adds `check-preblock` option (#2002)
* [new-rule-option] `strict-boolean-expressions` adds `allow-null-union`, `allow-undefined-union`, `allow-string`, and `allow-number` and  (#2033)
* [new-fixer] `align` (#2097)
* [new-fixer] `no-trailing-whitespace` (#2060)
* [bugfix] `no-magic-numbers` false positive on default parameter values (#2004)
* [bugfix] `no-empty-interface` allow empty interface with 2 or more parents (#2070)
* [bugfix] `no-trailing-whitespace` fixed for comments and EOF (#2060)
* [bugfix] `no-empty` no longer fails for private or protected constructor (#1976)
* [bugfix] `tslint:disable`/`tslint-enable` now handles multiple rules and fixes what code is enabled/disabled (#2061)
* [bugfix] `no-inferrable-types` now validates property declarations (#2081)
* [bugfix] `unified-signatures` false positive (#2016)
* [bugfix] `whitespace` finds all whitespace errors in JsxExpressions and TemplateExpressions (#2036)
* [bugfix] `comment-format` no more false positives in JsxText (#2036)
* [enhancement] `--test` option now accepts glob (#2079)

Thanks to our contributors!

* Alexander Rusakov
* Andrii Dieiev
* @andy-ms
* Andy Hanson
* Josh Goldberg
* Kei Son
* Klaus Meinhardt
* Krati Ahuja
* Martin Probst
* Mohsen Azimi
* Romke van der Meulen
* cameron-mcateer

v4.3.1
---

* [bugfix] Fix back-compat break. Allow formattersDirectory === null (#1997)

v4.3.0
---

* **Enabled additional rules in `tslint:latest` configuration** (#1981)
* [new-rule] `space-before-function-paren` (#1897)
* [new-rule] `typeof-compare` (#1927)
* [new-rule] `import-spacing` (#1935)
* [new-rule] `unified-signatures` (#1944)
* [new-fixer] `object-literal-key-quotes` (#1953)
* [new-fixer] `no-angle-bracket-type-assertion` (#1979)
* [bugfix] `adjacent-overload-signature` now handles static/computed function names (#1831)
* [bugfix] `file-header` now handles files with only comments (#1913)
* [bugfix] `no-consecutive-blank-lines` now allows blank lines in template strings (#1886)
* [bugfix] `object-literal-key-quotes` no longer throws exception when using rest operator (#1916)
* [bugfix] `restrict-plus-operands` no longer shows false positive in ternary operation (#1925)
* [bugfix] `prefer-for-of` now handles nested `for` loops with reused iterator (#1926)
* [bugfix] Exit gracefully when `tsconfig.json` passed as `--project` argument doens't have files (#1933)
* [bugfix] `object-literal-key-quotes` now handles shorthand and spread properties (#1945)
* [bugfix] `arrow-parens` Allow binding patterns `([x, y]) => ...` and `({x, y}) => ...` to have parens (#1958)
* [bugfix] `semicolon` fixer now handles comma separator in interfaces and indicates failure when commas are using in interfaces (#1856)
* [bugfix] `only-arrow-functions` option `allow-named-functions` now allows function declarations (#1961)
* [bugfix] `prefer-for-of` no longer shows false positive when array is in parentheses (#1986)
* [bugfix] `prefer-const` now works for TypeScript versions < 2.1.0 (#1989)
* [enhancement] `member-access` narrow location of error (#1964)

Thanks to our contributors!

* Andrii Dieiev
* @andy-ms
* Andy Hanson
* Josh Goldberg
* Klaus Meinhardt
* Linda_pp
* Mohsen Azimi
* Victor Grigoriu
* Yuichi Nukiyama
* cameron-mcateer

v4.2.0
---

* [new-rule] `no-string-throw` (#1878)
* [new-rule] `no-empty-interface` (#1889)
* [new-rule] `interface-over-type-literal` (#1890)
* [new-rule] `callable-types` (#1891)
* [new-rule] `no-void-expression` (#1903)
* [new-rule-option] `ban-single-arg-parens` added to `arrow-parens` (#1893)
* [bugfix] `prefer-const` handles destructuring arrays (#1894), destructuring objects (#1906), and forward references (#1908)
* [bugfix] Don't error for misplaced braces for 'else' in `one-line` rule (#1866)
* [bugfix] `no-shadowed-variable` now identifies shadowed `for` iterator (#1816)
* [bugfix] `object-literal-key-quotes` now includes function names (#1874)
* [bugfix] error when EOF comes after `disable-next-line` comment (#1902)

Thanks to our contributors!

* Andrew Scott
* @andy-ms
* Andy Hanson
* James Booth
* Klaus Meinhardt
* Vladimir Matveev

v4.1.1
---

* [bugfix] `typedef` rule was showing false positive for `catch` clause (#1887)

v4.1.0
---

* [new-rule] `prefer-const` (#1801)
* [new-rule] `strict-boolean-expressions` (#1820)
* [new-rule] `no-magic-numbers` (#1799)
* [new-rule] `import-blacklist` (#1841)
* [new-rule] `promise-functions-async` (#1779)
* [new-rule] `no-inferred-empty-object-type`: a type must be specified when using a generic class/function/etc (#1821)
* [new-rule-option] `allow-named-functions` added to `only-arrow-functions` (#1857)
* [new-fixer] `prefer-const` (#1801)
* [new-fixer] `quotemark` (#1790)
* [new-formatter] `code-frame` formatter shows you the error in context (#1819)
* [enhancement] `no-internal-module` failures highlight less text (#1781)
* [enhancement] Avoid auto-fixing errors that would result in compilation errors for rules that use type-check (#1608)
* [rule-change] `only-arrow-functions` will allow functions with a `this` parameter (#1597)
* [bugfix] `no-use-before-declare` false positive on named import (#1620)
* [bugfix] `prefer-for-of` was showing false positive when the element is assigned (#1813)
* [bugfix] The command line argument `type-check` was swallowing the next argument (#1783)
* [bugfix] `tslint:disable-line` was re-enabling `tslint:disable` (#1634)
* [bugfix] `adjacent-overload-signatures` did not work for constructors (#1800)
* [bugfix] `checkstyle` formatter was reporting errors under one file (#1811)
* [bugfix] `trailing-comma` was applied to parameter lists (#1775)
* [api] CLI logic moved into API friendly class (#1688)

Thanks to our contributors!

* Alex Eagle
* Andrii Dieiev
* Andy Hanson
* Art Chaidarun
* Donald Pipowitch
* Feisal Ahmad
* Josh Goldberg
* Klaus Meinhardt
* Maciej Sypień
* Mohsen Azimi
* Ryan Lester
* Simon Schick
* Subhash Sharma
* Timothy Slatcher
* Yaroslav Admin
* Yuichi Nukiyama
* tdsmithATabc
* @wmrowan

v4.0.2
---

* [enhancement] Don't exit when a rule can't be found. Print as a warning instead (#1771)
* [api-change] Allow 3rd party apps to see exception when the config is invalid (#1764)
* [bugfix] Don't flag a property named as empty string as not needing quotes in an object literal (#1762)
* [bugfix] Report correct number of fixes done by --fix (#1767)
* [bugfix] Fix false positives and exceptions in `prefer-for-of` (#1758)
* [bugfix] Fix `adjacent-overload-signatures` false positive when a static function has the same name (#1772)

Thanks to our contributors!
* @gustavderdrache

v4.0.1
---

* [bugfix] Removed `no-unused-variable` rule from recommended config, as it was causing spurious deprecation warnings.

v4.0.0-dev.2
---

* Include latest v4.0.0 changes

v4.0.0
---

* **BREAKING CHANGES**
    * [api-change] Minor changes to the library API. See this PR for changes and upgrade instructions (#1720)
    * [removed-rule] Removed `no-unreachable` rule; covered by compiler (#661)
    * [enhancement] Changed order of applied configuration files for the `extends` array to make it more intuitive. (#1503)
    * [enhancement] Changed TypeScript peer dependency to >= 2.0.0 (#1710)
* [new-rule] `completed-docs` rule added (#1644)
* [new-fixer] `ordered-imports` auto fixed (#1640)
* [new-fixer] `arrow-parens` auto fixed (#1731)
* [rule-change] `indent` rule now ignores template strings (#1611)
* [new-rule-option] `object-literal-key-quotes` adds the options `consistent` and `consistent-as-needed` (#1733)
* [enhancement] `--fix` option added to automatically fix selected rules (#1697)
* [enhancement] Updated recommend rules (#1717)
* [enhancement] `adjacent-overload-signatures` now works with classes, source files, modules, and namespaces (#1707)
* [enhancement] Users are notified if they are using an old TSLint version (#1696)
* [bugfix] Lint `.jsx` files if `jsRules` are configured (#1714)
* [bugfix] Command line glob patterns now handle single quotes (#1679)

Thanks to our contributors!
* Andrii Dieiev
* Andy
* Chris Barr
* Davie Schoots
* Jordan Hawker
* Josh Goldberg
* Stepan Riha
* Yuichi Nukiyama

v4.0.0-dev.1
---

* **BREAKING CHANGES**
    * [enhancement] The `semicolon` rule now disallows semicolons in multi-line bound class methods
         (to get the v3 behavior, use the `ignore-bound-class-methods` option) (#1643)
    * [removed-rule] Removed `use-strict` rule (#678)
    * [removed-rule] Removed `label-undefined` rule; covered by compiler (#1614)
    * [enhancement] Renamed `no-constructor-vars` to `no-parameter-properties` (#1296)
    * [rule-change] The `orderedImports` rule now sorts relative modules below non-relative modules (#1640)
* **Deprecated**
    * [deprecated] `no-unused-variable` rule. This is checked by the TypeScript v2 compiler using the flags [`--noUnusedParameters` and `--noUnusedLocals`](https://github.com/Microsoft/TypeScript/wiki/What%27s-new-in-TypeScript#flag-unused-declarations-with---nounusedparameters-and---nounusedlocals). (#1481)
* [enhancement] Lint .js files (#1515)
* [new-fixer] `no-var-keyword` replaces `var` with `let` (#1547)
* [new-fixer] `trailing-comma` auto fixed (#1546)
* [new-fixer] `no-unused-variable` auto fixed for imports (#1568)
* [new-fixer] `semicolon` auto fixed (#1423)
* [new-rule] `max-classes-per-file` rule added (#1666)
* [new-rule-option] `no-consecutive-blank-lines` rule now accepts a number value indicating max blank lines (#1650)
* [new-rule-option] `ordered-imports` rule option `import-sources-order` accepts value `any` (#1602)
* [bugfix] `no-empty` rule fixed when parameter has readonly modifier
* [bugfix] `no-namespace` rule: do not flag nested or .d.ts namespaces (#1571)

Thanks to our contributors!

* Alex Eagle
* Andrii Dieiev
* Ben Coveney
* Boris Aranovich
* Chris Barr
* Cyril Gandon
* Evgeniy Zhukovskiy
* Jay Anslow
* Kunal Marwaha
* Martin Probst
* Mingye Wang
* Raghav Katyal
* Sean Dawson
* Yuichi Nukiyama
* jakpaw

v4.0.0-dev.0
---

* **BREAKING CHANGES**
    * [enhancement] Drop support for configuration via package.json (#1579)
    * [removed-rule] Removed `no-duplicate-key` rule; covered by compiler (#1109)
    * [enhancement] Call formatter once for all file results. Format output may be different (#656)
    * [rule-change] `trailing-comma` supports function declarations, expressions, and types (#1486)
    * [rule-change] `object-literal-sort-keys` now sorts quoted keys (#1529)
    * [rule-change] `semicolon` now processes type aliases (#1475)
    * [rule-change] `no-var-keyword` now rejects `export var` statements (#1256)
    * [rule-change] `semicolon` now requires semicolon for function declaration with no body (#1447)
* [new-formatter] `fileslist` formatter writes a list of files with errors without position or error type specifics (#1558)
* [new-rule] `cyclomaticComplexity`, enforces a threshold of cyclomatic complexity.] (#1464)
* [new-rule] `prefer-for-of`, which errors when `for(var x of y)` can be used instead of `for(var i = 0; i < y.length; i++)` (#1335)
* [new-rule] `array-type`, which can require using either `T[]' or 'Array<T>' for arrays (#1498)
* [rule-change] `object-literal-sort-keys` checks multiline objects only (#1642)
* [rule-change] `ban` rule now can ban global functions (#327)
* [bugfix] always write lint result, even if using formatter (#1353)
* [bugfix] npm run test:bin fails on Windows (#1635)
* [bugfix] Don't enforce trailing spaces on newlines in typedef-whitespace rule (#1531)
* [bugfix] `jsdoc` rule should not match arbitrary comments (#1543)
* [bugfix] `one-line` rule errors when declaring wildcard ambient modules (#1425)

Thanks to our contributors!

* Alex Eagle
* Andrii Dieiev
* Andy Hanson
* Ben Coveney
* Boris Aranovich
* Chris Barr
* Christian Dreher
* Claas Augner
* Josh Goldberg
* Martin Probst
* Mike Deverell
* Nina Hartmann
* Satoshi Amemiya
* Scott Wu
* Steve Van Opstal
* Umar Bolatov
* Vladimir Matveev
* Yui

v3.15.1
---

* Enabled additional rules in `tslint:latest` configuration (#1506)

v3.15.0
---

* Stable release containing changes from the last dev release (v3.15.0-dev.0)

v3.15.0-dev.0
---

* [enhancement] Rules can automatically fix errors (#1423)
* [enhancement] Better error messages for invalid source files (#1480)
* [new-rule] `adjacent-overload-signatures` rule (#1426)
* [new-rule] `file-header` rule (#1441)
* [new-rule] `object-literal-shorthand` rule (#1488)
* [new-rule-option] `allow-declarations` option for `only-arrow-functions` rule (#1452)
* [new-rule-option] `import-sources-order` option for `ordered-imports` rule (#1466)
* [bugfix] `arrow-parens` rule handles async and generics (#1446, #1479)
* [bugfix] `comment-format` rule ignores tslint control comments (#1473)
* [bugfix] Fix `no-shadowed-variable` rule false positives (#1482)

Thanks to our contributors!
* @apacala
* @danvk
* @DovydasNavickas
* @glen-84
* @IllusionMH
* @JoshuaKGoldberg
* @markwongsk
* @rakatyal
* @rhysd
* @ScottSWu
* @YuichiNukiyama

v3.14.0
---

* Stable release containing changes from the last dev releases (v3.14.0-dev.0, v3.14.0-dev.1)

v3.14.0-dev.1
---

* [new-rule] `arrow-parens` rule (#777)
* [new-rule] `max-file-line-count` rule (#1360)
* [new-rule] `no-unsafe-finally` rule (#1349)
* [new-rule] `no-for-in-array` rule (#1380)
* [new-rule] `object-literal-key-quotes` rule (#1364)
* [enhancement] Better `ban` rule failure messages (#1385)
* [enhancement] New stylish formatter (#1406)

Thanks to our contributors!
* @chrismbarr
* @danvk
* @gjuchault
* @lowkay
* @ScottSWu
* @YuichiNukiyama

v3.14.0-dev.0
---

* [enhancement] Add optional type information to rules (#1323)

Thanks to our contributors!
* @ScottSWu

v3.13.0
---

* Stable release containing changes from the last dev release (v3.13.0-dev.0)

v3.13.0-dev.0
---

* [new-rule] `ordered-imports` rule (#1325)
* [enhancement] MPEG transport stream files are ignored by the CLI (#1357)

Thanks to our contributors!
* @chrismbarr
* @corydeppen
* @danvk
* @janaagaard75
* @mprobst

v3.12.0-dev.2
---

* [enhancement] Support TypeScript v2.0.0-dev builds

v3.12.1
---

* Stable release containing changes from the last dev release (v3.12.0-dev.1)

v3.12.0-dev.1
---

* [bugfix] Fix null reference bug in typedef rule (#1345)

v3.12.0
---

* Stable release containing changes from the last dev release (v3.12.0-dev.0)

v3.12.0-dev.0
---

* [new-rule] `only-arrow-functions` rule (#1318)
* [new-rule] `no-unused-new` rule (#1316)
* [new-rule-option] `arrow-call-signature` option for `typedef` rule (#1284)
* [enhancement] Metadata for every rule (#1311)
* [enhancement] `typedef` rule is more flexible about the location of typedefs for arrow functions (#1176)
* [enhancement] Failure messages are clearer and more consistent for many rules (#1303, #1307, #1309)
* [bugfix] `no-consecutive-blank-lines` now handles lines with only whitespace correctly (#1249)
* [bugfix] Correctly load `.json` config files that have a BOM (#1338)

Thanks to our contributors!
* @allannienhuis
* @arnaudvalle
* @bencoveney
* @chrismbarr
* @corydeppen
* @HamletDRC
* @JoshuaKGoldberg
* @timbrown81
* @tomduncalf
* @YuichiNukiyama

v3.11.0
---

* Stable release containing changes from the last dev release (v3.11.0-dev.0)

v3.11.0-dev.0
---

* [new-rule] `linebreak-style` rule (#123)
* [new-rule] `no-mergeable-namespace` rule (#843)
* [enhancement] Add built-in configurations (#1261)
* [enhancement] New vso formatter (#1281)
* [new-rule-option] `ignore-interfaces` option for `semicolon` rule (#1233)
* [bugfix] `no-default-export` rule handles more default export cases (#1241)

Thanks to our contributors!
* @cgwrench
* @HamletDRC
* @lijunle
* @paldepind
* @patsissons
* @schmuli
* @YuichiNukiyama

v3.10.2
---

* Stable release containing changes from the last dev release (v3.10.0-dev.2)

v3.10.0-dev.2
---

* [bugfix] `member-ordering` rule doesn't crash on methods in class expressions (#1252)
* [bugfix] `ban` rule handles chained methods appropriately (#1234)

Thanks to our contributors!
* @marines

v3.10.1
---

* Stable release containing changes from the last dev release (v3.10.0-dev.1)

v3.10.0-dev.1
---

* [bugfix] `member-ordering` rule doesn't crash on methods in object literals (#1243)

v3.10.0
---

* Stable release containing changes from the last dev release (v3.10.0-dev.0)

v3.10.0-dev.0
---

* [new-rule] `new-parens` rule (#1177)
* [new-rule] `no-default-export` rule (#1182)
* [new-rule-option] `order: ...` option for `member-ordering` rule (#1208)
* [new-rule-option] "ignore-for-loop" option for `one-variable-per-declaration` rule (#1204)
* [enhancement] "no-this-in-function-in-method" option renamed to "check-function-in-method" (#1203)
* [bugfix] `semicolon` rule checks export statements (#1155)

Thanks to our contributors!
* @chrismbarr
* @HamletDRC
* @larshp
* @patsissons
* @YuichiNukiyama

v3.9.0
---

* Stable release containing changes from the last dev release (v3.9.0-dev.0)

v3.9.0-dev.0
---

* [new-rule] `no-namespace` rule (#1133)
* [new-rule] `one-variable-per-declaration` rule (#525)
* [new-rule-option] "ignore-params" option for `no-inferrable-types` rule (#1190)
* [new-rule-option] "no-this-in-function-in-method" option for `no-invalid-this` rule (#1179)
* [enhancement] Single line enable/disable comments (#144)
* [enhancement] Resolve `extends` packages relative to location of configuration file (#1171)
* [enhancement] `Linter` class will throw an error if configuration is of an invalid type (#1167)
* [bugfix] `use-isnan` allows assaignments to `NaN` (#1054)
* [bugfix] `no-unreachable` handles allows hoisted type aliases (#564)
* [bugfix] `member-ordering` rule now checks constructors (#1158)
* [bugfix] `--test` CLI command works correctly with specifiying custom rules (#1195)

Thanks to our contributors!
* @abierbaum
* @HamletDRC
* @inthemill
* @janslow
* @JoshuaKGoldberg
* @mprobst
* @patsissions
* @YuichiNukiyama

v3.8.1
---

* Stable release containing changes from the last dev release (v3.8.0-dev.1)

v3.8.0-dev.1
---

* [bugfix] Allow JS directives at the start of constructors, getters, and setters (#1159)
* [bugfix] Remove accidentally included performance profiles from published NPM artifact (#1160)

v3.8.0
---

* Stable release containing changes from the last dev release (v3.8.0-dev.0)

v3.8.0-dev.0
---

* [new-rule] `no-invalid-this` rule (#1105)
* [new-rule] `use-isnan` rule (#1054)
* [new-rule] `no-reference` rule (#1139)
* [new-rule-option] "allow-pascal-case" option for `variable-name` rule (#1079)
* [enhancement] Comments now allowed in `tslint.json` files (#1129)
* [enhancement] Smarter `trailing-comma` behavior (#1122)
* [enhancement] `semicolon` rule more lenient with arrow-function class members (#1076)
* [enhancement] Allow enabling/disabling rules with `//` comments (#1134)
* [enhancement] New checkstyle formatter (#250)
* [enhancement] Clearer message for `no-var-keyword` rule (#1124)
* [bugfix] Loaded configurations are not cached (#1128)
* [bugfix] Allow JS directives at the start of class methods (#1144)

Thanks to our contributors!
* @AndyMoreland
* @chrismbarr
* @HamletDRC
* @JoshuaKGoldberg
* @sshev
* @unional

v3.7.4
---

* Stable release containing changes from the last dev release (v3.7.0-dev.5)

v3.7.0-dev.5
---

* [bugfix] Allow JS directives in namespaces (#1115)

v3.7.3
---

* Stable release containing changes from the last dev release (v3.7.0-dev.4)

v3.7.0-dev.4
---

* [bugfix] Downgrade `findup-sync` dependency (#1108)

v3.7.2
---

* Stable release containing changes from the last dev release (v3.7.0-dev.3)

v3.7.0-dev.3
---

* [bugfix] `findConfigurationPath` always returns an absolute path (#1093)
* [bugfix] Update `findup-sync` dependency (#1080)
* [bugfix] `declare global` no longer triggers `no-internal-module` rule (#1069)
* [bugfix] Valid JS directives no longer trigger `no-unused-expression` rule (#1050)

v3.7.1
---
* Stable release containing changes from the last dev release

v3.7.0-dev.2
---

* [bugfix] Improve handling of paths provided via the -c CLI option (#1083)

v3.7.0
---

* Stable release containing changes from the last dev release

v3.7.0-dev.1
---

* [enhancement] `extends` field for `tslint.json` files (#997)
* [enhancement] `--force` CLI option (#1059)
* [enhancement] Improve how `Linter` class handles configurations with a `rulesDirectory` field (#1035)
* [new-rule] `no-angle-bracket-type-assertion` rule (#639)
* [new-rule-option] "allow-undefined-check" option for `triple-equals` rule (#602)
* [new-rule-option] "always-prefix" and "never-prefix" option for `interface-name` rule (#512)

Thanks to our contributors!
* @Arnavion
* @chrismbarr
* @ChrisPearce
* @JoshuaKGoldberg
* @patsissonso
* @sasidhar
* @unional
* @vvakame

v3.6.0
---

* Stable release containing changes from the last dev release

v3.6.0-dev.1
---

* [enhancement] Add `--exclude` CLI option (#915)
* [bugfix] Fix `no-shadowed-variable` rule handling of standalone blocks (#1021)
* [deprecation] Configuration through `package.json` files (#1020)
* [API] Export additional configuration methods from top-level "tslint" module (#1009)

Thanks to our contributors!
* @blakeembrey
* @hamhut1066
* @meowtec

v3.5.0
---

* Stable release containing changes from the last dev release

v3.5.0-dev.1
---

* [new-rule-option] "ignore-pattern" option for `no-unused-variable` rule (#314)
* [bugfix] Fix occassional crash in `no-string-literal` rule (#906)
* [enhancement] Tweak behavior of `member-ordering` rule with regards to arrow function types in interfaces (#226)

Thanks to our contributors!
* @arusakov
* @Pajn

v3.4.0
---

* Stable release containing changes from the last two dev releases

v3.4.0-dev.2
---

* [new-rule-option] "arrow-parameter" option for `typedef` rule (#333)
* [new-rule-option] "never" option for `semicolon` rule (#363)
* [new-rule-option] "onespace" setting for `typedef-whitespace` rule (#888)
* [new-rule-option] `typedef-whitespace` rule can now check spacing on right side of typdef colon (#888)
* [enhancement] `member-ordering` rule treats arrow functions as methods (#226)
* [bugfix] Handle spaces before typedefs correctly in `typedef-whitespace` rule (#955)
* [bugfix] `label-position` rule now allows labels on `for-of` loops (#959)

Thanks to our contributors!
* @b0r3as
* @ChaseMoskal
* @Pajn
* @pe8ter
* @tomduncalf

v3.4.0-dev.1
---

* [enhancement] Revamped testing system (#620)
  * Writing tests for rules is now much simpler with a linter DSL.
    See exisitng tests in `test/rules/**/*.ts.lint` for examples.
* [enhancement] New msbuild formatter (#947)
* [bugfix] Fix handling of multiline literals in `trailing-comma` rule (#856)
* [bugfix] `one-line` rule correctly checks space between `catch` and opening brace (#925)
* [bugfix] `one-line` rule correctly checks multiline variable declarations (#935)
* [new-rule-option] New option `check-finally` for `one-line` rule (#925)
* __BREAKING CHANGES__
  * [bugfix] Report error when a rule in the config file is not found (#598)

Thanks to our contributors!
* @mmv
* @pe8ter

v3.3.0
---

* [bugfix] Tweak TSLint build so TSLint works with typescript@next (#926)

v3.3.0-dev.1
---

* [bugfix] Correctly handle more than one custom rules directory (#928)

v3.2.2
---

* Stable release containing changes from the last dev release

v3.2.2-dev.1
---

* [enhancement] Throw an error if a path to a directory of custom rules is invalid (#910)
* [new-rule-option] "jsx-single" and "jsx-double" options for `quotemark` rule (#673)
* [bugfix] Handle paths to directories of custom rules more accurately
* [bugfix] `no-unused-expression` rule handles `await` statements correctly (#887)

v3.2.1
---

* Stable release containing changes from the last dev release

v3.2.1-dev.1
---

* [enhancement] automatically generate a `tslint.json` file with new `--init` CLI command (#717)
* [bugfix] `no-var-keyword` rule detects the use of `var` in all types of `for` loops (#855)

v3.2.0
---

* Stable release containing changes from last two dev releases

v3.2.0-dev.2
---

* [bugfix] formatters are now exported correctly to work with TS 1.8 (#863)

v3.2.0-dev.1
---

* [bugfix] fixed bug in how custom rules directories are registered (#844)
* [enhancement] better support for globs in CLI (#827)
* [new-rule] `no-null-keyword` rule (#722)

v3.1.1
---

* Bump TypeScript peer dependency to `>= 1.7.3` due to `const enum` incompatibility (#832)

v3.1.0
---

* [bugfix] build with TS v1.7.3 to fix null pointer exception (#832)
* [bugfix] fixed false positive in `no-require-imports` rule (#816)

v3.1.0-dev.1
---

* [bugfix] fixed `no-shadowed-variable` false positives when handling destructuring in function params (#727)
* [enhancement] `rulesDirectory` in `tslint.json` now supports multiple file paths (#795)

v3.0.0
---

* [bugfix] `member-access` rule now handles object literals and get/set accessors properly (#801)
    * New rule options: `check-accessor` and `check-constructor`
* All the changes from the following releases, including some **breaking changes**:
    * `3.0.0-dev.3`
    * `3.0.0-dev.2`
    * `3.0.0-dev.1`
    * `2.6.0-dev.2`
    * `2.6.0-dev.1`

v3.0.0-dev.3
---

* TypeScript is now a peerDependency (#791)
* [bugfix] `no-unused-variable` rule with `react` option works with self-closing JSX tags (#776)
* [bugfix] `use-strict` bugfix (#544)

v3.0.0-dev.2
---

* [new-rule-option] "react" option for `no-unused-variable` rule (#698, #725)
* [bugfix] Fix how `Linter` is exported from "tslint" module (#760)
* [bugfix] `no-use-before-declare` rule doesn't crash on uncompilable code (#763)

v3.0.0-dev.1
---

* **BREAKING CHANGES**
    * Rearchitect TSLint to use external modules instead of merged namespaces (#726)
        * Dependencies need to be handled differently now by custom rules and formatters
        * See the [PR](https://github.com/palantir/tslint/pull/726) for full details about this change
    * `no-trailing-comma` rule removed, it is replaced by the `trailing-comma` rule (#687)
    * Rename `sort-object-literal-keys` rule to `object-literal-sort-keys` (#304, #537)
    * `Lint.abstract()` has been removed (#700)
* [new-rule] `trailing-comma` rule (#557, #687)
* [new-rule-option] "ban-keywords" option for `variable-name` rule (#735, #748)
* [bugfix] `typedef` rule now handles `for-of` loops correctly (#743)
* [bugfix] Handle tslint.json utf-8 files which have a BOM correctly (#90)

v2.6.0-dev.2
---

* Upgrade TypeScript compiler to `v1.7.0-dev.20151003`
* [bugfix] `no-unused-expression` rule now handles yield expressions properly (#706)

v2.6.0-dev.1
---

* Upgrade TypeScript compiler to `v1.7.0-dev.20150924`

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
