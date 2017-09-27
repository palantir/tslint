---
title: Type Checking
layout: page
permalink: /usage/type-checking/
---

#### Semantic lint rules

Some TSLint rules go further than linting code syntax. Semantic rules use the compiler's program APIs to inspect static types and validate code patterns.

##### CLI

When using the CLI, use the `--project` flag and specify your `tsconfig.json` to enable rules that work with the type checker. TSLint will lint all files included in your project as specified in `tsconfig.json`.

```sh
tslint --project tsconfig.json --config tslint.json # lints every file in your project
tslint -p . -c tslint.json # shorthand of the command above
tslint -p tsconfig.json --exclude '**/*.d.ts' # lint all files in the project excluding declaration files
tslint -p tsconfig.json **/*.ts # ignores files in tsconfig.json and uses the provided glob instead
```

Use the `--type-check` flag to make sure your program has no type errors. TSLint will check for any errors before linting. This flag requires `--project` to be specified.

##### Library

To enable rules that work with the type checker, a TypeScript program object must be passed to the linter when using the programmatic API. Helper functions are provided to create a program from a `tsconfig.json` file. A project directory can be specified if project files do not lie in the same directory as the `tsconfig.json` file.

```js
import { Linter, Configuration } from "tslint";

const configurationFilename = "Specify configuration file name";
const options = {
    fix: false,
    formatter: "json",
    rulesDirectory: "customRules/",
    formattersDirectory: "customFormatters/"
};

const program = Linter.createProgram("tsconfig.json", "projectDir/");
const linter = new Linter(options, program);

const files = Linter.getFileNames(program);
files.forEach(file => {
    const fileContents = program.getSourceFile(file).getFullText();
    const configuration = Configuration.findConfiguration(configurationFilename, file).results;
    linter.lint(file, fileContents, configuration);
});

const results = linter.getResult();
```
