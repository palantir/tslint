/// <reference path='tslint.ts'/>

var fs = require("fs");
var path = require("path");
var argv = require("optimist")
  .usage("usage: $0")
  .demand("f")
  .options({
    "c": {
        alias: "config",
        describe: "configuration file"
    },
    "f": {
        alias: "file",
        describe: "file to lint"
    },
    "o": {
        alias: "out",
        describe: "output file",
    },
    "t": {
        alias: "format",
        describe: "output format (prose, json)",
        default: "prose"
    }
  })
  .argv;

var configuration = Lint.Configuration.findConfiguration(argv.c);
if (configuration === undefined) {
    console.error("unable to find .tslintrc configuration");
    process.exit(1);
}

var file = argv.f;
var contents = fs.readFileSync(file, "utf8");

var linter = new Lint.Linter(file, contents, {
    formatter: argv.t,
    configuration: configuration
});
var lintResult = linter.lint();

var outputStream;
if (argv.o !== undefined) {
    outputStream = fs.createWriteStream(argv.o, {
        end: false,
        flags: "w+",
        mode: 0644
    });
} else {
    outputStream = process.stdout;
}

if (lintResult.failureCount > 0) {
    outputStream.write(lintResult.output, () => {
        process.exit(2);
    });
}
