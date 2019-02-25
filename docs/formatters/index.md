---
layout: page
title: TSLint core formatters
permalink: /formatters/
menu: main
order: 2
---

Lint _formatters_ allow for transformation of lint results into various forms before outputting to stdout or a file.

Formatters are split into two categories: _human-readable and machine-readable_. Please note that for machine-readable
formatters all positioning is zero-indexed (Lines start with zero), where as human-readable is not (Lines start with one).

### Built-in formatters

{% assign formatters = site.data.formatters | sort: "name" %}
{% for formatter in formatters %}
* [{{formatter.formatterName}}]({{formatter.formatterName}}) - {{formatter.description | markdownify | remove:"<p>" | remove: "</p>"}} ({{formatter.consumer}}-readable)
{% endfor %}