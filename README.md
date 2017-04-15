[![NPM version](https://badge.fury.io/js/tslint.svg)](http://badge.fury.io/js/tslint)
[![Downloads](http://img.shields.io/npm/dm/tslint.svg)](https://npmjs.org/package/tslint)
[![Circle CI](https://circleci.com/gh/palantir/tslint.svg?style=svg)](https://circleci.com/gh/palantir/tslint)
[![Join the chat at https://gitter.im/palantir/tslint](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/palantir/tslint?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

TSLint
======

TSLint is an extensible static analysis tool that checks [TypeScript](https://github.com/Microsoft/TypeScript) code for readability, maintainability, and functionality errors. It is widely supported across modern editors & build systems and can be customized with your own lint rules, configurations, and formatters.

TSLint supports:

- custom lint rules
- custom formatters (failure reporters)
- inline disabling and enabling of rules
- configuration presets (`tslint:latest`, `tslint-react`, etc.) & composition
- automatic fixing of formatting & style violations
- integration with [msbuild](https://github.com/joshuakgoldberg/tslint.msbuild), [grunt](https://github.com/palantir/grunt-tslint), [gulp](https://github.com/panuhorsmalahti/gulp-tslint), [atom](https://github.com/AtomLinter/linter-tslint), [eclipse](https://github.com/palantir/eclipse-tslint), [emacs](http://flycheck.org), [sublime](https://packagecontrol.io/packages/SublimeLinter-contrib-tslint), [vim](https://github.com/scrooloose/syntastic), [visual studio](https://visualstudiogallery.msdn.microsoft.com/6edc26d4-47d8-4987-82ee-7c820d79be1d), [vscode](https://marketplace.visualstudio.com/items?itemName=eg2.tslint), [webstorm](https://www.jetbrains.com/webstorm/help/tslint.html), and more

Installation & Usage
------------

Refer to the full installation & usage documentation on the [TSLint website](https://palantir.github.io/tslint/).

There, you'll find information about
- [configuration](https://palantir.github.io/tslint/usage/configuration/),
- [core rules](https://palantir.github.io/tslint/),
- [core formatters](http://palantir.github.io/tslint/formatters/), and
- [customization of TSLint](https://palantir.github.io/tslint/develop/custom-rules/).

Custom Rules
------------

#### Custom rule sets from Palantir

- [tslint-react](https://github.com/palantir/tslint-react) - Lint rules related to React & JSX.
- [tslint-blueprint](https://github.com/palantir/tslint-blueprint) - Lint rules to enforce best practices with [blueprintjs libraries](https://github.com/palantir/blueprint)

#### Custom rule sets from the community

If we don't have all the rules you're looking for, you can either write your own custom rules or use custom rules that others have developed. The repos below are a good source of custom rules:

- [ESLint rules for TSLint](https://github.com/buzinas/tslint-eslint-rules) - Improve your TSLint with the missing ESLint Rules
- [tslint-microsoft-contrib](https://github.com/Microsoft/tslint-microsoft-contrib) - A set of TSLint rules used on some Microsoft projects
- [codelyzer](https://github.com/mgechev/codelyzer) - A set of tslint rules for static code analysis of Angular TypeScript projects
- [vrsource-tslint-rules](https://github.com/vrsource/vrsource-tslint-rules)
- [tslint-immutable](https://github.com/jonaskello/tslint-immutable) - TSLint rules to disable mutation in TypeScript
- [tslint-consistent-codestyle](https://github.com/ajafff/tslint-consistent-codestyle) - TSLint rules to enforce consistent code style in TypeScript

Development
-----------

Requirements:

- `node` v7
- `yarn` v0.18

#### Quick Start

```bash
git clone git@github.com:palantir/tslint.git --config core.autocrlf=input --config core.eol=lf
yarn install
yarn compile
yarn test
```

Creating a new release
----------------------

1. Bump the version number in `package.json` and `src/tslintMulti.ts`
2. Add release notes in `CHANGELOG.md`
3. `yarn verify` to build the latest sources
4. Commit with message `Prepare release <version>`
5. Run `npm publish`
6. Create a git tag for the new release and push it ([see existing tags here](https://github.com/palantir/tslint/tags))
