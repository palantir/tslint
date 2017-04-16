---
title: TSLint performance tips
layout: page
permalink: "/develop/custom-rules/performance-tips"
---

As TSLint has matured, we have developed some best practices for making rules run faster. TSLint 5.0 was a particularly
significant release that featured many performance enhancements using the below tips (some codebases experienced lint times
cut in half).

### Use the TypeChecker only when needed

The TypeChecker is a really mighty tool, but that comes with a cost. To create a TypeChecker the Program first has to locate, read, parse and bind all SourceFiles referenced.
To avoid that cost, try to avoid the TypeChecker where possible.

If you are interested in the JSDoc of a function for example, you *could* ask the TypeChecker.
But there's another way: call `.getChildren()` on the FunctionDeclaration and search for nodes of kind `ts.SyntaxKind.JSDocComment`.
Those nodes will precede other nodes in the array.

### Avoid walking the AST if possible

Some rules work directly on the content of the source file.

For example, `max-file-line-count` and `linebreak-style` don't need to walk the AST at all.

Other rules define exceptions: `no-consecutive-blank-lines` ignores template strings.
To optimize for the best case, this rule can first look for failures in the source.
If and only if there are any failures, walk the AST to find the location of all template strings to filter the failures.

### Implement your own walking algorithm

Convenience comes with a price. When using `SyntaxWalker` or any subclass thereof like `RuleWalker` you pay the price for the
big switch statement in `visitNode` which then calls the appropriate `visitXXX` method for **every** node in the AST, even if you don't use them.

Use `AbstractWalker` instead and implement the `walk` method to fit the needs of your rule.
It's as simple as this:

```ts
class MyWalker extends Lint.AbstractWalker<MyOptionsType> {
    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (someCondition) {
                // do stuff
            }
            // Wondering why return is used below? Refer to "Make use of tail calls"
            return ts.forEachChild(node, cb); // recurse deeper
        };
        return ts.forEachChild(sourceFile, cb); // start recursion with children of sourceFile
    }
```

### Don't walk the whole AST if possible

__The language specification is your friend__:
The language spec defines where each statement can occur.
For example, if you are interested in `import` statements, you only need to search in `sourceFile.statements` and nested `NamespaceDeclaration`s.

__Don't visit AST branches you're not interested in__:
For example, `no-null-keyword` creates no failure if the null keyword is part of another type.
There are two ways to achieve this:

* Recurse into the AST until you find a token of kind NullKeyword and then walk up its parent chain to find out if it is part of a type node.
* Stop recursing deeper into that branch as soon as you hit a type node (preferred).

### Avoid frequently creating one-time closures in the hot path
```ts
class SomeClass {
    // this is a simplified version of what SyntaxWalker does under the hood
    doStuff(node: ts.Node) {
        // do stuff ...

        ts.forEachChild(node, (n) => this.doStuff(n));
                           // ~~~~~~~~~~~~~~~~~~~~~~ [a new closure is created for EVERY node in the AST and remains on the call stack
                           //                         until processing of all children is done]
    }
}
```

Instead use the same closure for every call like the example above in __Implement your own walking algorithm__.

### Create small specialized functions / methods

Instead of stuffing the whole logic in a single closure, consider splitting it up into smaller functions or methods.
Each function should handle similar kinds of nodes. Don't worry too much about the function call, since V8 eventually inlines the function
if possible.

The AST nodes have different properties, therefore they have a different hidden class in V8. A function can only be optimized for a certain
amount of different hidden classes. Above that threshold the function will be deoptimized and is never optimized again.

### Supply the optional sourceFile parameter

There are serveral methods that have an optional parameter `sourceFile`. Don't omit this parameter if you care for performance.
If ommitted, typescript needs to walk up the node's parent chain until it reaches the SourceFile. This *can* be quite costly when done
frequently on deeply nested nodes.

Some examples:

* `node.getStart()`
* `node.getWidth()`
* `node.getText()`
* `node.getChildren()`
* `node.getFirstToken()`
* `node.getLeadingTriviaWidth()`

### Avoid excessive calls to node.getStart(), node.getWidth() and node.getText()

`node.getStart()` scans the source to skip all the leading trivia. Although barely noticeable, this operation is not for free.
If you need the start position of a node more than once per function, consider caching it.

`node.getWidth()` is most of the time used together with `node.getStart()` to get the node's span. Internally it uses `node.getEnd() - node.getStart()` which effectively doubles the calls to `node.getStart()`. Consider using `node.getEnd()` instead and calculate the width yourself if necessary.

`node.getText()` calculates the start of the node and returns a substring until the end of the token.
Most of the time this not needed, because this substring is already contained in the node.

```ts
declare node: ts.Identifier;
node.getText() === node.text; // prefer node.text where available
```

__Bonus points:__ If you know the width of the node (either from the `text` property or because it is a keyword of known width),
you can use `node.getEnd() - width` to calculate the node's start.
`node.getEnd()` is effectively for free as it only returns the `end` property. This way you avoid the cost of skipping leading trivia.

### Make use of tail calls

Tail calls are function or method calls at the end of the control flow of a function. It's only a tail call if the return value of that call
is directly returned unchanged. Browsers can optimize this pattern for performance.
Further optimization is specced in ES2015 as "Proper Tail Calls".
With proper tail calls the browser reuses the stack frame of the current function. When done right this allows for infinite recursion.

```ts
function foo() {
    if (condition)
        return bar(); // tail call
    if (someOtherCondition)
        return foo() + 1; // no tail call, return value is modified
    return baz(); // tail call
}

function bas() {
    if (cond)
        return someGlobalVariable = bar(); // no tail call, return value is stored in value before it is returned
    foo(); // no tail call because there is no return
}
```

### Typeguards

Typeguard functions are very small by default. These functions will be inlined into the containing function.
After inlining you no longer pay the cost of the function call.

But beware of the inlining limit. If a function is big enough or already has many inlined functions, V8 will stop inlining other functions.

Try to use a discriminated union if possible. A typeguard makes sense if you can save up multiple type assertions.
