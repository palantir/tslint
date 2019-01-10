/*
 * Copyright 2018 Palantir Technologies, Inc.
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

import { assert } from "chai";
import * as cp from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as semver from "semver";
import { Logger, Options, run, Status } from "../../src/runner";
import { denormalizeWinPath } from "../../src/utils";
import { getNormalizedTypescriptVersion } from "../../src/verify/parse";
import { createTempFile } from "../utils";

// when tests are run with mocha from npm scripts CWD points to project root
const EXECUTABLE_DIR = path.resolve(process.cwd(), "test", "executable");
const EXECUTABLE_PATH = path.resolve(EXECUTABLE_DIR, "npm-like-executable");
const TEMP_JSON_PATH = path.resolve(EXECUTABLE_DIR, "tslint.json");

const dummyLogger: Logger = {
    log() {
        /* do nothing */
    },
    error() {
        /* do nothing */
    },
};

describe("Executable", function(this: Mocha.ISuiteCallbackContext) {
    this.slow(3000); // the executable is JIT-ed each time it runs; avoid showing slowness warnings
    this.timeout(10000);

    const tsVersion = getNormalizedTypescriptVersion();

    describe("Files", () => {
        it("exits with code 1 if no arguments passed", done => {
            execCli([], (err, stdout, stderr) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 1, "error code should be 1");

                assert.include(
                    stderr,
                    "No files specified. Use --project to lint a project folder.",
                    "stderr should contain notification about missing files",
                );
                assert.strictEqual(stdout, "", "shouldn't contain any output in stdout");
                done();
            });
        });

        it("exits with code 0 if correct file is passed", done => {
            execCli(["src/configuration.ts"], err => {
                assert.isNull(err, "process should exit without an error");
                done();
            });
        });

        it("exits with code 0 if several files passed without `-f` flag", done => {
            execCli(["src/configuration.ts", "src/formatterLoader.ts"], err => {
                assert.isNull(err, "process should exit without an error");
                done();
            });
        });

        it("exits with code 1 if removed `-f` flag is passed", done => {
            execCli(
                ["src/configuration.ts", "-f", "src/formatterLoader.ts"],
                (err, stdout, stderr) => {
                    assert.isNotNull(err, "process should exit with error");
                    assert.strictEqual(err.code, 1, "error code should be 1");

                    assert.include(stderr, "error: unknown option `-f'");
                    assert.strictEqual(stdout, "", "shouldn't contain any output in stdout");
                    done();
                },
            );
        });

        it("warns if file does not exist", async () => {
            const result = await execRunnerWithOutput({ files: ["foo/bar.ts"] });
            assert.strictEqual(result.status, Status.Ok, "process should exit without error");
            assert.include(result.stderr, "'foo/bar.ts' does not exist");
        });

        it("doesn't warn if non-existent file is excluded by --exclude", async () => {
            const result = await execRunnerWithOutput({
                exclude: ["**/*.js"],
                files: ["foo/bar.js"],
            });
            assert.strictEqual(result.status, Status.Ok, "process should exit without error");
            assert.notInclude(result.stderr, "does not exist");
        });

        it("doesn't warn if glob pattern doesn't match any file", async () => {
            const result = await execRunnerWithOutput({ files: ["foobar/*.js"] });
            assert.strictEqual(result.status, Status.Ok, "process should exit without error");
            assert.notInclude(result.stderr, "does not exist");
        });
    });

    describe("Configuration file", () => {
        it("exits with code 0 if relative path is passed without `./`", async () => {
            const status = await execRunner({
                config: "test/config/tslint-almost-empty.json",
                files: ["src/test.ts"],
            });
            assert.equal(status, Status.Ok, "process should exit without an error");
        });

        it("exits with code 0 if config file that extends relative config file", async () => {
            const status = await execRunner({
                config: "test/config/tslint-extends-package-no-mod.json",
                files: ["src/test.ts"],
            });
            assert.equal(status, Status.Ok, "process should exit without an error");
        });

        it("exits with code 1 if config file is invalid", async () => {
            const result = await execRunnerWithOutput({
                config: "test/config/tslint-invalid.json",
                files: ["src/test.ts"],
            });

            assert.equal(result.status, Status.FatalError, "process should exit with error");
            assert.include(
                result.stderr,
                "Failed to load",
                "stderr should contain notification about failing to load json config",
            );
            assert.strictEqual(result.stdout, "", "shouldn't contain any output in stdout");
        });

        it("exits with code 1 if yaml config file is invalid", async () => {
            const result = await execRunnerWithOutput({
                config: "test/config/tslint-invalid.yaml",
                files: ["src/test.ts"],
            });
            assert.strictEqual(result.status, Status.FatalError, "error code should be 1");

            assert.include(
                result.stderr,
                "Failed to load",
                "stderr should contain notification about failing to load yaml config",
            );
            assert.strictEqual(result.stdout, "", "shouldn't contain any output in stdout");
        });

        it("mentions the root cause if a config file extends from an invalid file", async () => {
            const result = await execRunnerWithOutput({
                config: "test/config/tslint-extends-invalid.json",
                files: ["src/test.ts"],
            });

            assert.equal(result.status, Status.FatalError, "process should exit with error");
            assert.include(
                result.stderr,
                "Failed to load",
                "stderr should contain notification about failing to load json config",
            );
            assert.include(
                result.stderr,
                "tslint-invalid.json",
                "stderr should mention the problem file",
            );
            assert.strictEqual(result.stdout, "", "shouldn't contain any output in stdout");
        });
    });

    describe("Custom formatters", () => {
        const createFormatVerifier = (done: MochaDone): ExecFileCallback => (err, stdout) => {
            assert.isNotNull(err, "process should exit with error");
            assert.strictEqual(err.code, 2, "error code should be 2");
            assert.include(
                stdout,
                "hello from custom formatter",
                "stdout should contain output of custom formatter",
            );
            done();
        };

        it("can be loaded from node_modules", done => {
            execCli(
                [
                    "-c",
                    "tslint-custom-rules-with-dir.json",
                    "../../src/test.ts",
                    "-t",
                    "tslint-test-custom-formatter",
                ],
                {
                    cwd: "./test/config",
                },
                createFormatVerifier(done),
            );
        });

        it("can be specified from config", done => {
            execCli(
                ["-c", "tslint-custom-rules-with-dir-and-format.json", "../../src/test.ts"],
                {
                    cwd: "./test/config",
                },
                createFormatVerifier(done),
            );
        });
    });

    describe("Custom rules", () => {
        it("exits with code 1 if nonexisting custom rules directory is passed", async () => {
            const status = await execRunner({
                config: "./test/config/tslint-custom-rules.json",
                files: ["src/test.ts"],
                rulesDirectory: "./someRandomDir",
            });
            assert.equal(status, Status.FatalError, "error code should be 1");
        });

        it("exits with code 2 if custom rules directory is passed and file contains lint errors", async () => {
            const status = await execRunner({
                config: "./test/config/tslint-custom-rules.json",
                files: ["src/test.ts"],
                rulesDirectory: "./test/files/custom-rules",
            });
            assert.equal(status, Status.LintError, "error code should be 2");
        });

        it("exits with code 0 if custom rules directory is passed and file contains lint warnings", async () => {
            const status = await execRunner({
                config: "./test/config/tslint-extends-package-warning.json",
                files: ["src/test.ts"],
                rulesDirectory: "./test/files/custom-rules",
            });
            assert.equal(status, Status.Ok, "process should exit without an error");
        });

        it("exits with code 2 if custom rules directory is specified in config file and file contains lint errors", async () => {
            const status = await execRunner({
                config: "./test/config/tslint-custom-rules-with-dir.json",
                files: ["src/test.ts"],
            });
            assert.equal(status, Status.LintError, "error code should be 2");
        });

        it("are compiled just in time when using ts-node", done => {
            execCli(
                ["-c", "./test/config/tslint-custom-rules-uncompiled.json", "src/test.ts"],
                {
                    env: {
                        ...process.env, // tslint:disable-line:no-unsafe-any
                        NODE_OPTIONS: "-r ts-node/register",
                        TS_NODE_CACHE: "0",
                        TS_NODE_FAST: "1",
                    },
                },
                err => {
                    assert.isNull(err, "process should exit without an error");
                    done();
                },
            );
        });
    });

    describe("Config with excluded files", () => {
        it("exits with code 2 if linter options doesn't exclude file with lint errors", async () => {
            const status = await execRunner({
                config: "./test/files/config-exclude/tslint-exclude-one.json",
                files: ["./test/files/config-exclude/included.ts"],
            });
            assert.equal(status, Status.LintError, "error code should be 2");
        });

        it("exits with code 0 if linter options exclude one file with lint errors", async () => {
            const status = await execRunner({
                config: "./test/files/config-exclude/tslint-exclude-one.json",
                files: ["./test/files/config-exclude/excluded.ts"],
            });
            assert.equal(status, Status.Ok, "process should exit without an error");
        });

        it("exits with code 0 if linter options excludes many files with lint errors", async () => {
            const status = await execRunner({
                config: "./test/files/config-exclude/tslint-exclude-many.json",
                files: [
                    "./test/rules/config-exclude/excluded1.ts",
                    "./test/rules/config-exclude/subdir/excluded2.ts",
                ],
            });
            assert.strictEqual(status, Status.Ok, "process should exit without an error");
        });

        it("excludes files relative to tslint.json", async () => {
            const status = await execRunner({
                config: "./test/files/config-exclude/tslint-exclude-one.json",
                files: ["./test/files/config-exclude/subdir/excluded.ts"],
            });
            assert.equal(status, Status.LintError, "exit code should be 2");
        });

        it("excludes files relative to tslint.json they were declared in", async () => {
            const status = await execRunner({
                config: "./test/files/config-exclude/subdir/tslint-extending.json",
                files: ["./test/files/config-exclude/subdir/excluded.ts"],
            });
            assert.equal(status, Status.LintError, "exit code should be 2");
        });
    });

    it("finds configuration above current directory", done => {
        execCli(
            ["index.test.ts"],
            {
                cwd: "./test/files/config-findup/no-config",
            },
            err => {
                assert.isNotNull(err, "process should exit with an error");
                assert.equal(err.code, 2, "exit code should be 2");
                done();
            },
        );
    });

    describe("--fix flag", () => {
        it("fixes multiple rules without overwriting each other", async () => {
            const tempFile = path.relative(process.cwd(), createTempFile("ts"));
            fs.writeFileSync(
                tempFile,
                'import * as x from "b"\nimport * as y from "a_long_module";\n',
            );
            const result = await execRunnerWithOutput({
                config: "test/files/multiple-fixes-test/tslint.json",
                files: [tempFile],
                fix: true,
            });
            const content = fs.readFileSync(tempFile, "utf8");
            // compare against file name which will be returned by formatter (used in TypeScript)
            const denormalizedFileName = denormalizeWinPath(tempFile);
            fs.unlinkSync(tempFile);
            assert.equal(result.status, Status.Ok, "process should exit without an error");
            assert.strictEqual(
                content,
                'import * as y from "a_long_module";\nimport * as x from "b";\n',
            );
            assert.strictEqual(result.stdout.trim(), `Fixed 2 error(s) in ${denormalizedFileName}`);
        }).timeout(8000);
    });

    describe("--force flag", () => {
        it("exits with code 0 if `--force` flag is passed", async () => {
            const result = await execRunnerWithOutput({
                config: "./test/config/tslint-custom-rules.json",
                files: ["src/test.ts"],
                force: true,
                rulesDirectory: "./test/files/custom-rules",
            });
            assert.equal(result.status, Status.Ok, "process should exit without an error");
            assert.include(result.stdout, "failure", "errors should be reported");
        });
    });

    describe("--test flag", () => {
        it("exits with code 0 if `--test` flag is used", async () => {
            const status = await execRunner({ test: true, files: ["test/rules/no-eval"] });
            assert.equal(status, Status.Ok, "process should exit without an error");
        });

        it("exits with code 0 if `--test` flag is used with a wildcard", async () => {
            const status = await execRunner({ test: true, files: ["test/rules/no-e*"] });
            assert.equal(status, Status.Ok, "process should exit without an error");
        });

        it("exits with code 1 if `--test` flag is used with incorrect rule", async () => {
            const status = await execRunner({
                files: ["test/files/incorrect-rule-test"],
                test: true,
            });
            assert.equal(status, Status.FatalError, "error code should be 1");
        });

        it("exits with code 1 if `--test` flag is used with incorrect rule in a wildcard", async () => {
            const status = await execRunner({ test: true, files: ["test/files/incorrect-rule-*"] });
            assert.equal(status, Status.FatalError, "error code should be 1");
        });

        it("exits with code 0 if `--test` flag is used with custom rule", async () => {
            const status = await execRunner({
                files: ["test/files/custom-rule-rule-test"],
                test: true,
            });
            assert.equal(status, Status.Ok, "process should exit without an error");
        });

        it("exits with code 0 if `--test` and `-r` flags are used with custom rule", async () => {
            const status = await execRunner({
                files: ["test/files/custom-rule-cli-rule-test"],
                rulesDirectory: "test/files/custom-rules-2",
                test: true,
            });
            assert.equal(status, Status.Ok, "process should exit without an error");
        });

        it("exits with code 0 if `--test` flag is used with fixes", async () => {
            const status = await execRunner({ test: true, files: ["test/files/fixes-test"] });
            assert.equal(status, Status.Ok, "process should exit without an error");
        });

        it("exits with code 1 if `--test` flag is used with incorrect fixes", async () => {
            const status = await execRunner({
                files: ["test/files/incorrect-fixes-test"],
                test: true,
            });
            assert.equal(status, Status.FatalError, "error code should be 1");
        });

        it("can be used with multiple paths", async () => {
            // pass a failing test as second path to make sure it gets executed
            const status = await execRunner({
                files: ["test/files/custom-rule-rule-test", "test/files/incorrect-fixes-test"],
                test: true,
            });
            assert.equal(status, Status.FatalError, "error code should be 1");
        });
    });

    describe("--project flag", () => {
        it("exits with code 0 if `tsconfig.json` is passed and it specifies files without errors", async () => {
            const status = await execRunner({
                config: "test/files/tsconfig-test/tslint.json",
                project: "test/files/tsconfig-test/tsconfig.json",
            });
            assert.equal(status, Status.Ok, "process should exit without an error");
        });

        it("can be passed a directory and defaults to tsconfig.json", async () => {
            const status = await execRunner({
                config: "test/files/tsconfig-test/tslint.json",
                project: "test/files/tsconfig-test",
            });
            assert.equal(status, Status.Ok, "process should exit without an error");
        });

        it("exits with error if passed a directory and there is not tsconfig.json", async () => {
            const status = await execRunner({
                config: "test/files/tsconfig-test/tslint.json",
                project: "test/files",
            });
            assert.equal(status, Status.FatalError, "exit code should be 1");
        });

        it("exits with error if passed directory does not exist", async () => {
            const status = await execRunner({
                config: "test/files/tsconfig-test/tslint.json",
                project: "test/files/non-existent",
            });
            assert.equal(status, Status.FatalError, "exit code should be 1");
        });

        it("exits with code 1 if file is not included in project", async () => {
            const status = await execRunner({
                config: "test/files/tsconfig-test/tslint.json",
                files: ["test/files/tsconfig-test/other.test.ts"],
                project: "test/files/tsconfig-test/tsconfig.json",
            });
            assert.equal(status, Status.FatalError, "exit code should be 1");
        });

        it("exits with code 0 if `tsconfig.json` is passed but it includes no ts files", async () => {
            const status = await execRunner({
                config: "test/files/tsconfig-no-ts-files/tslint.json",
                project: "test/files/tsconfig-no-ts-files/tsconfig.json",
            });
            assert.equal(status, Status.Ok, "process should exit without an error");
        });

        it("can extend `tsconfig.json` with relative path", async () => {
            const status1 = await execRunner({
                config: "test/files/tsconfig-extends-relative/tslint-ok.json",
                project: "test/files/tsconfig-extends-relative/test/tsconfig.json",
            });
            assert.equal(status1, Status.Ok, "process should exit without an error");
            const status2 = await execRunner({
                config: "test/files/tsconfig-extends-relative/tslint-fail.json",
                project: "test/files/tsconfig-extends-relative/test/tsconfig.json",
            });
            assert.equal(status2, Status.LintError, "exit code should be 2");
        });

        it("warns if file-to-lint does not exist", async () => {
            const result = await execRunnerWithOutput({
                files: ["test/files/tsconfig-test/non-existent.test.ts"],
                project: "test/files/tsconfig-test/tsconfig.json",
            });
            assert.strictEqual(result.status, Status.Ok, "process should exit without error");
            assert.include(
                result.stderr,
                `${path.normalize(
                    "test/files/tsconfig-test/non-existent.test.ts",
                )}' does not exist`,
            );
        });

        it("doesn't warn for non-existent file-to-lint if excluded by --exclude", async () => {
            const result = await execRunnerWithOutput({
                exclude: ["**/*"],
                files: ["test/files/tsconfig-test/non-existent.test.ts"],
                project: "test/files/tsconfig-test/tsconfig.json",
            });
            assert.strictEqual(result.status, Status.Ok, "process should exit without error");
            assert.notInclude(result.stderr, "does not exist");
        });

        it("doesn't warn if glob pattern doesn't match any file", async () => {
            const result = await execRunnerWithOutput({
                files: ["*.js"],
                project: "test/files/tsconfig-test/tsconfig.json",
            });
            assert.strictEqual(result.status, Status.Ok, "process should exit without error");
            assert.notInclude(result.stderr, "does not exist");
        });

        it("reports errors from parsing tsconfig.json", async () => {
            const result = await execRunnerWithOutput({
                project: "test/files/tsconfig-invalid/syntax-error.json",
            });
            assert.strictEqual(result.status, Status.FatalError, "exit code should be 1");
            assert.include(result.stderr, "error TS");
        });

        it("reports errors from validating tsconfig.json", async () => {
            const result = await execRunnerWithOutput({
                project: "test/files/tsconfig-invalid/empty-files.json",
            });
            assert.strictEqual(result.status, Status.FatalError, "exit code should be 1");
            assert.include(result.stderr, "error TS");
        });

        it("does not report an error if tsconfig.json matches no files", async () => {
            const status = await execRunner({
                project: "test/files/tsconfig-invalid/no-match.json",
            });
            assert.strictEqual(status, Status.Ok, "process should exit without an error");
        });

        it("can execute typed rules without --type-check", async () => {
            const status = await execRunner({ project: "test/files/typed-rule/tsconfig.json" });
            assert.equal(status, Status.LintError, "exit code should be 2");
        });

        it("handles 'allowJs' correctly", async () => {
            const status = await execRunner({
                project: "test/files/tsconfig-allow-js/tsconfig.json",
            });
            assert.equal(status, Status.LintError, "exit code should be 2");
        });

        it("doesn't lint external dependencies with 'allowJs'", async () => {
            const status = await execRunner({
                project: "test/files/allow-js-exclude-node-modules/tsconfig.json",
            });
            assert.equal(status, Status.Ok, "process should exit without error");
        });

        it("works with '--exclude'", async () => {
            const status = await execRunner({
                exclude: ["test/files/tsconfig-allow-js/testfile.test.js"],
                project: "test/files/tsconfig-allow-js/tsconfig.json",
            });
            assert.equal(status, Status.Ok, "process should exit without an error");
        });

        it("can apply fixes from multiple rules", async () => {
            fs.writeFileSync(
                "test/files/project-multiple-fixes/testfile.test.ts",
                fs.readFileSync("test/files/project-multiple-fixes/before.test.ts", "utf-8"),
            );
            const status = await execRunner({
                fix: true,
                project: "test/files/project-multiple-fixes/",
            });
            const actual = fs.readFileSync(
                "test/files/project-multiple-fixes/testfile.test.ts",
                "utf-8",
            );
            fs.unlinkSync("test/files/project-multiple-fixes/testfile.test.ts");
            assert.equal(status, Status.Ok, "process should exit without an error");
            assert.strictEqual(
                actual,
                fs.readFileSync("test/files/project-multiple-fixes/after.test.ts", "utf-8"),
            );
        }).timeout(8000);

        if (semver.satisfies(tsVersion, ">=2.9")) {
            it("does not try to parse JSON files with --resolveJsonModule with TS >= 2.9", async () => {
                const status = await execRunner({project: "test/files/tsconfig-resolve-json-module/tsconfig.json"});
                assert.equal(status, Status.Ok, "process should exit without an error");
            });
        }
    });

    describe("--type-check", () => {
        it("exits with code 1 if --project is not passed", done => {
            execCli(["--type-check"], err => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 1, "error code should be 1");
                done();
            });
        });
    });

    describe("--init flag", () => {
        // remove temp file before calling tslint --init
        beforeEach(cleanTempInitFile);
        // clean up temp file after tests
        afterEach(cleanTempInitFile);

        it("exits with code 0 if `--init` flag is used in folder without tslint.json", done => {
            execCli(["--init"], { cwd: EXECUTABLE_DIR }, err => {
                assert.isNull(err, "process should exit without an error");
                assert.strictEqual(fs.existsSync(TEMP_JSON_PATH), true, "file should be created");
                done();
            });
        });

        it("exits with code 1 if `--init` flag is used in folder with tslint.json", done => {
            // make sure that file exists before test
            fs.writeFileSync(TEMP_JSON_PATH, "{}");

            execCli(["--init"], { cwd: EXECUTABLE_DIR }, err => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 1, "error code should be 1");
                done();
            });
        });
    });

    describe("globs and quotes", () => {
        // when glob pattern is passed without quotes in npm script `process.env` will contain:
        // on Windows - pattern string without any quotes
        // on Linux - list of files that matches glob (may differ from `glob` module results)

        it("exits with code 2 if correctly finds file containing lint errors when glob is in double quotes", async () => {
            // when glob pattern is passed in double quotes in npm script `process.env` will contain:
            // on Windows - pattern string without any quotes
            // on Linux - pattern string without any quotes (glob is not expanded)
            const status = await execRunner({
                config: "./test/config/tslint-custom-rules.json",
                files: ["src/**/test.ts"],
                rulesDirectory: "./test/files/custom-rules",
            });
            assert.equal(status, Status.LintError, "error code should be 2");
        });

        it("exits with code 2 if correctly finds file containing lint errors when glob is in single quotes", async () => {
            // when glob pattern is passed in single quotes in npm script `process.env` will contain:
            // on Windows - pattern string wrapped in single quotes
            // on Linux - pattern string without any quotes (glob is not expanded)
            const status = await execRunner({
                config: "./test/config/tslint-custom-rules.json",
                files: ["'src/**/test.ts'"],
                rulesDirectory: "./test/files/custom-rules",
            });
            assert.equal(status, Status.LintError, "error code should be 2");
        });

        it("can handle multiple '--exclude' globs", done => {
            execCli(
                [
                    "-c",
                    "test/files/multiple-excludes/tslint.json",
                    "--exclude",
                    "'test/files/multiple-excludes/invalid.test.ts'",
                    "--exclude",
                    "'test/files/multiple-excludes/invalid2*'",
                    "'test/files/multiple-excludes/**.ts'",
                ],
                err => {
                    assert.isNull(err, "process should exit without an error");
                    done();
                },
            );
        });
    });
});

