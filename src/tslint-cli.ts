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

/// <reference path="../typings/node.d.ts"/>
/// <reference path="tslint.ts"/>
/// <reference path="configuration.ts"/>

const fs = require("fs");
const optimist = require("optimist")
    .usage("usage: $0")
    .check((argv: any) => {
        // at least one of file, help, version or unqualified argument must be present
        if (!(argv.f || argv.h || argv.v || argv._.length > 0)) {
            throw "Missing required arguments: f";
        }
    })
    .options({
        "c": {
            alias: "config",
            describe: "configuration file"
        },
        "f": {
            alias: "file",
            describe: "file to lint"
        },
        "h": {
            alias: "help",
            describe: "display detailed help"
        },
        "o": {
            alias: "out",
            describe: "output file"
        },
        "r": {
            alias: "rules-dir",
            describe: "rules directory"
        },
        "s": {
            alias: "formatters-dir",
            describe: "formatters directory"
        },
        "t": {
            alias: "format",
            default: "prose",
            describe: "output format (prose, json, verbose)"
        },
        "v": {
            alias: "version",
            describe: "current version"
        }
    });
const argv = optimist.argv;

let outputStream: any;
if (argv.o !== undefined) {
    outputStream = fs.createWriteStream(argv.o, {
        end: false,
        flags: "w+",
        mode: 420
    });
} else {
    outputStream = process.stdout;
}

if (argv.v !== undefined) {
    outputStream.write(Lint.Linter.VERSION + "\n");
    process.exit(0);
}

if ("help" in argv) {
    outputStream.write(optimist.help());
    const outputString = `
tslint accepts the following commandline options:

    -f, --file:
        The location of the TypeScript file that you wish to lint. This
        option is required. Muliptle files are processed consecutively.

    -c, --config:
        The location of the configuration file that tslint will use to
        determine which rules are activated and what options to provide
        to the rules. If no option is specified, the config file named
        tslint.json is used, so long as it exists in the path.
        The format of the file is { rules: { /* rules list */ } },
        where /* rules list */ is a key: value comma-seperated list of
        rulename: rule-options pairs. Rule-options can be either a
        boolean true/false value denoting whether the rule is used or not,
        or a list [boolean, ...] where the boolean provides the same role
        as in the non-list case, and the rest of the list are options passed
        to the rule that will determine what it checks for (such as number
        of characters for the max-line-length rule, or what functions to ban
        for the ban rule).

    -o, --out:
        A filename to output the results to. By default, tslint outputs to
        stdout, which is usually the console where you're running it from.

    -r, --rules-dir:
        An additional rules directory, for additional user-created rules.
        tslint will always check its default rules directory, in
        node_modules/tslint/build/rules, before checking the user-provided
        rules directory, so rules in the user-provided rules directory
        with the same name as the base rules will not be loaded.

    -s, --formatters-dir:
        An additional formatters directory, for user-created formatters.
        Formatters are files that will format the tslint output, before
        writing it to stdout or the file passed in --out. The default
        directory, node_modules/tslint/build/formatters, will always be
        checked first, so user-created formatters with the same names
        as the base formatters will not be loaded.

    -t, --format:
        The formatter to use to format the results of the linter before
        outputting it to stdout or the file passed in --out. The core
        formatters are prose (human readable), json (machine readable)
        and verbose. prose is the default if this option is not used. Additonal
        formatters can be added and used if the --formatters-dir option is set.

    -v, --version:
        The current version of tslint.

    -h, --help:
       Prints this help message.`;
    outputStream.write(outputString);
    process.exit(0);
}

// When provided it should point to an existing location
if (argv.c && !fs.existsSync(argv.c)) {
    console.error("Invalid option for configuration: " + argv.c);
    process.exit(1);
}

const processFile = (file: string) => {
    if (!fs.existsSync(file)) {
        console.error("Unable to open file: " + file);
        process.exit(1);
    }

    const contents = fs.readFileSync(file, "utf8");
    const configuration = Lint.Configuration.findConfiguration(argv.c, file);

    if (configuration === undefined) {
        console.error("unable to find tslint configuration");
        process.exit(1);
    }

    const linter = new Lint.Linter(file, contents, {
        configuration: configuration,
        formatter: argv.t,
        formattersDirectory: argv.s,
        rulesDirectory: argv.r
    });

    const lintResult = linter.lint();

    if (lintResult.failureCount > 0) {
        outputStream.write(lintResult.output, () => {
            process.exit(2);
        });
    }
};

let files = [];
if (argv.f instanceof Array) {
    files = files.concat(argv.f);
} else if (typeof argv.f === "string") {
    files.push(argv.f);
}
files = files.concat(argv._);

for (const file of files) {
        processFile(file);
}
