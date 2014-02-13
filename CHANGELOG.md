Change Log
===

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

* [new rule] `no-unused-variable`
* [new rule] `no-trailing-comma`
* [new rule] `no-use-before-declare`
* [feature] support `--version` in CLI
* [feature] expose rule names to custom formatters
* [feature] add `verbose` formatter
* [bug] `no-empty` allows constructors with member declaration parameters
* [bug] CLI supports `--help`
* [bug] `max-line-length` allows CRLF endings
