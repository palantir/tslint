---
layout: page
title: Contributing to TSLint
permalink: /develop/contributing/
---

To develop TSLint, clone the repository and install its dependencies:

```bash
git clone git@github.com:palantir/tslint.git --config core.autocrlf=input --config core.eol=lf
yarn
yarn compile
yarn test
```

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
- Debug Document Generation: Debug the `scripts/buildDocs.ts` script.
