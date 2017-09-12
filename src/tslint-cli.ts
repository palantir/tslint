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

// tslint:disable no-console object-literal-sort-keys

import commander = require("commander");
import * as fs from "fs";

import { VERSION } from "./linter";
import { run } from "./runner";
import { dedent } from "./utils";

interface Argv {
    config?: string;
    exclude: string[];
    fix?: boolean;
    force?: boolean;
    help?: boolean;
    init?: boolean;
    out?: string;
    outputAbsolutePaths: boolean;
    project?: string;
    rulesDir?: string;
    formattersDir: string;
    format?: string;
    typeCheck?: boolean;
    test?: string;
    version?: boolean;
}

interface Option {
    short?: string;
    // Commander will camelCase option names.
    name: keyof Argv | "rules-dir" | "formatters-dir" | "type-check";
    type: "string" | "boolean" | "array";
    describe: string; // Short, used for usage message
    description: string; // Long, used for `--help`
}

const options: Option[] = [
    {
        short: "c",
        name: "config",
        type: "string",
        describe: "configuration file",
        description: dedent`
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
            for the ban rule).`,
    },
    {
        short: "e",
        name: "exclude",
        type: "array",
        describe: "exclude globs from path expansion",
        description: dedent`
            A filename or glob which indicates files to exclude from linting.
            This option can be supplied multiple times if you need multiple
            globs to indicate which files to exclude.`,
    },
    {
        name: "fix",
        type: "boolean",
        describe: "fixes linting errors for select rules (this may overwrite linted files)",
        description: "Fixes linting errors for select rules. This may overwrite linted files.",
    },
    {
        name: "force",
        type: "boolean",
        describe: "return status code 0 even if there are lint errors",
        description: dedent`
            Return status code 0 even if there are any lint errors.
            Useful while running as npm script.`,
    },
    {
        short: "i",
        name: "init",
        type: "boolean",
        describe: "generate a tslint.json config file in the current working directory",
        description: "Generates a tslint.json config file in the current working directory.",
    },
    {
        short: "o",
        name: "out",
        type: "string",
        describe: "output file",
        description: dedent`
            A filename to output the results to. By default, tslint outputs to
            stdout, which is usually the console where you're running it from.`,
    },
    {
        name: "outputAbsolutePaths",
        type: "boolean",
        describe: "whether or not outputted file paths are absolute",
        description: "If true, all paths in the output will be absolute.",
    },
    {
        short: "r",
        name: "rules-dir",
        type: "string",
        describe: "rules directory",
        description: dedent`
            An additional rules directory, for user-created rules.
            tslint will always check its default rules directory, in
            node_modules/tslint/lib/rules, before checking the user-provided
            rules directory, so rules in the user-provided rules directory
            with the same name as the base rules will not be loaded.`,
    },
    {
        short: "s",
        name: "formatters-dir",
        type: "string",
        describe: "formatters directory",
        description: dedent`
            An additional formatters directory, for user-created formatters.
            Formatters are files that will format the tslint output, before
            writing it to stdout or the file passed in --out. The default
            directory, node_modules/tslint/build/formatters, will always be
            checked first, so user-created formatters with the same names
            as the base formatters will not be loaded.`,
    },
    {
        short: "t",
        name: "format",
        type: "string",
        describe: "output format (prose, json, stylish, verbose, pmd, msbuild, checkstyle, vso, fileslist, codeFrame)",
        description: dedent`
            The formatter to use to format the results of the linter before
            outputting it to stdout or the file passed in --out. The core
            formatters are prose (human readable), json (machine readable)
            and verbose. prose is the default if this option is not used.
            Other built-in options include pmd, msbuild, checkstyle, and vso.
            Additional formatters can be added and used if the --formatters-dir
            option is set.`,
    },
    {
        name: "test",
        type: "boolean",
        describe: "test that tslint produces the correct output for the specified directory",
        description: dedent`
            Runs tslint on matched directories and checks if tslint outputs
            match the expected output in .lint files. Automatically loads the
            tslint.json files in the directories as the configuration file for
            the tests. See the full tslint documentation for more details on how
            this can be used to test custom rules.`,
    },
    {
        short: "p",
        name: "project",
        type: "string",
        describe: "tsconfig.json file",
        description: dedent`
            The path or directory containing a tsconfig.json file that will be
            used to determine which files will be linted. This flag also enables
            rules that require the type checker.`,
    },
    {
        name: "type-check",
        type: "boolean",
        describe: "check for type errors before linting the project",
        description: dedent`
            Checks for type errors before linting a project. --project must be
            specified in order to enable type checking.`,
    },
];

const builtinOptions: Option[] = [
    {
        short: "v",
        name: "version",
        type: "boolean",
        describe: "current version",
        description: "The current version of tslint.",
    },
    {
        short: "h",
        name: "help",
        type: "boolean",
        describe: "display detailed help",
        description: "Prints this help message.",
    },
];

commander.version(VERSION, "-v, --version");

for (const option of options) {
    const commanderStr = optionUsageTag(option) + optionParam(option);
    if (option.type === "array") {
        commander.option(commanderStr, option.describe, collect, []);
    } else {
        commander.option(commanderStr, option.describe);
    }
}

commander.on("--help", () => {
    const indent = "\n        ";
    const optionDetails = options.concat(builtinOptions).map((o) =>
        `${optionUsageTag(o)}:${o.description.startsWith("\n") ? o.description.replace(/\n/g, indent) : indent + o.description}`);
    console.log(`tslint accepts the following commandline options:\n\n    ${optionDetails.join("\n\n    ")}\n\n`);
});

// Hack to get unknown option errors to work. https://github.com/visionmedia/commander.js/pull/121
const parsed = commander.parseOptions(process.argv.slice(2));
commander.args = parsed.args;
if (parsed.unknown.length !== 0) {
    (commander.parseArgs as (args: string[], unknown: string[]) => void)([], parsed.unknown);
}
const argv = commander.opts() as any as Argv;

if (!(argv.init || argv.test !== undefined || argv.project !== undefined || commander.args.length > 0)) {
    console.error("No files specified. Use --project to lint a project folder.");
    process.exit(1);
}

if (argv.typeCheck && argv.project === undefined) {
    console.error("--project must be specified in order to enable type checking.");
    process.exit(1);
}

let log: (message: string) => void;
if (argv.out != null) {
    const outputStream = fs.createWriteStream(argv.out, {
        flags: "w+",
        mode: 420,
    });
    log = (message) => outputStream.write(`${message}\n`);
} else {
    log = console.log;
}

run({
    config: argv.config,
    exclude: argv.exclude,
    files: commander.args,
    fix: argv.fix,
    force: argv.force,
    format: argv.format === undefined ? "prose" : argv.format,
    formattersDirectory: argv.formattersDir,
    init: argv.init,
    out: argv.out,
    outputAbsolutePaths: argv.outputAbsolutePaths,
    project: argv.project,
    rulesDirectory: argv.rulesDir,
    test: argv.test,
    typeCheck: argv.typeCheck,
}, {
    log,
    error: (m) => console.error(m),
}).then((rc) => {
    process.exitCode = rc;
}).catch((e) => {
    console.error(e);
    process.exitCode = 1;
});

function optionUsageTag({short, name}: Option) {
    return short !== undefined ? `-${short}, --${name}` : `--${name}`;
}

function optionParam(option: Option) {
    switch (option.type) {
        case "string":
            return ` [${option.name}]`;
        case "array":
            return ` <${option.name}>`;
        case "boolean":
            return "";
    }
}
function collect(val: string, memo: string[]) {
    memo.push(val);
    return memo;
}
