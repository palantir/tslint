---
layout: page
title: TSLint core rules
permalink: /rules/
menu: main
order: 2
---

Lint rules encode logic for syntactic & semantic checks of TypeScript source code.

### TypeScript-specific

These rules find errors related to TypeScript language features.

{% include rule_list.html ruleType="typescript" %}

### Functionality

These rules catch common errors in JS programming or otherwise confusing constructs that are prone to producing bugs.

{% include rule_list.html ruleType="functionality" %}

### Maintainability

These rules make code maintenance easier.

{% include rule_list.html ruleType="maintainability" %}

### Style

These rules enforce various stylistic conventions which do not affect code functionality.

{% include rule_list.html ruleType="style" %}

### Formatting

These rules enforce consistent code formatting, mostly dealing with whitespace and punctuation. Note that support for this category of rules is deprioritized in TSLint and we recommend using a tool like [Prettier](https://prettier.io) instead ([see this issue thread for more information](https://github.com/palantir/tslint/issues/3592)).

{% include rule_list.html ruleType="formatting" %}
