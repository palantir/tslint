---
layout: page
title: Docs Development
permalink: /develop/docs/
---

This docs site is a [Jekyll site][0] hosted on [GitHub pages][1].
It is maintained in the [`gh-pages` branch][2] of TSLint.
To contribute to the docs, whether it be better styling, functionality, or content, just create a PR targeted at the `gh-pages` branch.

#### Creating New Pages ####
To create a new page, follow the pattern of existing pages. You'll also need to add appropriate metadata in the `_data/*_sidebar.json` data file if you want it to show up in a sidebar.

#### Creating News Posts ####
To create a new news post, simply add a new markdown file to the `_posts` directory, following the same pattern as existing ones.

#### Updating Rule Documentation ####

The [documentation for rules][3] is automatically generated from the metadata supplied by each rule.
If you'd like to help improve documentation for them, simply file a PR improving a rule's metadata and a project collaborator will take care of regenerating the docs site once your PR is merged.

There's a little complexity in the automatic generation of rules documentation: code from either the `master` or `next` branch of the project needs to write files to the `gh-pages` branch. This is accomplished by writing into a sibling directory of the TSLint repo named `tslint-gh-pages`. (See the `docs/buildDocs.ts` script).

If you have TSLint cloned somewhere on your machine and are using Git 2.5+, you can get this directory structure set up by using the [git worktree command][4]:

```
git worktree add -b gh-pages ../tslint-gh-pages origin/gh-pages
```

If you're using an older version of git, you can simply clone the repo again into a sibling directory named `tslint-gh-pages` and then `git checkout` the `gh-pages` branch.

Once you have the directories set up properly, go to your main TSLint directory, run `grunt` to build the source code and then `grunt docs` to regenerate the rules docs.

[0]: http://jekyllrb.com/
[1]: https://pages.github.com/
[2]: https://github.com/palantir/tslint/tree/gh-pages
[3]: {{site.baseurl}}/rules/
[4]: https://git-scm.com/docs/git-worktree