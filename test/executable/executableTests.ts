/*
 * Copyright 2016 Palantir Technologies, Inc.
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
import { denormalizeWinPath } from "../../src/utils";
import { createTempFile } from "../utils";

// when tests are run with mocha from npm scripts CWD points to project root
const EXECUTABLE_DIR = path.resolve(process.cwd(), "test", "executable");
const EXECUTABLE_PATH = path.resolve(EXECUTABLE_DIR, "npm-like-executable");
const TEMP_JSON_PATH = path.resolve(EXECUTABLE_DIR, "tslint.json");

describe("Executable", function(this: Mocha.ISuiteCallbackContext) {
    this.slow(3000);    // the executable is JIT-ed each time it runs; avoid showing slowness warnings
    this.timeout(4000);

    describe("Files", () => {
        it("exits with code 1 if no arguments passed", (done) => {
            execCli([], (err, stdout, stderr) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 1, "error code should be 1");

                assert.include(
                    stderr,
                    "No files specified. Use --project to lint a project folder.",
                    "stderr should contain notification about missing files");
                assert.strictEqual(stdout, "", "shouldn't contain any output in stdout");
                done();
            });
        });

        it("exits with code 0 if correct file is passed", (done) => {
            execCli(["src/configuration.ts"], (err) => {
                assert.isNull(err, "process should exit without an error");
                done();
            });
        });

        it("exits with code 0 if several files passed without `-f` flag", (done) => {
            execCli(["src/configuration.ts", "src/formatterLoader.ts"], (err) => {
                assert.isNull(err, "process should exit without an error");
                done();
            });
        });

        it("exits with code 1 if removed `-f` flag is passed", (done) => {
            execCli(["src/configuration.ts", "-f", "src/formatterLoader.ts"], (err, stdout, stderr) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 1, "error code should be 1");

                assert.include(stderr, "error: unknown option `-f'");
                assert.strictEqual(stdout, "", "shouldn't contain any output in stdout");
                done();
            });
        });
    });

    describe("Configuration file", () => {
        it("exits with code 0 if relative path is passed without `./`", (done) => {
            execCli(["-c", "test/config/tslint-almost-empty.json", "src/test.ts"], (err) => {
                assert.isNull(err, "process should exit without an error");
                done();
            });
        });

        it("exits with code 0 if config file that extends relative config file", (done) => {
            execCli(["-c", "test/config/tslint-extends-package-no-mod.json", "src/test.ts"], (err) => {
                assert.isNull(err, "process should exit without an error");
                done();
            });
        });

        it("exits with code 1 if config file is invalid", (done) => {
            execCli(["-c", "test/config/tslint-invalid.json", "src/test.ts"], (err, stdout, stderr) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 1, "error code should be 1");

                assert.include(stderr, "Failed to load", "stderr should contain notification about failing to load json");
                assert.strictEqual(stdout, "", "shouldn't contain any output in stdout");
                done();
            });
        });

        it("mentions the root cause if a config file extends from an invalid file", (done) => {
            execCli(["-c", "test/config/tslint-extends-invalid.json", "src/test.ts"], (err, stdout, stderr) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 1, "error code should be 1");

                assert.include(stderr, "Failed to load", "stderr should contain notification about failing to load json");
                assert.include(stderr, "tslint-invalid.json", "stderr should mention the problem file");
                assert.strictEqual(stdout, "", "shouldn't contain any output in stdout");
                done();
            });
        });
    });

    describe("Custom rules", () => {
        it("exits with code 1 if nonexisting custom rules directory is passed", (done) => {
            execCli(["-c", "./test/config/tslint-custom-rules.json", "-r", "./someRandomDir", "src/test.ts"], (err) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 1, "error code should be 1");
                done();
            });
        });

        it("exits with code 2 if custom rules directory is passed and file contains lint errors", (done) => {
            execCli(["-c", "./test/config/tslint-custom-rules.json", "-r", "./test/files/custom-rules", "src/test.ts"], (err) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 2, "error code should be 2");
                done();
            });
        });

        it("exits with code 0 if custom rules directory is passed and file contains lint warnings", (done) => {
            execCli(
                ["-c", "./test/config/tslint-extends-package-warning.json", "-r", "./test/files/custom-rules", "src/test.ts"],
                (err) => {
                    assert.isNull(err, "process should exit without an error");
                    done();
                },
            );
        });

        it("exits with code 2 if custom rules directory is specified in config file and file contains lint errors", (done) => {
            execCli(["-c", "./test/config/tslint-custom-rules-with-dir.json", "src/test.ts"], (err) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 2, "error code should be 2");
                done();
            });
        });

        it("are compiled just in time when using ts-node", (done) => {
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
                (err) => {
                    assert.isNull(err, "process should exit without an error");
                    done();
                },
            );
        });
    });

    describe("Config with excluded files", () => {
        it("exits with code 2 if linter options doesn't exclude file with lint errors", (done) => {
            execCli(["-c", "./test/files/config-exclude/tslint-exclude-one.json", "./test/files/config-exclude/included.ts"], (err) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 2, "error code should be 2");
                done();
            });
        });

        it("exits with code 0 if linter options exclude one file with lint errors", (done) => {
            execCli(["-c", "./test/files/config-exclude/tslint-exclude-one.json", "./test/rules/config-exclude/excluded.ts"], (err) => {
                assert.isNull(err, "process should exit without an error");
                done();
            });
        });

        it("exits with code 0 if linter options excludes many files with lint errors", (done) => {
            execCli(
                [
                    "-c",
                    "./test/files/config-exclude/tslint-exclude-many.json",
                    "./test/rules/config-exclude/excluded1.ts",
                    "./test/rules/config-exclude/subdir/excluded2.ts"],
                (err) => {
                    assert.isNull(err, "process should exit without an error");
                    done();
                },
            );
        });

        it("excludes files relative to tslint.json", (done) => {
            execCli(
                ["-c", "./test/files/config-exclude/tslint-exclude-one.json", "./test/files/config-exclude/subdir/excluded.ts"],
                (err) => {
                    assert.isNotNull(err, "process should exit an error");
                    assert.equal(err.code, 2, "exit code should be 2");
                    done();
                },
            );
        });

        it("excludes files relative to tslint.json they were declared in", (done) => {
            execCli(
                ["-c", "./test/files/config-exclude/subdir/tslint-extending.json", "./test/files/config-exclude/subdir/excluded.ts"],
                (err) => {
                    assert.isNotNull(err, "process should exit an error");
                    assert.equal(err.code, 2, "exit code should be 2");
                    done();
                },
            );
        });
    });

    it("finds configuration above current directory", (done) => {
        execCli(
            ["index.test.ts"],
            {
                cwd: "./test/files/config-findup/no-config",
            },
            (err) => {
                assert.isNotNull(err, "process should exit with an error");
                assert.equal(err.code, 2, "exit code should be 2");
                done();
            },
        );
    });

    describe("--fix flag", () => {
        it("fixes multiple rules without overwriting each other", (done) => {
            const tempFile = path.relative(process.cwd(), createTempFile("ts"));
            fs.createReadStream("test/files/multiple-fixes-test/multiple-fixes.test.ts")
                .pipe(fs.createWriteStream(tempFile))
                .on("finish", () => {
                    execCli(
                        ["-c", "test/files/multiple-fixes-test/tslint.json", tempFile, "--fix"],
                        (err, stdout) => {
                            const content = fs.readFileSync(tempFile, "utf8");
                            // compare against file name which will be returned by formatter (used in TypeScript)
                            const denormalizedFileName = denormalizeWinPath(tempFile);
                            fs.unlinkSync(tempFile);
                            assert.strictEqual(content, "import * as y from \"a_long_module\";\nimport * as x from \"b\";\n");
                            assert.isNull(err, "process should exit without an error");
                            assert.strictEqual(stdout, `Fixed 2 error(s) in ${denormalizedFileName}`);
                            done();
                        });
                });
        }).timeout(8000);
    });

    describe("--force flag", () => {
        it("exits with code 0 if `--force` flag is passed", (done) => {
            execCli(
                ["-c", "./test/config/tslint-custom-rules.json", "-r", "./test/files/custom-rules", "--force", "src/test.ts"],
                (err, stdout) => {
                    assert.isNull(err, "process should exit without an error");
                    assert.include(stdout, "failure", "errors should be reported");
                    done();
                });
        });
    });

    describe("--test flag", () => {
        it("exits with code 0 if `--test` flag is used", (done) => {
            execCli(["--test", "test/rules/no-eval"], (err) => {
                assert.isNull(err, "process should exit without an error");
                done();
            });
        });

        it("exits with code 0 if `--test` flag is used with a wildcard", (done) => {
            execCli(["--test", "test/rules/no-e*"], (err) => {
                assert.isNull(err, "process should exit without an error");
                done();
            });
        });

        it("exits with code 1 if `--test` flag is used with incorrect rule", (done) => {
            execCli(["--test", "test/files/incorrect-rule-test"], (err) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 1, "error code should be 1");
                done();
            });
        });

        it("exits with code 1 if `--test` flag is used with incorrect rule in a wildcard", (done) => {
            execCli(["--test", "test/files/incorrect-rule-*"], (err) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 1, "error code should be 1");
                done();
            });
        });

        it("exits with code 0 if `--test` flag is used with custom rule", (done) => {
            execCli(["--test", "test/files/custom-rule-rule-test"], (err) => {
                assert.isNull(err, "process should exit without an error");
                done();
            });
        });

        it("exits with code 0 if `--test` and `-r` flags are used with custom rule", (done) => {
            execCli(["-r", "test/files/custom-rules-2", "--test", "test/files/custom-rule-rule-test"], (err) => {
                assert.isNull(err, "process should exit without an error");
                done();
            });
        });

        it("exits with code 0 if `--test` flag is used with fixes", (done) => {
            execCli(["--test", "test/files/fixes-test"], (err) => {
                assert.isNull(err, "process should exit without an error");
                done();
            });
        });

        it("exits with code 1 if `--test` flag is used with incorrect fixes", (done) => {
            execCli(["--test", "test/files/incorrect-fixes-test"], (err) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 1, "error code should be 1");
                done();
            });
        });

        it("can be used with multiple paths", (done) => {
            // pass a failing test as second path to make sure it gets executed
            execCli(["--test", "test/files/custom-rule-rule-test", "test/files/incorrect-fixes-test"], (err) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 1, "error code should be 1");
                done();
            });
        });
    });

    describe("--project flag", () => {
        it("exits with code 0 if `tsconfig.json` is passed and it specifies files without errors", (done) => {
            execCli(["-c", "test/files/tsconfig-test/tslint.json", "--project", "test/files/tsconfig-test/tsconfig.json"], (err) => {
                assert.isNull(err, "process should exit without an error");
                done();
            });
        });

        it("can be passed a directory and defaults to tsconfig.json", (done) => {
            execCli(["-c", "test/files/tsconfig-test/tslint.json", "--project", "test/files/tsconfig-test"], (err) => {
                assert.isNull(err, "process should exit without an error");
                done();
            });
        });

        it("exits with error if passed a directory and there is not tsconfig.json", (done) => {
            execCli(["-c", "test/files/tsconfig-test/tslint.json", "--project", "test/files"], (err) => {
                assert.isNotNull(err, "process should exit with an error");
                assert.strictEqual(err.code, 1, "error code should be 1");
                done();
            });
        });

        it("exits with error if passed directory does not exist", (done) => {
            execCli(["-c", "test/files/tsconfig-test/tslint.json", "--project", "test/files/non-existant"], (err) => {
                assert.isNotNull(err, "process should exit with an error");
                assert.strictEqual(err.code, 1, "error code should be 1");
                done();
            });
        });

        it("exits with code 1 if file is not included in project", (done) => {
            execCli(
                [
                    "-c",
                    "test/files/tsconfig-test/tslint.json",
                    "--project",
                    "test/files/tsconfig-test/tsconfig.json",
                    "test/files/tsconfig-test/other.test.ts",
                ],
                (err) => {
                    assert.isNotNull(err, "process should exit with error");
                    assert.strictEqual(err.code, 1, "error code should be 1");
                    done();
                });
        });

        it("exits with code 0 if `tsconfig.json` is passed but it includes no ts files", (done) => {
            execCli(
                ["-c", "test/files/tsconfig-no-ts-files/tslint.json", "-p", "test/files/tsconfig-no-ts-files/tsconfig.json"],
                (err) => {
                    assert.isNull(err, "process should exit without an error");
                    done();
                });
        });

        it("can extend `tsconfig.json` with relative path", (done) => {
            execCli(
                ["-c", "test/files/tsconfig-extends-relative/tslint-ok.json", "-p",
                 "test/files/tsconfig-extends-relative/test/tsconfig.json"],
                (err) => {
                    assert.isNull(err, "process should exit without an error");
                    done();
                });
        });

        it("can extend `tsconfig.json` with relative path II", (done) => {
            execCli(
                ["-c", "test/files/tsconfig-extends-relative/tslint-fail.json", "-p",
                 "test/files/tsconfig-extends-relative/test/tsconfig.json"],
                (err) => {
                    assert.isNotNull(err, "process should exit with error");
                    assert.strictEqual(err.code, 2, "error code should be 2");
                    done();
                });
        });

        it("can execute typed rules without --type-check", (done) => {
            execCli(
                [ "-p", "test/files/typed-rule/tsconfig.json"],
                (err) => {
                    assert.isNotNull(err, "process should exit with error");
                    assert.strictEqual(err.code, 2, "error code should be 2");
                    done();
                });
        });

        it("handles 'allowJs' correctly", (done) => {
            execCli(
                [ "-p", "test/files/tsconfig-allow-js/tsconfig.json"],
                (err) => {
                    assert.isNotNull(err, "process should exit with error");
                    assert.strictEqual(err.code, 2, "error code should be 2");
                    done();
                });
        });

        it("doesn't lint external dependencies with 'allowJs'", (done) => {
            execCli(
                [ "-p", "test/files/allow-js-exclude-node-modules/tsconfig.json"],
                (err) => {
                    assert.isNull(err, "process should exit without error");
                    done();
                });
        });

        it("works with '--exclude'", (done) => {
            execCli(
                [ "-p", "test/files/tsconfig-allow-js/tsconfig.json", "-e", "'test/files/tsconfig-allow-js/testfile.test.js'"],
                (err) => {
                    assert.isNull(err, "process should exit without an error");
                    done();
                });
        });

        it("can apply fixes from multiple rules", (done) => {
            fs.writeFileSync("test/files/project-multiple-fixes/testfile.test.ts",
                             fs.readFileSync("test/files/project-multiple-fixes/before.test.ts", "utf-8"));
            execCli(
                [ "-p", "test/files/project-multiple-fixes/", "--fix"],
                (err) => {
                    const actual = fs.readFileSync("test/files/project-multiple-fixes/testfile.test.ts", "utf-8");
                    fs.unlinkSync("test/files/project-multiple-fixes/testfile.test.ts");
                    assert.isNull(err, "process should exit without an error");
                    assert.strictEqual(
                        actual,
                        fs.readFileSync("test/files/project-multiple-fixes/after.test.ts", "utf-8"),
                    );
                    done();
                });
        }).timeout(8000);
    });

    describe("--type-check", () => {
        it("exits with code 1 if --project is not passed", (done) => {
            execCli(["--type-check"], (err) => {
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

        it("exits with code 0 if `--init` flag is used in folder without tslint.json", (done) => {

            execCli(["--init"], { cwd: EXECUTABLE_DIR }, (err) => {
                assert.isNull(err, "process should exit without an error");
                assert.strictEqual(fs.existsSync(TEMP_JSON_PATH), true, "file should be created");
                done();
            });
        });

        it("exits with code 1 if `--init` flag is used in folder with tslint.json", (done) => {
            // make sure that file exists before test
            fs.writeFileSync(TEMP_JSON_PATH, "{}");

            execCli(["--init"], { cwd: EXECUTABLE_DIR }, (err) => {
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

        it("exits with code 2 if correctly finds file containing lint errors when glob is in double quotes", (done) => {
            // when glob pattern is passed in double quotes in npm script `process.env` will contain:
            // on Windows - pattern string without any quotes
            // on Linux - pattern string without any quotes (glob is not expanded)
            execCli(["-c", "./test/config/tslint-custom-rules.json", "-r", "./test/files/custom-rules", "src/**/test.ts"], (err) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 2, "error code should be 2");
                done();
            });
        });

        it("exits with code 2 if correctly finds file containing lint errors when glob is in single quotes", (done) => {
            // when glob pattern is passed in single quotes in npm script `process.env` will contain:
            // on Windows - pattern string wrapped in single quotes
            // on Linux - pattern string without any quotes (glob is not expanded)
            execCli(["-c", "./test/config/tslint-custom-rules.json", "-r", "./test/files/custom-rules", "'src/**/test.ts'"], (err) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 2, "error code should be 2");
                done();
            });
        });

        it("can handle multiple '--exclude' globs", (done) => {
            execCli(
                [
                    "-c", "test/files/multiple-excludes/tslint.json",
                    "--exclude", "'test/files/multiple-excludes/invalid.test.ts'",
                    "--exclude", "'test/files/multiple-excludes/invalid2*'",
                    "'test/files/multiple-excludes/**.ts'",
                ],
                (err) => {
                    assert.isNull(err, "process should exit without an error");
                    done();
                });
        });
    });
});

type ExecFileCallback = (error: Error & { code: number }, stdout: string, stderr: string) => void;

function execCli(args: string[], cb: ExecFileCallback): cp.ChildProcess;
function execCli(args: string[], options: cp.ExecFileOptions, cb: ExecFileCallback): cp.ChildProcess;
function execCli(args: string[], options: cp.ExecFileOptions | ExecFileCallback, cb?: ExecFileCallback): cp.ChildProcess {
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

function isFunction(fn: any): fn is Function { // tslint:disable-line:ban-types
    return ({}).toString.call(fn) === "[object Function]";
}

function cleanTempInitFile(): void {
    if (fs.existsSync(TEMP_JSON_PATH)) {
        fs.unlinkSync(TEMP_JSON_PATH);
    }
}
