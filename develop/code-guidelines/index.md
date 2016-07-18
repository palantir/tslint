---
layout: page
title: Code Guidelines
permalink: /develop/code-guidelines/
---

### Rules

##### Does the rule belong in TSLint?

- The rule should enforce something applicable to TS in general and not something only applicable to a third-party library.
- The rule should enforce something applicable to most TS developers.
- Does the rule, in any possible configuration, conflict with any other rules? This should be avoided as much as possible.

##### Code-review checklist for new rules

- Is the name of the rule clear? Does it satisfy the naming guidelines? (TODO: document these naming guidelines)
- Does the name of the rule allow for possible future ways it might be changed/improved?
- Does the camelCase file name for the rule match match with the kebab-case name of the rule specified in the rule's metadata,
in the config files for the rule's tests, and directory name whcih contains the tests?
- Does the rule have appropriate, thorough tests?
- Should the rule be added to the `tslint:latest` configuration?
- Are the names of the rule's options clear and consistent?
- Does the rule have a good failure message? (TODO: elaborate on what this means)

### Formatters

### General Code Style

- Newlines should be at the end of all files
