---
layout: page
title: Library
permalink: /usage/library/
---

### Installation

```sh
npm install tslint typescript
# or
yarn add tslint typescript
```

{% include peer_dependencies.md %}

### Usage

Please ensure that the TypeScript source files compile correctly _before_ running the linter.

```ts
import { Linter, Configuration } from "tslint";
import * as fs from "fs";

const fileName = "Specify input file name";
const configurationFilename = "Specify configuration file name";
const options = {
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
