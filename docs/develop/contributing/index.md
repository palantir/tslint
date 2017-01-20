---
layout: page
title: Contributing
permalink: /develop/contributing/
---

To develop TSLint simply clone the repository and install dependencies:

```bash
git clone git@github.com:palantir/tslint.git --config core.autocrlf=input --config core.eol=lf
yarn install
yarn compile
yarn test
```

From there you can use `npm run test:watch` and `npm run test:rules -- my-rule-name` to try out changes to a rule.

#### `next` branch

The [`next` branch of the TSLint repo](https://github.com/palantir/tslint/tree/next) tracks the latest TypeScript
compiler as a `devDependency`. This allows you to develop the linter and its rules against the latest features of the
language. Releases from this branch are published to NPM with the `next` dist-tag, so you can get the latest dev
version of TSLint via `npm install tslint@next`.

#### Running a specific test

You can test a specific test by using the `--test` command line parameter followed by your test directory. For example:
```
// global tslint
// point to a dir that has tslint.json and .lint files
tslint --test test/rules/semicolon/always

// locally built tslint
./bin/tslint --test test/rules/semicolon/always
```

#### Debugging in Visual Studio Code

Configuration files to work with Visual Studio Code are included when you check out the source code. These files live in the `.vscode` directory. To run TSLint in the debugger, switch to Debug view and use the dropdown at the top of the Debug pane to select the launch configuration (specified in `.vscode/launch.json`). Press `F5` to debug. You should be able to set breakpoints and debug as usual.

The current debug configurations are:

- Debug CLI: Used to debug TSLint using command line arguments. Modify the `args` array in `.vscode/launch.json` to add arguments.
- Debug Mocha Tests: Runs non-rule tests
- Debug Rule Tests: Runs rule tests (under `test/rules`)
- Deubg Document Generation: Debug the `scripts/buildDocs.ts` script.
