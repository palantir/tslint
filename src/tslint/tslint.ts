/// <reference path='../typescript/compiler/typescript.ts'/>
/// <reference path=../typescript/services/classifier.ts' />
/// <reference path=../typescript/services/coreServices.ts' />
/// <reference path='../typescript/services/typescriptServices.ts' />
/// <reference path=../typescript/services/pullLanguageService.ts' />

/// <reference path='language/languageServiceHost.ts' />
/// <reference path='rules/ruleManager.ts' />

var fs = require("fs");
var path = require("path");

var argv = process.argv;
if(argv.length < 3) {
  console.error("usage: " + argv[0] + " " + path.basename(argv[1]) + " <filename>");
  return 1;
}

var file = argv[2];
var contents = fs.readFileSync(file, "utf8");

var languageServiceHost = new Lint.LanguageServiceHost(file, contents);
var languageService = new Services.LanguageService(languageServiceHost);
var syntaxTree = languageService.getSyntaxTree(file);

var results = [];
var classifier = new Services.Classifier(new TypeScript.NullLogger());
var lines = contents.split("\n");
var lastLexState = Services.EndOfLineState.Start;

for (var i = 0; i < lines.length; i++) {
  var line = lines[i];
  var classificationResult = classifier.getClassificationsForLine(line, lastLexState);
  lastLexState = classificationResult.finalLexState;
  results.push(classificationResult);
}

var diagnostics = syntaxTree.diagnostics();

//console.log(JSON.stringify(syntaxTree));
//console.log(JSON.stringify(results));
console.log(JSON.stringify(diagnostics));
