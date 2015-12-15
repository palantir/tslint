---
layout: default
title: TSLint
subtitle: A Linter for the TypeScript language.
---

TSLint checks your [TypeScript][0] code for readability, maintainability, and functionality errors.

Getting Started:
------------

Install globally with npm:

```
npm install typescript -g
npm install tslint -g
```

Switch to the root of your TypeScript project and generate a starting `tslint.json`config file:

```
cd path/to/my/project
tslint --init
```

Lint your TypeScript files!

```
tslint -c path/to/tslint.json path/to/typescript/file.ts
```

Check out [the full usage guide][1] to learn more.
[0]: http://www.typescriptlang.org/
[1]: usage/cli
