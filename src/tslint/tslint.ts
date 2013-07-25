/// <reference path='../typescript/compiler/typescript.ts'/>
/// <reference path='../typescript/compiler/syntax/positionTrackingWalker.ts'/>
/// <reference path=../typescript/services/classifier.ts' />
/// <reference path=../typescript/services/coreServices.ts' />
/// <reference path='../typescript/services/typescriptServices.ts' />
/// <reference path=../typescript/services/pullLanguageService.ts' />

/// <reference path='configuration.ts' />
/// <reference path='language/languageServiceHost.ts' />

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
      describe: "output destination (stdout, file)",
      default: "stdout"
    },
    "t": {
      alias: "format",
      describe: "output format (prose, json)",
      default: "prose"
    }
  })
  .argv;

Lint.Rules.createAllRules();

var configuration = Lint.Configuration.findConfiguration(argv.c);
if (configuration === undefined) {
  console.error("unable to find .tslintrc configuration");
  process.exit(1);
}

var file = argv.f;
var contents = fs.readFileSync(file, "utf8");

var languageServiceHost = new Lint.LanguageServiceHost(file, contents);
var languageService = new Services.LanguageService(languageServiceHost);
var syntaxTree = languageService.getSyntaxTree(file);
var lineMap = syntaxTree.lineMap();

var i, failures = [];
var configuredRules = Lint.Configuration.getConfiguredRules(configuration);
for (i = 0; i < configuredRules.length; ++i) {
  var rule = configuredRules[i];
  if (rule.isEnabled()) {
    failures = failures.concat(rule.apply(syntaxTree));
  }
}

for (i = 0; i < failures.length; ++i) {
  var failure = failures[i];
  var lineAndCharacter = lineMap.getLineAndCharacterFromPosition(failure.getPosition());

  var fileName = failure.getFileName();
  var line = lineAndCharacter.line() + 1;
  var character = lineAndCharacter.character() + 1;
  var failureString = failure.getFailure();

  console.error(fileName + "[" + line + ", " + character + "]: " + failureString);
}

if (failures.length > 0) {
  process.exit(3);
}
