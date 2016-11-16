---
layout: page
title: Contributing
permalink: /develop/contributing/
---

To develop TSLint simply clone the repository and install dependencies:

```bash
git clone git@github.com:palantir/tslint.git --config core.autocrlf=input --config core.eol=lf
npm install
npm run compile
npm run test
```

#### `next` branch

The [`next` branch of the TSLint repo](https://github.com/palantir/tslint/tree/next) tracks the latest TypeScript
compiler as a `devDependency`. This allows you to develop the linter and its rules against the latest features of the
language. Releases from this branch are published to npm with the `next` dist-tag, so you can get the latest dev
version of TSLint via `npm install tslint@next`.
