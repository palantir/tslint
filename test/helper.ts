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

    export function applyRuleOnFile(filePath: string, ruleName: string, ruleValue: any = true): Lint.RuleFailure[] {
        var syntaxTree = getSyntaxTree(filePath);
        var rule = Lint.Rules.createRule(ruleName, ruleValue);

        return rule.apply(syntaxTree);
    }

    // start and end are arrays with the first and second elements
    // being (one-indexed) line and character positions respectively
    export function createFailure(filePath: string, start: number[], end: number[], failure: string): Lint.RuleFailure {
        var syntaxTree = getSyntaxTree(filePath);
        var lineMap = syntaxTree.lineMap();
        var startPosition = lineMap.getPosition(start[0] - 1, start[1] - 1);
        var endPosition = lineMap.getPosition(end[0] - 1, end[1] - 1);

        return new Lint.RuleFailure(getSyntaxTree(filePath), startPosition, endPosition, failure);
    }

    export function createFailuresOnFile(filePath: string, failure: string) {
        return function(start: number[], end: number[]) {
            return createFailure(filePath, start, end, failure);
        }
    }

    export function assertFailuresEqual(actualFailures: Lint.RuleFailure[], expectedFailures: Lint.RuleFailure[]) {
        assert.equal(actualFailures.length, expectedFailures.length);
        for (var i = 0; i < actualFailures.length; ++i) {
            var actualFailure = actualFailures[i];
            var expectedFailure = expectedFailures[i];

            assert.isTrue(actualFailure.equals(expectedFailure));
        }
    }
}
