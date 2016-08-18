---
layout: post
title:  "Sharable Configurations and Rules"
date:   2016-03-31 15:19:00
---

With the release of [TSLint v3.7.0][0] comes a few new features that will make configuration files (aka [`tslint.json` files][1])
easier to maintain and share. The crux of the changes is a new `extends` field,  which when provided indicates that a configuration
file augments another configuration file.

### Example ###

Let's imagine you've created some custom rules and want to share them with others.
You also have a couple of configurations for them you want to share.

Here's the layout of our NPM package, which we'll call `shared-tslint-rules`. We have a directory with rules,
as well as a few different config files for TSLint.

```
shared-tslint-rules
├── package.json
├── rules
│   ├── noAdditionRule.js
│   ├── noErrorsRule.js
│   └── noExcessiveCommentingRule.js
├── tslint-base.json
├── tslint-config.json
└── tslint-crazy-config.js
```

Our starting-point config file just references the directory the custom rules are in
but doesn't enable any of them:

**tslint-base.json**:

```json
{
    "rulesDirectory": "./rules"
}
```

We also want to provide a sane default config for our rules.
Notice how it extends our base config, so we don't have to redeclare `rulesDirectory` here:

**tslint-config.json**:

```json
{
    "extends": "./tslint-base.json",
    "rules": {
        "no-errors": true,
        "no-addition": false
    }
}
```

Finally, we can even make a crazy config file for fun that gives you back a different config
each time you run TSLint. Notice how this is a `.js` file that exports an object:

**tslint-crazy-config.js**

```js
module.exports = {
    extends: "./tslint-base.json",
    rules: {
        "no-excessive-commenting": [true, {maxComments: Math.random() * 10}]
    }
};
```

Finally, we have our `package.json` file which references our base config file through its `main` field:

**package.json**:

```json
{
  "name": "shared-tslint-rules",
  "version": "1.0.0",
  "description": "Some TSLint rules that are great!",
  "main": "tslint-base.json",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "MIT"
}
```

We can publish our package on NPM to let the world use it!

---

Now let's say we're a user, and we want to use the custom rules above to lint our code.
First, we'll make sure we have the necessary npm packages installed:

```
npm install -g tslint shared-tslint-rules
```

Then, in our `tslint.json` file for our project, we can reference the package of custom rules with `extends`:

```
{
    "extends": "shared-tslint-rules/tslint-config",
    "rules": {
        "no-addition": true
    }
}
```

and that's all we have to do to use the custom rules!
We can now run TSLint as we would normally and see any lint errors produced by the custom rules:

```
tslint -c path/to/tslint.json my/files/**/to/lint.ts
```

[0]: https://github.com/palantir/tslint/releases
[1]: {{ site.baseurl }}/usage/tslint-json
