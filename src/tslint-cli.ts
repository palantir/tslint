/**
 * @license
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

import * as fs from "fs";
import * as optimist from "optimist";

import { IRunnerOptions, Runner } from "./runner";

interface Argv {
    _: string[];
    c?: string;
    exclude?: string;
    f?: boolean;
    fix?: boolean;
    force?: boolean;
    h?: boolean;
    help?: boolean;
    i?: boolean;
    init?: boolean;
    o?: string;
    out?: string;
    outputAbsolutePaths?: boolean;
    p?: string;
    project?: string;
    r?: string;
    s?: string;
    t?: string;
    "type-check"?: boolean;
    test?: string;
    v?: boolean;
}

const processed = optimist
    .usage("Usage: $0 [options] file ...")
    .check((argv: Argv) => {
        // at least one of file, help, version, project or unqualified argument must be present
        // tslint:disable-next-line strict-boolean-expressions
        if (!(argv.h || argv.i || argv.test || argv.v || argv.project || argv._.length > 0)) {
            // throw a string, otherwise a call stack is printed for this message
            // tslint:disable-next-line:no-string-throw
            throw "Missing files";
        }

        // tslint:disable-next-line strict-boolean-expressions
        if (argv["type-check"] && !argv.project) {
            // tslint:disable-next-line:no-string-throw
            throw "--project must be specified in order to enable type checking.";
        }

        // tslint:disable-next-line strict-boolean-expressions
        if (argv.f) {
            // throw a string, otherwise a call stack is printed for this message
            // tslint:disable-next-line:no-string-throw
            throw "-f option is no longer available. Supply files directly to the tslint command instead.";
        }
    })
    .options({
        "c": {
            alias: "config",
            describe: "configuration file",
            type: "string",
        },
        "e": {
            alias: "exclude",
            describe: "exclude globs from path expansion",
            type: "string",
        },
        "fix": {
            describe: "fixes linting errors for select rules (this may overwrite linted files)",
            type: "boolean",
        },
        "force": {
            describe: "return status code 0 even if there are lint errors",
            type: "boolean",
        },
        "h": {
            alias: "help",
            describe: "display detailed help",
            type: "boolean",
        },
        "i": {
            alias: "init",
            describe: "generate a tslint.json config file in the current working directory",
            type: "boolean",
        },
        "o": {
            alias: "out",
            describe: "output file",
            type: "string",
        },
        "outputAbsolutePaths": {
            describe: "whether or not outputted file paths are absolute",
            type: "boolean",
        },
        "p": {
            alias: "project",
            describe: "tsconfig.json file",
            type: "string",
        },
        "r": {
            alias: "rules-dir",
            describe: "rules directory",
            type: "string",
        },
        "s": {
            alias: "formatters-dir",
            describe: "formatters directory",
            type: "string",
        },
        "t": {
            alias: "format",
            default: "prose",
            describe: "output format (prose, json, stylish, verbose, pmd, msbuild, checkstyle, vso, fileslist, codeFrame)",
            type: "string",
        },
        "test": {
            describe: "test that tslint produces the correct output for the specified directory",
            type: "boolean",
        },
        "type-check": {
            describe: "enable type checking when linting a project",
            type: "boolean",
        },
        "v": {
            alias: "version",
            describe: "current version",
            type: "boolean",
        },
    });
const argv = processed.argv as Argv;

let outputStream: NodeJS.WritableStream;
if (argv.o != null) {
    outputStream = fs.createWriteStream(argv.o, {
        flags: "w+",
        mode: 420,
    });
} else {
    outputStream = process.stdout;
}

// tslint:disable-next-line strict-boolean-expressions
if (argv.help) {
    outputStream.write(processed.help());
    const outputString = `
tslint accepts the following commandline options:

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

    -e, --exclude:
        A filename or glob which indicates files to exclude from linting.
        This option can be supplied multiple times if you need multiple
        globs to indicate which files to exclude.

    --fix:
        Fixes linting errors for select rules. This may overwrite linted files.

    --force:
        Return status code 0 even if there are any lint errors.
        Useful while running as npm script.

    -i, --init:
        Generates a tslint.json config file in the current working directory.

    -o, --out:
        A filename to output the results to. By default, tslint outputs to
        stdout, which is usually the console where you're running it from.

    -r, --rules-dir:
        An additional rules directory, for user-created rules.
        tslint will always check its default rules directory, in
        node_modules/tslint/lib/rules, before checking the user-provided
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
        and verbose. prose is the default if this option is not used.
        Other built-in options include pmd, msbuild, checkstyle, and vso.
        Additional formatters can be added and used if the --formatters-dir
        option is set.

    --test:
        Runs tslint on matched directories and checks if tslint outputs
        match the expected output in .lint files. Automatically loads the
        tslint.json files in the directories as the configuration file for
        the tests. See the full tslint documentation for more details on how
        this can be used to test custom rules.

    -p, --project:
        The path or directory containing a tsconfig.json file that will be used to determine which
        files will be linted.

    --type-check
        Enables the type checker when running linting rules. --project must be
        specified in order to enable type checking.

    -v, --version:
        The current version of tslint.

    -h, --help:
        Prints this help message.\n`;
    outputStream.write(outputString);
    process.exit(0);
}

const options: IRunnerOptions = {
    config: argv.c,
    exclude: argv.exclude,
    files: argv._,
    fix: argv.fix,
    force: argv.force,
    format: argv.t,
    formattersDirectory: argv.s,
    init: argv.init,
    out: argv.out,
    outputAbsolutePaths: argv.outputAbsolutePaths,
    project: argv.p,
    rulesDirectory: argv.r,
    test: argv.test,
    typeCheck: argv["type-check"],
    version: argv.v,
};

new Runner(options, outputStream)
    .run((status: number) => process.exit(status));
