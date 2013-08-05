/// <reference path='../src/tslint.ts'/>

module Lint.Test {

    var fs = require("fs");
    var path = require("path");

    export function getSyntaxTree(filePath: string): TypeScript.SyntaxTree {
        var relativePath = path.join("test", "files", filePath);
        var source = fs.readFileSync(relativePath, "utf8");

        var languageServiceHost = new Lint.LanguageServiceHost(filePath, source);
        var languageService = new Services.LanguageService(languageServiceHost);

        return languageService.getSyntaxTree(filePath);
    }
    
}
