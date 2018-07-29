---
layout: page
title: Docs Development
permalink: /develop/docs/
---

This docs site is a [Jekyll site][0] hosted on [GitHub pages][1].
It is maintained in the [`/docs` directory][2] of TSLint.
To contribute to the docs, whether it be better styling, functionality, or content, just create a PR as you would for any code contribution.

#### Updating Rule Documentation ####
The [documentation for rules][3] is automatically generated from the metadata supplied by each rule in its corresponding `.ts` file.
If you'd like to help improve documentation for them, simply file a PR improving a rule's metadata and a project collaborator will take care of regenerating the docs site once your PR is merged.

Running the `yarn docs` command will regenerate the rules docs based off of the metadata provided in the code. This is normally done each release so that the public docs site is up to date with the latest release.

#### Creating New Pages ####
To create a new page, follow the pattern of existing pages. You'll also need to add appropriate metadata in the `_data/*_sidebar.json` data file if you want it to show up in a sidebar.

#### Creating News Posts ####
To create a new news post, simply add a new markdown file to the `_posts` directory, following the same pattern as existing ones.

[0]: http://jekyllrb.com/
[1]: https://pages.github.com/
[2]: https://github.com/palantir/tslint/tree/master/docs
[3]: {{site.baseurl}}/rules/
[4]: https://git-scm.com/docs/git-worktree
