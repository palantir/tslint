---
title: Type Checking
layout: page
permalink: /usage/type-checking/
---

#### Type Checking

Some TSLint rules go further than linting code syntax. Semantic rules use the compiler's program APIs to inspect static types and validate code patterns.

To enable rules that work with the type checker, a TypeScript program object must be passed to the linter when using the programmatic API. Helper functions are provided to create a program from a `tsconfig.json` file. A project directory can be specified if project files do not lie in the same directory as the `tsconfig.json` file.

```js
const program = Linter.createProgram("tsconfig.json", "projectDir/");
const files = Linter.getFileNames(program);
const results = files.map(file => {
    const fileContents = program.getSourceFile(file).getFullText();
    const linter = new Linter(file, fileContents, options, program);
    return linter.lint();
});
```

When using the CLI, the `--project` flag will automatically create a program from the specified `tsconfig.json` file. Adding the `--type-check` flag then enables rules that require the type checker.
