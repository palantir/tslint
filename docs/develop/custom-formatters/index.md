---
layout: page
title: Custom Formatters
permalink: /develop/custom-formatters/
---

Just like [custom rules][0], additional formatters can also be supplied to TSLint via `--formatters-dir` on the CLI or `formattersDirectory` option on the library or `grunt-tslint`. Writing a new formatter is simpler than writing a new rule, as shown in the JSON formatter's code.

```ts
import * as ts from "typescript";
import * as Lint from "tslint";

export class Formatter extends Lint.Formatters.AbstractFormatter {
    public format(failures: Lint.RuleFailure[]): string {
        var failuresJSON = failures.map((failure: Lint.RuleFailure) => failure.toJson());
        return JSON.stringify(failuresJSON);
    }
}
```

Such custom formatters can also be written in Javascript. Additionally, formatter files are always named with the suffix `Formatter`, and referenced from TSLint without its suffix.

[0]: {{site.baseurl | append: "/develop/custom-rules"}}