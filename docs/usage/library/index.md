---
layout: page
title: Using TSLint as a Node.js library
permalink: /usage/library/
---

### Installation

```sh
npm install tslint typescript
# or
yarn add tslint typescript
```

{% include peer_dependencies.md %}

### Library usage

Please ensure that the TypeScript source files compile correctly _before_ running the linter.

#### TypeScript

This code will need to be transpiled to JavaScript to run under Node.js.

```ts
import { Linter, Configuration } from "tslint";
import * as fs from "fs";

const fileName = "Specify input file name";
const configurationFilename = "Specify configuration file name";
const options = {
    fix: false,
    formatter: "json",
    rulesDirectory: "customRules/",
    formattersDirectory: "customFormatters/"
};

const fileContents = fs.readFileSync(fileName, "utf8");
const linter = new Linter(options);
const configuration = Configuration.findConfiguration(configurationFilename, fileName).results;
linter.lint(fileName, fileContents, configuration);
const result = linter.getResult();
```

#### JavaScript (ES5)

This code will run directly under Node.js, including if it's called from the command line.  

```js
"use strict";
var tslint = require("tslint");
var fs = require("fs");
var fileName = "Specify input file name";
var configurationFilename = "Specify configuration file name";
var options = {
    fix: false,
    formatter: "json",
    rulesDirectory: "customRules/",
    formattersDirectory: "customFormatters/"
};
var fileContents = fs.readFileSync(fileName, "utf8");
var linter = new tslint.Linter(options);
var configuration = tslint.Configuration.findConfiguration(configurationFilename, fileName).results;
linter.lint(fileName, fileContents, configuration);
var result = linter.getResult();
```