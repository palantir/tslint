---
layout: page
title: Development
permalink: /develop/
menu: main
order: 3
---
TSLint is extensible - users can write their own rules and formatters:

Writing Custom Rules
------------
TSLint ships with a set of core rules that can be configured. However, users are also allowed to write their own rules, which allows them to enforce specific behavior not covered by the core of TSLint. TSLint's internal rules are itself written to be pluggable, so adding a new rule is as simple as creating a new rule file named by convention. New rules can be written in either TypeScript or Javascript; if written in TypeScript, the code must be compiled to Javascript before invoking TSLint.

Rule names are always camel-cased and *must* contain the suffix `Rule`. Let us take the example of how to write a new rule to forbid all import statements (you know, *for science*). Let us name the rule file `noImportsRule.ts`. Rules can be referenced in `tslint.json` in their kebab-case forms, so `"no-imports": true` would turn on the rule.

Now, let us first write the rule in TypeScript. A few things to note:
- We import `tslint/lib/lint` to get the whole `Lint` namespace instead of just the `Linter` class.
- The exported class must always be named `Rule` and extend from `Lint.Rules.AbstractRule`.

```ts
import * as ts from "typescript";
import * as Lint from "tslint/lib/lint";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "import statement forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
    }
}

// The walker takes care of all the work.
class NoImportsWalker extends Lint.RuleWalker {
    public visitImportDeclaration(node: ts.ImportDeclaration) {
        // create a failure at the current position
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));

        // call the base version of this visitor to actually parse this node
        super.visitImportDeclaration(node);
    }
}
```

Given a walker, TypeScript's parser visits the AST using the visitor pattern. So the rule walkers only need to override the appropriate visitor methods to enforce its checks. For reference, the base walker can be found in [syntaxWalker.ts](https://github.com/palantir/tslint/blob/master/src/language/walker/syntaxWalker.ts).

We still need to hook up this new rule to TSLint. First make sure to compile `noImportsRule.ts`:

```bash
tsc -m commonjs --noImplicitAny noImportsRule.ts node_modules/tslint/lib/tslint.d.ts
```

Then, if using the CLI, provide the directory that contains this rule as an option to `--rules-dir`. If using TSLint as a library or via `grunt-tslint`, the `options` hash must contain `"rulesDirectory": "..."`. If you run the linter, you'll see that we have now successfully banned all import statements via TSLint!

Final notes:

- Core rules cannot be overwritten with a custom implementation.
- Custom rules can also take in options just like core rules (retrieved via `this.getOptions()`).

Writing Custom Formatters
-----------------
Just like rules, additional formatters can also be supplied to TSLint via `--formatters-dir` on the CLI or `formattersDirectory` option on the library or `grunt-tslint`. Writing a new formatter is simpler than writing a new rule, as shown in the JSON formatter's code.

```ts
import * as ts from "typescript";
import * as Lint from "tslint/lib/lint";

export class Formatter extends Lint.Formatters.AbstractFormatter {
    public format(failures: Lint.RuleFailure[]): string {
        var failuresJSON = failures.map((failure: Lint.RuleFailure) => failure.toJson());
        return JSON.stringify(failuresJSON);
    }
}
```

Such custom formatters can also be written in Javascript. Additionally, formatter files are always named with the suffix `Formatter`, and referenced from TSLint without its suffix.

Contributing
-----------

To develop TSLint simply clone the repository, install dependencies and run grunt:

```bash
git clone git@github.com:palantir/tslint.git
npm install
grunt
```

#### `next` branch

The [`next` branch of the TSLint repo](https://github.com/palantir/tslint/tree/next) tracks the latest TypeScript
compiler as a `devDependency`. This allows you to develop the linter and its rules against the latest features of the
language. Releases from this branch are published to npm with the `next` dist-tag, so you can get the latest dev
version of TSLint via `npm install tslint@next`.

Creating a new Release
----------------------

1. Bump up the version number in `package.json` and `tslint.ts`
2. Add a section for the new release in `CHANGELOG.md`
3. Run `grunt` to build the latest sources
4. Commit
5. Run `npm publish`
6. Create a git tag for the new release and push it