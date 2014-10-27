/*
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

/// <reference path='../src/tslint.ts'/>
/// <reference path='../src/ruleLoader.ts'/>

module Lint.Test {
    var fs = require("fs");
    var path = require("path");

    export function getSyntaxTree(fileName: string): TypeScript.SyntaxTree {
        var relativePath = path.join("test", "files", fileName);
        var source = fs.readFileSync(relativePath, "utf8");

        return Lint.getSyntaxTree(fileName, source);
    }

    export function getRule(ruleName: string) {
        var rulesDirectory = path.join(global.process.cwd(), "build/rules");
        return Lint.findRule(ruleName, rulesDirectory);
    }

    export function getFormatter(formatterName: string) {
        var formattersDirectory = path.join(global.process.cwd(), "build/formatters");
        return Lint.findFormatter(formatterName, formattersDirectory);
    }

    export function applyRuleOnFile(fileName: string, Rule: any, ruleValue: any = true): Lint.RuleFailure[] {
        var syntaxTree = getSyntaxTree(fileName);
        var rule = new Rule("", ruleValue, []);
        return rule.apply(syntaxTree);
    }

    // start and end are arrays with the first and second elements
    // being (one-indexed) line and character positions respectively
    export function createFailure(fileName: string, start: number[], end: number[], failure: string): Lint.RuleFailure {
        var syntaxTree = getSyntaxTree(fileName);
        var lineMap = syntaxTree.lineMap();
        var startPosition = lineMap.getPosition(start[0] - 1, start[1] - 1);
        var endPosition = lineMap.getPosition(end[0] - 1, end[1] - 1);

        return new Lint.RuleFailure(getSyntaxTree(fileName), startPosition, endPosition, failure, "");
    }

    // return a partial on createFailure
    export function createFailuresOnFile(fileName: string, failure: string) {
        return function(start: number[], end: number[]) {
            return createFailure(fileName, start, end, failure);
        };
    }

    // assert on array equality for failures
    export function assertFailuresEqual(actualFailures: Lint.RuleFailure[], expectedFailures: Lint.RuleFailure[]) {
        assert.equal(actualFailures.length, expectedFailures.length);
        for (var i = 0; i < actualFailures.length; ++i) {
            var actualFailure = actualFailures[i];
            var expectedFailure = expectedFailures[i];

            assert.isTrue(actualFailure.equals(expectedFailure));
        }
    }

    // assert whether a failure array contains the given failure
    export function assertContainsFailure(haystack: Lint.RuleFailure[], needle: Lint.RuleFailure) {
        for (var i = 0; i < haystack.length; ++i) {
            if (haystack[i].equals(needle)) {
                return;
            }
        }

        assert(false, "expected " + JSON.stringify(needle.toJson(), null, 2) + " within " + JSON.stringify(haystack, null, 2));
    }
}
