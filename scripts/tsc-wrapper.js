#!/usr/bin/env node

/* global process */

var execSync = require("child_process").execSync;
var findup = require("findup-sync");
var path = require("path");
var spawnSync = require("child_process").spawnSync;

/* print a buffer to a stream */ 
function print(buffer, stream) {
    if (buffer != null) {
        var output = buffer.toString("utf8");
        stream.write(output);
    }
}

var argv = process.argv;
if (argv.length < 4) {
    console.error("insufficient arguments to tsc wrapper");
    process.exit(1);
}

var workspacePath = argv[2];
var filePath = argv[3];

var configPath = path.dirname(findup("tsconfig.json", { cwd: filePath, nocase: true }));
if (configPath == null) {
    console.error("tsconfig.json not found");
    process.exit(2);
}

var tscPath = path.join(workspacePath, "node_modules", "typescript", "bin", "tsc");
var tsc = spawnSync(tscPath, ["-p", configPath]);

print(tsc.stdout, process.stdout);
print(tsc.stderr, process.stderr);
process.exit(tsc.status);
