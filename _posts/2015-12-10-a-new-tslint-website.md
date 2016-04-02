---
layout: post
title:  "A New TSLint Website"
date:   2015-12-10 20:15:21
---

As TSLint has grown in usage and popularity alongside of TypeScript, it also has
evolved in terms of functionality and complexity. Today, all sorts of projects and products,
from [Angular 2][1] to the [TypeScript compiler itself][2] use TSLint
to help keep their code high-quality.

Unfortunately, we've done a poor job of scaling the documentation and guides for TSLint as it has grown.
For example, the only good way to see the possible rules TSLint can enforce and what they can do is to scroll through the quite-long [TSLint README][3].
Each rule is accompanied by a short description of its functionality, but nowhere does it explain why the rule is actually useful.
There's also a short description of the rule's options, but the syntax for specifying these options is often unclear.

This website, in its current, very simple form, marks the beginning of a renewed focus on developer and user experience. But it's just the tip of the iceberg in changes to come - other things in progress include:

* [A documentation overhaul][4] that will provide
more comprehensive and clear documentation on TSLint and will make it easier to navigate that documentation.
* [A new `--init` feature][5] in the TSLint CLI that will make it easier to
generate a sensible initial `tslint.json` config file.
* [An improved contributor experience][6] that will make things easier for those who want to contribute code to TSLint.

Feedback is always great, so please comment on any of the above GitHub issues and let us know what you would like to see to make TSLint user experience even better!

[1]: https://angular.io/
[2]: https://github.com/Microsoft/TypeScript
[3]: https://github.com/palantir/tslint/blob/409aa6e4aa4b63da11fd61e15b26b0100cf1e845/README.md
[4]: https://github.com/palantir/tslint/issues/830
[5]: https://github.com/palantir/tslint/pull/871
[6]: https://github.com/palantir/tslint/issues/831
