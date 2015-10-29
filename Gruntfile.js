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

        clean: {
            core: ["lib/**/*.js", "lib/**/*.d.ts"],
            test: ["build/tests"]
        },

        mochaTest: {
            test: {
                options: {
                    reporter: "spec"
                },
                src: ["build/tests/test/**/*.js"]
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
            core: {
                tsconfig: "src/tsconfig.json",
            },
            test: {
                tsconfig: "test/tsconfig.json",
            }
        },

        babel: {
            core: {
                files: [{
                    expand: true,
                    cwd: "lib",
                    src: ["**/*.js"],
                    dest: "lib",
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: "build/tests",
                    src: ["**/*.js"],
                    dest: "build/tests"
                }]
            }
        }
    });

    // load NPM tasks
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-run");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-ts");

    // register custom tasks
    grunt.registerTask("core", ["clean:core", "ts:core", "babel:core"]);
    grunt.registerTask("test", ["clean:test", "ts:test", "babel:test", "tslint:test", "mochaTest"]
                                  .concat(checkBinTest));

    // create default task
    grunt.registerTask("default", ["jscs", "core", "test"]);
};
