## Using `WalkContext<T>` and `Rule#applyWithFunction`
If you have a rule with a pretty simple implementation, you don't need to declare a class which extends a Walker class.
Let's look at `no-null-keyword` as an example:
```ts
import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "Use 'undefined' instead of 'null'";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        // applyWithFunction creates a WalkContext and passes it to `walk`
        // we could pass options as 3rd parameter if needed, but please don't just call this.getOptions() and pass that.
        // `options` should be an object containing a "parsed" version of `this.ruleArguments`
        return this.applyWithFunction(sourceFile, walk);
    }
}

// the type parameter of `WalkContext` is the type of `options`. Here it is `void` because we don't pass any options in the example
function walk(ctx: Lint.WalkContext<void>) {
    // `ctx.sourceFile` is the top of the AST
    // start recursing into the AST, call function `cb` for every child of SourceFile
    return ts.forEachChild(ctx.sourceFile, cb);
    function cb(node: ts.Node): void {
        // don't recurse into type nodes
        if (node.kind >= ts.SyntaxKind.FirstTypeNode && node.kind <= ts.SyntaxKind.LastTypeNode) {
            return; // skip type nodes
        }
        // we are searching for the null keyword
        if (node.kind === ts.SyntaxKind.NullKeyword) {
            // if we found one, we add a failure to the WalkContext
            return ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        // recurse deeper in the AST, call function `cb` for every child of the current node
        return ts.forEachChild(node, cb);
    }
}
```

## Using `AbstractWalker<T>`
If your rule implementation is a bit more involved than the above example, you can also implement it as a class.
Simply extend `AbstractWalker` and implement the `walk` method.

```ts
import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "'magic numbers' are not allowed";

    public static ALLOWED_NODES = new Set<ts.SyntaxKind>([
        ...
    ]);

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        // We convert the `ruleArguments` into a useful format before passing it to the constructor of AbstractWalker
        return this.applyWithWalker(new NoMagicNumbersWalker(sourceFile, this.ruleName, new Set(this.ruleArguments.map(String))));
    }
}

// the type parameter of AbstractWalker corresponds to the third constructor parameter
class NoMagicNumbersWalker extends Lint.AbstractWalker<Set<string>> {
    // you need to implement this abstract method
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            // we are searching for numbers
            if (node.kind === ts.SyntaxKind.NumericLiteral) {
                // the main benefit of AbstractWalker over WalkContext: methods instead of closures
                this.checkNumericLiteral(node, (node as ts.NumericLiteral).text);
            } else if (node.kind === ts.SyntaxKind.PrefixUnaryExpression &&
                       (node as ts.PrefixUnaryExpression).operator === ts.SyntaxKind.MinusToken) {
                this.checkNumericLiteral(node, "-" + ((node as ts.PrefixUnaryExpression).operand as ts.NumericLiteral).text);
            } else {
                // recurse deeper, call function `cb` for all children of the current node
                return ts.forEachChild(node, cb);
            }
        };
        // start recursion for all children of `sourceFile`
        return ts.forEachChild(sourceFile, cb);
    }

    private checkNumericLiteral(node: ts.Node, num: string) {
        // `this.options` is the third constructor parameter from above (the Set we created in Rule.apply)
        if (!Rule.ALLOWED_NODES.has(node.parent!.kind) && !this.options.has(num)) {
            // add failures to the Walker
            this.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
    }
}
```

## Migrating from `RuleWalker` to `AbstractWalker`
The main difference is, that you need to implement the AST recursion yourself. But why would you want to do that?
__Performance!__ `RuleWalker` wants to be "one walker to rule them all" (pun intended). It's easy to use but that convenience 
makes it slow by default. When implementing the walking yourself, you only need to do as much work as needed.

Besides that you *should* convert the `ruleArguments` to a useful format before passing it to `AbstractWalker` as seen above.

There are also some differences in the methods provided. Let's say we did some garbage collection while porting methods of `RuleWalker` to `AbstractWalker`.

`RuleWalker` | `AbstractRule` | alternative
- | - | -
`createFailure()` and `addFailure()` | use `addFailureAt()` to add a failure with start and width |
`addFailureFromStartToEnd()` | `addFailure()` |
`createReplacement()` | - | `new Lint.Replacement()`
`deleteText()` | - | `Lint.Replacement.deleteText()`
`deleteFromTo()` | - | `Lint.Replacement.deleteFromTo()`
`appendText()` | - | `Lint.Replacement.appendText()`
`hasOption()` and `getOptions()` | use `this.options` directly |
`getLineAndCharacterOfPosition()` | - | `ts.getLineAndCharacterOfPosition(this.sourceFile, ...)`
`getLimit()` | if you really need it: `this.sourceFile.end` |
`getSourceFile()` | is available to be compatible, but prefer `this.sourceFile` |
`getFailures()` | is available to be compatible, but prefer `this.failures` |
`skip()` | - | just don't use it, it's a noop
`getRuleName()` | `this.ruleName` |


