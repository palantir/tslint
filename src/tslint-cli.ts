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

// tslint:disable object-literal-sort-keys

import * as fs from "fs";

import { IRunnerOptions, Runner } from "./runner";
import { dedent } from "./utils";

interface Argv {
    files: string[];
    config?: string;
    exclude?: string;
    fix?: boolean;
    force?: boolean;
    help?: boolean;
    init?: boolean;
    out?: string;
    project?: string;
    "rules-dir"?: string;
    "formatters-dir"?: string;
    format?: string;
    "type-check"?: boolean;
    test?: string;
    version?: boolean;
}

interface Option {
    short?: string;
    name: keyof Argv;
    type: "string" | "boolean";
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
        type: "string",
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
            The location of a tsconfig.json file that will be used to determine which
            files will be linted.`,
    },
    {
        name: "type-check",
        type: "boolean",
        describe: "enable type checking when linting a project",
        description: dedent`
            Enables the type checker when running linting rules. --project must be
            specified in order to enable type checking.`,
    },
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

function parseOptions(argv: string[]): Argv {
    const files: string[] = [];
    const res: Argv = { files };
    let i = 0;
    for (; i < argv.length; i++) {
        const arg = argv[i];
        if (arg.startsWith("--")) {
            const x = arg.slice(2);
            handleOption((o) => o.name === x);
        } else if (arg.startsWith("-")) {
            const x = arg.slice(1);
            if (x === "f") {
                throw exit("-f option is no longer available. Supply files directly to the tslint command instead.");
            }
            handleOption((o) => o.short === x);
        } else {
            files.push(arg);
        }
    }
    return res;

    function handleOption(pred: (option: Option) => boolean) {
        const option = options.find(pred);
        if (!option) {
            throw exit(`No such option '${argv[i]}'\n\n${help()}`);
        }
        switch (option.type) {
            case "boolean":
                res[option.name] = true;
                break;
            case "string":
                i++;
                if (i === argv.length) {
                    throw exit(`Must provide a value for ${option.name}`);
                }
                res[option.name] = argv[i];
                break;
        }
    }
}
const argv = parseOptions(process.argv.slice(2));
if (!(argv.help || argv.init || argv.test || argv.version || argv.project || argv.files.length > 0)) {
    exit("Missing files");
}

let outputStream: NodeJS.WritableStream;
if (argv.out != null) {
    outputStream = fs.createWriteStream(argv.out, {
        flags: "w+",
        mode: 420,
    });
} else {
    outputStream = process.stdout;
}

if (argv.help) {
    const optionDetails = options.map((o) =>
        `${optionUsageTag(o)}:` + o.description.replace(/\n/g, "\n        "));
    const detailedHelp = `${help()}\n\ntslint accepts the following commandline options:\n\n    ${optionDetails.join("\n\n    ")}\n\n`;
    outputStream.write(detailedHelp);
    process.exit(0);
}

const runnerOptions: IRunnerOptions = {
    config: argv.config,
    exclude: argv.exclude,
    files: argv.files,
    fix: argv.fix,
    force: argv.force,
    format: argv.format || "prose",
    formattersDirectory: argv["formatters-dir"],
    init: argv.init,
    out: argv.out,
    project: argv.project,
    rulesDirectory: argv["rules-dir"],
    test: argv.test,
    typeCheck: argv["type-check"],
    version: argv.version,
};

new Runner(runnerOptions, outputStream)
    .run((status: number) => process.exit(status));

function optionUsageTag({short, name}: Option) {
    return short !== undefined ? `-${short}, --${name}` : `--${name}`;
}

function help() {
    const maxLen = Math.max(...options.map((o) => optionUsageTag(o).length));
    return "Usage: tslint [options] file ...\n\nOptions:\n  " + options.map((o) =>
        rpad(optionUsageTag(o), maxLen + 2) + o.describe).join("\n  ");
}

function exit(msg: string): void {
    console.error(msg);
    process.exit(1);
}

function rpad(str: string, length: number) {
    return str + " ".repeat(length - str.length);
}
