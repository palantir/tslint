/// <reference path='../typescript/compiler/typescript.ts'/>
/// <reference path='../typescript/services/typescriptServices.ts' />
/// <reference path=../typescript/services/pullLanguageService.ts' />

/// <reference path='./languageServiceHost.ts' />

var fs = require("fs");
var path = require("path");

var argv = process.argv;
if(argv.length < 3) {
  console.error("usage: " + argv[0] + " " + path.basename(argv[1]) + " <filename>");
  return 1;
}

var file = argv[2];
var contents = fs.readFileSync(file);
var languageServiceHost = new Lint.LanguageServiceHost(file, contents);
