---
title: Designing rule walkers
layout: page
permalink: "/develop/custom-rules/walker-design"
---

## Using WalkContext and applyWithFunction

If you have a rule with a pretty simple implementation, you don't need to declare a class which extends the `Walker` class. Instead, you can define a callback function that accepts following argument:

- `ctx: WalkContext<T>`: An object containing rule information, an object `options: T` containing the parsed rule arguments, the `ts.sourceFile` object, and functions for adding failures

Use this callback as an argument to `applyWithFunction`. You can also pass your parsed rule arguments as optional 3rd parameter.

Let's look at `no-null-keyword` as an example:

```ts
import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "Use 'undefined' instead of 'null'";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        // Call `applyWithFunction` with your callback function, `walk`.
        // This creates a `WalkContext<T>` and passes it in as an argument.
        // An optional 3rd parameter allows you to pass in a parsed version of `this.ruleArguments`. If used, it is not recommended to
        //     simply pass in `this.getOptions()`, but to parse it into a more useful object instead.
        return this.applyWithFunction(sourceFile, walk);
    }
}

// Here, the options object type is `void` (which is the default, so can be omitted) because we don't pass any options in this example.
function walk(ctx: Lint.WalkContext<void>) {
    // Recursively walk the AST starting with root node, `ctx.sourceFile`.
    // Call the function `cb` (defined below) for each child.
    return ts.forEachChild(ctx.sourceFile, cb);

    function cb(node: ts.Node): void {
        // Stop recursing further into the AST by returning early. Here, we ignore type nodes.
        if (node.kind >= ts.SyntaxKind.FirstTypeNode && node.kind <= ts.SyntaxKind.LastTypeNode) {
            return;
        }

        // Add failures using the `WalkContext<T>` object. Here, we add a failure if we find the null keyword.
        if (node.kind === ts.SyntaxKind.NullKeyword) {
            return ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }

        // Continue recursion into the AST by calling function `cb` for every child of the current node.
        return ts.forEachChild(node, cb);
    }
}
```

## Using AbstractWalker

If your rule implementation is a bit more involved than the above example, you can also implement it as a class.
Simply extend `AbstractWalker<T>` and implement the `walk` method.

```ts
import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "'magic numbers' are not allowed";

    public static ALLOWED_NODES = new Set<ts.SyntaxKind>([
        ...
    ]);

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        // We convert the `ruleArguments` into a useful format before passing it to the constructor of AbstractWalker.
        return this.applyWithWalker(new NoMagicNumbersWalker(sourceFile, this.ruleName, new Set(this.ruleArguments.map(String))));
    }
}

// The type parameter of AbstractWalker corresponds to the third constructor parameter.
class NoMagicNumbersWalker extends Lint.AbstractWalker<Set<string>> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            // Finds specific node types and do checking.
            if (node.kind === ts.SyntaxKind.NumericLiteral) {
                this.checkNumericLiteral(node, (node as ts.NumericLiteral).text);
            } else if (node.kind === ts.SyntaxKind.PrefixUnaryExpression &&
                       (node as ts.PrefixUnaryExpression).operator === ts.SyntaxKind.MinusToken) {
                this.checkNumericLiteral(node, "-" + ((node as ts.PrefixUnaryExpression).operand as ts.NumericLiteral).text);
            } else {
                // Continue rescursion: call function `cb` for all children of the current node.
                return ts.forEachChild(node, cb);
            }
        };

        // Start recursion for all children of `sourceFile`.
        return ts.forEachChild(sourceFile, cb);
    }

    private checkNumericLiteral(node: ts.Node, num: string) {
        // `this.options` is the third constructor parameter from above (the Set we created in `Rule.apply`)
        if (!Rule.ALLOWED_NODES.has(node.parent!.kind) && !this.options.has(num)) {
            // Add failures to the Walker.
            this.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
    }
}
```

## Migrating from RuleWalker to AbstractWalker

The main difference between `RuleWalker` and `AbstractWalker` is that you need to implement the AST recursion yourself. But why would you want to do that?
__Performance!__ `RuleWalker` wants to be "one walker to rule them all" (pun intended). It's easy to use but that convenience
makes it slow by default. When implementing the walking yourself, you only need to do as much work as needed.

Besides that you *should* convert the `ruleArguments` to a useful format before passing it to `AbstractWalker` as seen above.

This table describes the equivalent methods between the two classes:

`RuleWalker` | `AbstractWalker`
------------ | --------------
`this.createFailure()` and `this.addFailure()` | `this.addFailureAt()`
`this.addFailureFromStartToEnd()` | `this.addFailure()`
`this.createReplacement()` | `new Lint.Replacement()`
`this.deleteText()` | `Lint.Replacement.deleteText()`
`this.deleteFromTo()` | `Lint.Replacement.deleteFromTo()`
`this.appendText()` | `Lint.Replacement.appendText()`
`this.hasOption()` and `this.getOptions()` | use `this.options` directly
`this.getLineAndCharacterOfPosition()` | `ts.getLineAndCharacterOfPosition(this.sourceFile, ...)`
`this.getLimit()` | `this.sourceFile.end`
`this.getSourceFile()` | is available to be compatible, but prefer `this.sourceFile`
`this.getFailures()` | is available to be compatible, but prefer `this.failures`
`this.skip()` | just don't use it, it's a noop
`this.getRuleName()` | `this.ruleName`
