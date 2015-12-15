---
layout: page
title: Custom Rules
permalink: /usage/custom-rules/
---

If we don't have all the rules you're looking for,
you can either [write your own custom rules][0] or use custom rules that others have developed.

Then, when [using the CLI][1], point it to a directory with your compiled custom rules like the following:

```
tslint --rules-dir path/to/directory-with-rules/ file/to/lint.ts
```

You can do similarly when [using the library version][2] by specifying a `rulesDirectory` field of your `options` object. 

Finally, you can specify the path to your custom rules inside of your [`tslint.json` file][3].

#### Custom Rules from the TypeScript Community ####

 The repos below are good sources of community-created TSLint rules:

- [ESLint rules for TSLint](https://github.com/buzinas/tslint-eslint-rules) - Improve your TSLint with the missing ESLint Rules
- [tslint-microsoft-contrib](https://github.com/Microsoft/tslint-microsoft-contrib) - A set of TSLint rules used on some Microsoft projects

[0]: {{site.baseurl | append: "/develop/custom-rules/"}}
[1]: {{site.baseurl | append: "/usage/cli/"}}
[2]: {{site.baseurl | append: "/usage/library/"}}
[2]: {{site.baseurl | append: "/usage/tslint-json/"}}
