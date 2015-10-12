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
            test: ["build/test/"]
        },

        mochaTest: {
            test: {
                options: {
                    reporter: "spec"
                },
                src: ["build/test/**/*.js"]
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
                noImplicitAny: true,
                sourceMap: false,
                target: "es5",
                module: "commonjs"
            },

            core: {
                options: {
                    declaration: true
                },
                src: [
                    "typings/*.d.ts",
                    "src/**/*.ts",
                ],
                outDir: "lib/"
            },

            test: {
                src: [
                    "typings/*.d.ts",
                    "lib/tslint.d.ts",
                    "test/typings/*.d.ts",
                    "test/chaiAssert.d.ts",
                    "test/**/*.ts",
                    "!test/files/**/*.ts"
                ],
                outDir: "build/"
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
    grunt.registerTask("core", ["clean:core", "ts:core"]);
    grunt.registerTask("test", ["clean:test", "ts:test", "tslint:test", "mochaTest"]
                                  .concat(checkBinTest));

    // create default task
    grunt.registerTask("default", ["jscs", "core", "test"]);
};