type ExecFileCallback = (error: Error & { code: number }, stdout: string, stderr: string) => void;

function execCli(args: string[], cb: ExecFileCallback): cp.ChildProcess;
function execCli(
    args: string[],
    options: cp.ExecFileOptions,
    cb: ExecFileCallback,
): cp.ChildProcess;
function execCli(
    args: string[],
    options: cp.ExecFileOptions | ExecFileCallback,
    cb?: ExecFileCallback,
): cp.ChildProcess {
    let filePath = EXECUTABLE_PATH;

    // Specify extension for Windows executable to avoid ENOENT errors
    if (os.platform() === "win32") {
        filePath += ".cmd";
    }

    if (isFunction(options)) {
        cb = options;
        options = {};
    }

    return cp.execFile(filePath, args, options, (error, stdout, stderr) => {
        if (cb === undefined) {
            throw new Error("cb not defined");
        }
        cb(error as Error & { code: number }, stdout.trim(), stderr.trim());
    });
}

// tslint:disable-next-line:promise-function-async
function execRunnerWithOutput(options: Partial<Options>) {
    let stdout = "";
    let stderr = "";
    return execRunner(options, {
        log(text) {
            stdout += text;
        },
        error(text) {
            stderr += text;
        },
    }).then(status => ({ status, stderr, stdout }));
}

// tslint:disable-next-line:promise-function-async
function execRunner(options: Partial<Options>, logger: Logger = dummyLogger) {
    return run({ exclude: [], files: [], ...options }, logger);
}

// tslint:disable-next-line:ban-types
function isFunction(fn: any): fn is Function {
    return {}.toString.call(fn) === "[object Function]";
}

function cleanTempInitFile(): void {
    if (fs.existsSync(TEMP_JSON_PATH)) {
        fs.unlinkSync(TEMP_JSON_PATH);
    }
}
