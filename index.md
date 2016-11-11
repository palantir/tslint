---
title: TSLint
layout: default
subtitle: An extensible linter for the TypeScript language.
---
TSLint checks your [TypeScript][0] code for readability, maintainability, and functionality errors.

## Getting Started

#### Local installation

```sh
$ npm install tslint typescript --save-dev
```

#### Global installation

```sh
$ npm install tslint typescript -g
```

#### Configuration

Generate a skeleton `tslint.json` config file with the `--init` CLI flag:

```sh
cd path/to/project
tslint --init
```

Lint your TypeScript files!

```
// provide globs as strings
tslint -c path/to/tslint.json 'path/to/project/**/*.ts'
```

Check out [the full usage guide][1] to learn more...

[0]: http://www.typescriptlang.org/
[1]: usage/cli
