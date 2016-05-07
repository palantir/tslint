"use strict";

var checkBinTest;
if (process.platform  === "win32") {
    checkBinTest = [];
} else {
    checkBinTest = ["run:testBin"];
}

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        eslint: {
            target: [
                "Gruntfile.js",
                "test/files/formatters/*.js",
            ],
        },

        clean: {
            core: ["lib/**/*.js", "lib/**/*.d.ts"],
            test: ["build/", "test/config/node_modules/"],
        },

        mochaTest: {
            test: {
                options: {
                    reporter: "spec",
                },
                src: ["build/test/**/*Tests.js", "build/test/assert.js"],
            },
        },

        run: {
            testBin: {
                cmd: "./test/check-bin.sh",
                options: {quiet: Infinity},
            },
            testRules: {
                args: ["./build/test/ruleTestRunner.js"],
            },
        },

        tslint: {
            src: [
                "src/*.ts",
                "src/formatters/**/*.ts",
                "src/language/**/*.ts",
                "src/rules/**/*.ts",
                "src/test/**/*.ts",
            ],
            test: [
                "test/**/*.ts",
                "!test/**/*.test.ts",
                "!test/typings/**/*.ts",
            ],
        },

        ts: {
            core: {
                tsconfig: "src/tsconfig.json",
            },
            test: {
                tsconfig: "test/tsconfig.json",
            },
        },

        "npm-command": {
            test: {
                options: {
                    cwd: "./test/config",
                },
            },
        },
    });

    // load NPM tasks
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-run");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-npm-command");

    // register custom tasks
    grunt.registerTask("core", [
        "clean:core",
        "ts:core",
        "tslint:src",
    ]);
    grunt.registerTask("test", [
        "clean:test",
        "npm-command:test",
        "ts:test",
        "tslint:test",
        "mochaTest",
        "run:testRules",
    ].concat(checkBinTest));

    // create default task
    grunt.registerTask("default", ["eslint", "core", "test"]);
};
