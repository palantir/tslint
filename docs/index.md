---
title: TSLint
layout: default
subtitle: An extensible linter for the TypeScript language.
---

TSLint is an extensible static analysis tool that checks [TypeScript][0] code for readability, maintainability, and functionality errors. It is widely supported across modern editors & build systems and can be customized with your own lint rules, configurations, and formatters.

## Quick start

```sh
# Install the global CLI and its peer dependency
yarn global add tslint typescript

# Navigate to your sources folder
cd path/to/project

# Generate a basic configuration file
tslint --init

# Lint TypeScript source globs
tslint -c tslint.json 'src/**/*.ts'
```

Check out [the full usage guide][1] to learn more.

[0]: http://www.typescriptlang.org/
[1]: usage/cli
