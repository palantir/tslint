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

    export function getSourceFile(fileName: string): ts.SourceFile {
        var relativePath = path.join("test", "files", fileName);
        var source = fs.readFileSync(relativePath, "utf8");

        return Lint.getSourceFile(fileName, source);
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
        var sourceFile = getSourceFile(fileName);
        var rule = new Rule("", ruleValue, []);
        return rule.apply(sourceFile);
    }

    // start and end are arrays with the first and second elements
    // being (one-indexed) line and character positions respectively
    export function createFailure(fileName: string, start: number[], end: number[], failure: string): Lint.RuleFailure {
        var sourceFile = getSourceFile(fileName);
        var startPosition = sourceFile.getPositionOfLineAndCharacter(start[0], start[1]);
        var endPosition = sourceFile.getPositionOfLineAndCharacter(end[0], end[1]);

        return new Lint.RuleFailure(sourceFile, startPosition, endPosition, failure, "");
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
        actualFailures.forEach((actualFailure, i) => {
            assert.isTrue(actualFailure.equals(expectedFailures[i]));
        });
    }

    // assert whether a failure array contains the given failure
    export function assertContainsFailure(haystack: Lint.RuleFailure[], needle: Lint.RuleFailure) {
        var haystackContainsNeedle = haystack.some((item) => item.equals(needle));

        if (!haystackContainsNeedle) {
            var stringifiedNeedle = JSON.stringify(needle.toJson(), null, 2);
            var stringifiedHaystack = JSON.stringify(haystack.map((hay) => hay.toJson()), null, 2);

            assert(false, "expected " + stringifiedNeedle + " within " + stringifiedHaystack);
        }
    }
}
