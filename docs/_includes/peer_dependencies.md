##### Peer dependencies

The `typescript` package is a peer dependency of TSLint. This allows you to update the compiler independently from the linter.
This also means that `tslint` will have to use the same version of `tsc` which is used to actually compile your sources.

Although the peer dependency allows installing the latest nightly releases of `typescript@next`, be aware that these might include breaking changes that cause the linter to malfunction.