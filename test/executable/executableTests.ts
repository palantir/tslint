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

import * as cp from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { createTempFile, denormalizeWinPath } from "../utils";

// when tests are run with mocha from npm scripts CWD points to project root
const EXECUTABLE_DIR = path.resolve(process.cwd(), "test", "executable");
const EXECUTABLE_PATH = path.resolve(EXECUTABLE_DIR, "npm-like-executable");
const TEMP_JSON_PATH = path.resolve(EXECUTABLE_DIR, "tslint.json");

/* tslint:disable:only-arrow-functions */
describe("Executable", function() {
    this.slow(3000);    // the executable is JIT-ed each time it runs; avoid showing slowness warnings
    describe("Files", () => {
        it("exits with code 1 if no arguments passed", (done) => {
            execCli([], (err, stdout, stderr) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 1, "error code should be 1");

                assert.include(stderr, "Missing files", "stderr should contain notification about missing files");
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

                assert.include(stderr, "-f option is no longer available", "stderr should contain notification about removed flag");
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
            });        });

        it("exits with code 1 if config file is invalid", (done) => {
            execCli(["-c", "test/config/tslint-invalid.json", "src/test.ts"], (err, stdout, stderr) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 1, "error code should be 1");

                assert.include(stderr, "Failed to load", "stderr should contain notification about failing to load json");
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

        it("exits with code 2 if custom rules directory is specified in config file and file contains lint errors", (done) => {
            execCli(["-c", "./test/config/tslint-custom-rules-with-dir.json", "src/test.ts"], (err) => {
                assert.isNotNull(err, "process should exit with error");
                assert.strictEqual(err.code, 2, "error code should be 2");
                done();
            });
        });
    });

    describe("--fix flag", () => {
        it("fixes multiple rules without overwriting each other", (done) => {
            const tempFile = createTempFile("ts");
            fs.createReadStream("test/files/multiple-fixes-test/multiple-fixes.test.ts").pipe(fs.createWriteStream(tempFile));
            execCli(["-c", "test/files/multiple-fixes-test/tslint.json", tempFile, "--fix"],
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
    });

    describe("--force flag", () => {
        it("exits with code 0 if `--force` flag is passed", (done) => {
            execCli(["-c", "./test/config/tslint-custom-rules.json", "-r", "./test/files/custom-rules", "--force", "src/test.ts"],
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

        it("exits with code 1 if `--test` flag is used with incorrect rule", (done) => {
            execCli(["--test", "test/files/incorrect-rule-test"], (err) => {
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
    });

    describe("tsconfig.json", () => {
        it("exits with code 0 if `tsconfig.json` is passed and it specifies files without errors", (done) => {
            execCli(["-c", "test/files/tsconfig-test/tslint.json", "--project", "test/files/tsconfig-test/tsconfig.json"], (err) => {
                assert.isNull(err, "process should exit without an error");
                done();
            });
        });

        it("exits with code 2 if both `tsconfig.json` and files arguments are passed and files contain lint errors", (done) => {
            execCli(["-c", "test/files/tsconfig-test/tslint.json", "--project", "test/files/tsconfig-test/tsconfig.json",
                "test/files/tsconfig-test/other.test.ts"], (err) => {
                    assert.isNotNull(err, "process should exit with error");
                    assert.strictEqual(err.code, 2, "error code should be 2");
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

    });
});

type ExecFileCallback = (error: any, stdout: string, stderr: string) => void;

function execCli(args: string[], cb: ExecFileCallback): cp.ChildProcess;
function execCli(args: string[], options: cp.ExecFileOptions, cb: ExecFileCallback): cp.ChildProcess;
function execCli(args: string[], options: cp.ExecFileOptions | ExecFileCallback, cb?: ExecFileCallback): cp.ChildProcess {
    let filePath = EXECUTABLE_PATH;

    // Specify extension for Windows executable to avoid ENOENT errors 
    if (os.platform() === "win32") {
        filePath += ".cmd";
    }

    if (isFunction(options)) {
        cb = options as ExecFileCallback;
        options = {};
    }

    return cp.execFile(filePath, args, options, (error, stdout, stderr) => {
        cb(error, stdout.trim(), stderr.trim());
    });
}

function isFunction(fn: any): boolean {
    return ({}).toString.call(fn) === "[object Function]";
}

function cleanTempInitFile(): void {
    if (fs.existsSync(TEMP_JSON_PATH)) {
        fs.unlinkSync(TEMP_JSON_PATH);
    }
}
