/*
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

/// <reference path='tslint.ts'/>

var fs = require("fs");
var path = require("path");
var argv = require("optimist")
  .usage("usage: $0")
  .demand("f")
  .options({
    "c": {
        alias: "config",
        describe: "configuration file"
    },
    "f": {
        alias: "file",
        describe: "file to lint"
    },
    "o": {
        alias: "out",
        describe: "output file",
    },
    "t": {
        alias: "format",
        describe: "output format (prose, json)",
        default: "prose"
    }
  })
  .argv;

var configuration = Lint.Configuration.findConfiguration(argv.c);
if (configuration === undefined) {
    console.error("unable to find tslint configuration");
    process.exit(1);
}

var file = argv.f;
var contents = fs.readFileSync(file, "utf8");

var linter = new Lint.Linter(file, contents, {
    formatter: argv.t,
    configuration: configuration
});
var lintResult = linter.lint();

var outputStream;
if (argv.o !== undefined) {
    outputStream = fs.createWriteStream(argv.o, {
        end: false,
        flags: "w+",
        mode: 0644
    });
} else {
    outputStream = process.stdout;
}

if (lintResult.failureCount > 0) {
    outputStream.write(lintResult.output, () => {
        process.exit(2);
    });
}
