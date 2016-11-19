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
import * as glob from "glob";
import * as optimist from "optimist";
import * as path from "path";
import * as ts from "typescript";

import {
    CONFIG_FILENAME,
    DEFAULT_CONFIG,
    findConfiguration,
} from "./configuration";
import * as Linter from "./linter";
import { consoleTestResultHandler, runTest } from "./test";
import { updateNotifierCheck } from "./updateNotifier";

let processed = optimist
    .usage("Usage: $0 [options] file ...")
    .check((argv: any) => {
        // at least one of file, help, version, project or unqualified argument must be present
        if (!(argv.h || argv.i || argv.test || argv.v || argv.project || argv._.length > 0)) {
            throw "Missing files";
        }

        if (argv.f) {
            throw "-f option is no longer available. Supply files directly to the tslint command instead.";
        }
    })
    .options({
        "c": {
            alias: "config",
            describe: "configuration file",
        },
        "e": {
            alias: "exclude",
            describe: "exclude globs from path expansion",
            type: "string",
        },
        "fix": {
            describe: "Fixes linting errors for select rules. This may overwrite linted files",
            type: "boolean",
        },
        "force": {
            describe: "return status code 0 even if there are lint errors",
            type: "boolean",
        },
        "h": {
            alias: "help",
            describe: "display detailed help",
        },
        "i": {
            alias: "init",
            describe: "generate a tslint.json config file in the current working directory",
        },
        "o": {
            alias: "out",
            describe: "output file",
        },
        "project": {
            describe: "tsconfig.json file",
        },
        "r": {
            alias: "rules-dir",
            describe: "rules directory",
        },
        "s": {
            alias: "formatters-dir",
            describe: "formatters directory",
        },
        "t": {
            alias: "format",
            default: "prose",
            describe: "output format (prose, json, stylish, verbose, pmd, msbuild, checkstyle, vso, fileslist)",
        },
        "test": {
            describe: "test that tslint produces the correct output for the specified directory",
        },
        "type-check": {
            describe: "enable type checking when linting a project",
        },
        "v": {
            alias: "version",
            describe: "current version",
        },
    });
const argv = processed.argv;

let outputStream: any;
if (argv.o != null) {
    outputStream = fs.createWriteStream(argv.o, {
        flags: "w+",
        mode: 420,
    });
} else {
    outputStream = process.stdout;
}

if (argv.v != null) {
    outputStream.write(Linter.VERSION + "\n");
    process.exit(0);
}

if (argv.i != null) {
    if (fs.existsSync(CONFIG_FILENAME)) {
        console.error(`Cannot generate ${CONFIG_FILENAME}: file already exists`);
        process.exit(1);
    }

    const tslintJSON = JSON.stringify(DEFAULT_CONFIG, undefined, "    ");
    fs.writeFileSync(CONFIG_FILENAME, tslintJSON);
    process.exit(0);
}

if (argv.test != null) {
    const results = runTest(argv.test, argv.r);
    const didAllTestsPass = consoleTestResultHandler(results);
    process.exit(didAllTestsPass ? 0 : 1);
}

if ("help" in argv) {
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
        Runs tslint on the specified directory and checks if tslint's output matches
        the expected output in .lint files. Automatically loads the tslint.json file in the
        specified directory as the configuration file for the tests. See the
        full tslint documentation for more details on how this can be used to test custom rules.

    --project:
        The location of a tsconfig.json file that will be used to determine which
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

// when provided, it should point to an existing location
if (argv.c && !fs.existsSync(argv.c)) {
    console.error("Invalid option for configuration: " + argv.c);
    process.exit(1);
}
const possibleConfigAbsolutePath = argv.c != null ? path.resolve(argv.c) : null;

const processFiles = (files: string[], program?: ts.Program) => {

    const linter = new Linter({
        fix: argv.fix,
        formatter: argv.t,
        formattersDirectory: argv.s || "",
        rulesDirectory: argv.r || "",
    }, program);

    for (const file of files) {
        if (!fs.existsSync(file)) {
            console.error(`Unable to open file: ${file}`);
            process.exit(1);
        }

        const buffer = new Buffer(256);
        buffer.fill(0);
        const fd = fs.openSync(file, "r");
        try {
            fs.readSync(fd, buffer, 0, 256, null);
            if (buffer.readInt8(0) === 0x47 && buffer.readInt8(188) === 0x47) {
                // MPEG transport streams use the '.ts' file extension. They use 0x47 as the frame
                // separator, repeating every 188 bytes. It is unlikely to find that pattern in
                // TypeScript source, so tslint ignores files with the specific pattern.
                console.warn(`${file}: ignoring MPEG transport stream`);
                return;
            }
        } finally {
            fs.closeSync(fd);
        }

        const contents = fs.readFileSync(file, "utf8");
        const configLoad = findConfiguration(possibleConfigAbsolutePath, file);

        if (configLoad.results) {
            linter.lint(file, contents, configLoad.results);
        } else {
            console.error(`Failed to load ${configLoad.path}: ${configLoad.error.message}`);
            process.exit(1);
        }
    }

    const lintResult = linter.getResult();

    outputStream.write(lintResult.output, () => {
        if (lintResult.failureCount > 0) {
            process.exit(argv.force ? 0 : 2);
        }
    });

    if (lintResult.format === "prose") {
        // Check to see if there are any updates available
        updateNotifierCheck();
    }
};

// if both files and tsconfig are present, use files
let files = argv._;
let program: ts.Program;

if (argv.project != null) {
    if (!fs.existsSync(argv.project)) {
        console.error("Invalid option for project: " + argv.project);
        process.exit(1);
    }
    program = Linter.createProgram(argv.project, path.dirname(argv.project));
    if (files.length === 0) {
        files = Linter.getFileNames(program);
    }
    if (argv["type-check"]) {
        // if type checking, run the type checker
        const diagnostics = ts.getPreEmitDiagnostics(program);
        if (diagnostics.length > 0) {
            const messages = diagnostics.map((diag) => {
                // emit any error messages
                let message = ts.DiagnosticCategory[diag.category];
                if (diag.file) {
                    const {line, character} = diag.file.getLineAndCharacterOfPosition(diag.start);
                    message += ` at ${diag.file.fileName}:${line + 1}:${character + 1}:`;
                }
                message += " " + ts.flattenDiagnosticMessageText(diag.messageText, "\n");
                return message;
            });
            throw new Error(messages.join("\n"));
        }
    } else {
        // if not type checking, we don't need to pass in a program object
        program = undefined;
    }
}

const trimSingleQuotes = (str: string) => str.replace(/^'|'$/g, "");

let ignorePatterns: string[] = [];
if (argv.e) {
    const excludeArguments: string[] = Array.isArray(argv.e) ? argv.e : [argv.e];

    ignorePatterns = excludeArguments.map(trimSingleQuotes);
}

files = files
    // remove single quotes which break matching on Windows when glob is passed in single quotes
    .map(trimSingleQuotes)
    .map((file: string) => glob.sync(file, { ignore: ignorePatterns, nodir: true }))
    .reduce((a: string[], b: string[]) => a.concat(b));

processFiles(files, program);
