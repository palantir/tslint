"use strict";

var checkBinTest;
if (process.platform  === "win32") {
    checkBinTest = [];
} else {
    checkBinTest = ["run:testBin"];
}

module.exports = function (grunt) {
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            core: ["lib/**/*.js", "lib/**/*.d.ts"],
            test: ["build/"]
        },

        mochaTest: {
            test: {
                options: {
                    reporter: "spec"
                },
                src: ["build/test/**/*Tests.js", "build/test/assert.js"]
            }
        },

        run: {
            installTestDeps: {
                cmd: "npm",
                args: ["install"],
                options: {
                    cwd: "./test/config"
                }
            },
            testBin: {
                cmd: "./test/check-bin.sh",
                options: {quiet: Infinity}
            },
            testRules: {
                args: ["./build/test/ruleTestRunner.js"]
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
            src: [
                "src/*.ts",
                "src/formatters/**/*.ts",
                "src/language/**/*.ts",
                "src/rules/**/*.ts",
                "src/test/**/*.ts"
            ],
            test: [
                "test/**/*.ts",
                "!test/**/*.test.ts",
                "!test/typings/**/*.ts"
            ]
        },

        ts: {
            core: {
                tsconfig: "src/tsconfig.json"
            },
            test: {
                tsconfig: "test/tsconfig.json"
            }
        }
    });

    // load NPM tasks
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-run");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-ts");

    // register custom tasks
    grunt.registerTask("core", [
        "clean:core",
        "ts:core",
        "tslint:src"
    ]);
    grunt.registerTask("test", [
        "clean:test",
        "run:installTestDeps",
        "ts:test",
        "tslint:test",
        "mochaTest",
        "run:testRules",
    ].concat(checkBinTest));

    // create default task
    grunt.registerTask("default", ["jscs", "core", "test"]);
};
