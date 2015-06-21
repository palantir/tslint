"use strict";

var checkBinTest;
if (process.platform  === "win32") {
    checkBinTest = [];
} else {
    checkBinTest = ["run:test"];
}

module.exports = function (grunt) {
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        typescriptBin: "node_modules/typescript/bin/typescriptServices.js",

        clean: {
            bin: ["bin/tslint-cli.js"],
            core: ["build/rules/", "build/formatters", "lib/tslint.*"],
            test: ["build/test/"],
        },

        concat: {
            bin: {
                src: ["<%= typescriptBin %>", "bin/tslint-cli.js"],
                dest: "bin/tslint-cli.js"
            },
            core: {
                src: ["<%= typescriptBin %>", "lib/tslint.js"],
                dest: "lib/tslint.js"
            },
            test: {
                src: ["lib/tslint.js", "build/tslint-tests.js"],
                dest: "build/tslint-tests.js"
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: "spec"
                },
                src: ["build/tslint-tests.js"]
            }
        },

        run: {
            test: {
                cmd: "./test/check-bin.sh"
            }
        },

        jscs: {
            src: [
                "Gruntfile.js",
                "test/files/formatters/*.js"
            ],
            options: {
                config: ".jscsrc"
            }
        },

        tslint: {
            options: {
                configuration: grunt.file.readJSON("tslint.json")
            },
            src: [
                "src/*.ts",
                "src/formatters/**/*.ts",
                "src/language/**/*.ts",
                "src/rules/**/*.ts"
            ],
            test: [
                "test/**/*.ts",
                "!test/**/*.test.ts",
                "!test/typings/**/*.ts"
            ]
        },

        ts: {
            options: {
                sourceMap: false,
                target: "es5"
            },

            bin: {
                src: [
                    "typings/*.d.ts",
                    "src/language/walker/syntaxWalker.ts",
                    "src/language/walker/ruleWalker.ts",
                    "src/language/walker/scopeAwareRuleWalker.ts",
                    "src/language/**/*.ts",
                    "src/!(tslint-cli).ts",
                    "src/tslint-cli.ts"
                ],
                out: "bin/tslint-cli.js"
            },

            core: {
                options: {
                    noImplicitAny: true,
                    declaration: true,
                    module: "commonjs"
                },
                src: [
                    "typings/*.d.ts",
                    "src/language/walker/syntaxWalker.ts",
                    "src/language/walker/ruleWalker.ts",
                    "src/language/walker/scopeAwareRuleWalker.ts",
                    "src/language/**/*.ts",
                    "src/*.ts",
                    "!src/tslint-cli.ts"
                ],
                out: "lib/tslint.js"
            },

            core_rules: {
                options: {
                    base_path: "src/rules",
                    module: "commonjs"
                },
                src: [
                    "typings/*.d.ts",
                    "lib/tslint.d.ts",
                    "src/rules/*.ts"
                ],
                outDir: "build/rules/"
            },

            core_formatters: {
                options: {
                    base_path: "src/formatters",
                    module: "commonjs"
                },
                src: [
                    "typings/*.d.ts",
                    "lib/tslint.d.ts",
                    "src/formatters/*.ts"
                ],
                outDir: "build/formatters/"
            },

            test: {
                src: [
                    "typings/*.d.ts",
                    "lib/tslint.d.ts",
                    "test/typings/*.d.ts",
                    "test/**/*.ts",
                    "!test/files/**/*.ts"
                ],
                out: "build/tslint-tests.js"
            }
        }
    });

    // load NPM tasks
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-run");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-ts");

    // register custom tasks
    grunt.registerTask("core", ["clean:core", "ts:core", "concat:core", "ts:core_rules", "ts:core_formatters"]);
    grunt.registerTask("bin", ["clean:bin", "ts:bin", "tslint:src", "concat:bin"]);
    grunt.registerTask("test", ["clean:test", "ts:test", "tslint:test", "concat:test", "mochaTest"]
                                  .concat(checkBinTest));

    // create default task
    grunt.registerTask("default", ["jscs", "core", "bin", "test"]);
};
