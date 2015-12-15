##### Peer dependencies #####

The `typescript` module is a peer dependency of TSLint, which allows you to update the compiler independently from the
linter. This also means that `tslint` will have to use the same version of `tsc` used to actually compile your sources.

Breaking changes in the latest dev release of `typescript@next` might break something in the linter if we haven't built against that release yet. If this happens to you, you can try:

1. picking up `tslint@next`, which may have some bugfixes not released in `tslint@latest`
   (see [release notes here](https://github.com/palantir/tslint/releases)).
2. rolling back `typescript` to a known working version.