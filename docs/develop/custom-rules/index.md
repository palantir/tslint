---
title: Developing TSLint rules
layout: page
permalink: "/develop/custom-rules/"
---

TSLint ships with a set of core rules that can be configured. However, users are also allowed to write their own rules, which allows them to enforce specific behavior not covered by the core of TSLint. TSLint's internal rules are itself written to be pluggable, so adding a new rule is as simple as creating a new rule file named by convention. New rules can be written in either TypeScript or JavaScript; if written in TypeScript, the code must be compiled to JavaScript before invoking TSLint.

Let us take the example of how to write a new rule to forbid all import statements (you know, *for science*). Let us name the rule file `noImportsRule.ts`. Rules are referenced in `tslint.json` with their kebab-cased identifer, so `"no-imports": true` would configure the rule.

__Important conventions__:

- Rule identifiers are always kebab-cased.
- Rule files are always camel-cased (`camelCasedRule.ts`).
- Rule files *must* contain the suffix `Rule`.
- The exported class must always be named `Rule` and extend from `Lint.Rules.AbstractRule`.

Now, let us first write the rule in TypeScript:

```typescript
import * as Lint from "tslint";
import * as ts from "typescript";

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

Given a walker, TypeScript's parser visits the AST using the visitor pattern. So the rule walkers only need to override the appropriate visitor methods to enforce its checks. For reference, the base walker can be found in [syntaxWalker.ts](https://github.com/palantir/tslint/blob/master/src/language/walker/syntaxWalker.ts). To see what your Typescript file or snippet looks like as an AST, visit [astexplorer.net](http://astexplorer.net/) (__note__: current version of TypeScript may not be supported, yet).

We still need to hook up this new rule to TSLint. First make sure to compile `noImportsRule.ts`:

```sh
tsc noImportsRule.ts
```

Then, if using the CLI, provide the directory that contains this rule as an option to `--rules-dir`. If using TSLint as a library or via `grunt-tslint`, the `options` hash must contain `"rulesDirectory": "..."`. If you run the linter, you'll see that we have now successfully banned all import statements via TSLint!

Finally, add a line to your [`tslint.json` config file][0] for each of your custom rules.

---

Now that you're written a rule to detect problems, let's modify it to *fix* them.

Instantiate a `Fix` object and pass it in as an argument to `addFailure`. This snippet replaces the offending import statement with an empty string:

```typescript
// create a fixer for this failure
const fix = new Lint.Replacement(node.getStart(), node.getWidth(), "");

// create a failure at the current position
this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING, fix));
```
---
Final notes:

- Core rules cannot be overwritten with a custom implementation.
- Custom rules can also take in options just like core rules (retrieved via `this.getOptions()`).
- As of TSLint v5.7.0 you no longer need to compile your custom rules before using them. You need to tell node.js how to load `.ts` files for example by using `ts-node`:

```sh
ts-node node_modules/.bin/tslint <your options>
# or
node -r ts-node/register node_modules/.bin/tslint <your options>
# or
NODE_OPTIONS="-r ts-node/register" tslint <your options>
```

[0]: {{site.baseurl | append: "/usage/configuration/"}}
