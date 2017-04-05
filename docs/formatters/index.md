---
layout: page
title: TSLint core formatters
permalink: /formatters/
menu: main
order: 2
---

Lint _formatters_ allow for transformation of lint results into various forms before outputting to stdout or a file.

### Built-in formatters

{% assign formatters = site.data.formatters | sort: "name" %}
{% for formatter in formatters %}
* [{{formatter.formatterName}}]({{formatter.formatterName}}) - {{formatter.description | markdownify | remove:"<p>" | remove: "</p>"}}
{% endfor %}