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

import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as ts from "typescript";

import * as Lint from "./lint";

export function getSourceFile(fileName: string): ts.SourceFile {
    const relativePath = path.join("test", "files", fileName);
    const source = fs.readFileSync(relativePath, "utf8");

    return Lint.getSourceFile(fileName, source);
}

export function getRule(ruleName: string) {
    const rulesDirectory = path.join(path.dirname(module.filename), "../src/rules");
    return Lint.findRule(ruleName, rulesDirectory);
}

export function getFormatter(formatterName: string) {
    const formattersDirectory = path.join(path.dirname(module.filename), "../src/formatters");
    return Lint.findFormatter(formatterName, formattersDirectory);
}

export function applyRuleOnFile(fileName: string, Rule: any, ruleValue: any = true): Lint.RuleFailure[] {
    const sourceFile = getSourceFile(fileName);
    const rule = new Rule("", ruleValue, []);
    return rule.apply(sourceFile);
}

// start and end are arrays with the first and second elements
// being (one-indexed) line and character positions respectively
export function createFailure(fileName: string, start: number[], end: number[], failure: string): Lint.RuleFailure {
    const sourceFile = getSourceFile(fileName);
    const startPosition = sourceFile.getPositionOfLineAndCharacter(start[0] - 1, start[1] - 1);
    const endPosition = sourceFile.getPositionOfLineAndCharacter(end[0] - 1, end[1] - 1);

    return new Lint.RuleFailure(sourceFile, startPosition, endPosition, failure, "");
}

// return a partial on createFailure
export function createFailuresOnFile(fileName: string, failure: string) {
    return (start: number[], end: number[]) => {
        return createFailure(fileName, start, end, failure);
    };
}

// assert on array equality for failures
export function assertFailuresEqual(actualFailures: Lint.RuleFailure[], expectedFailures: Lint.RuleFailure[]) {
    assert.equal(actualFailures.length, expectedFailures.length);
    actualFailures.forEach((actualFailure, i) => {
        const startPosition = JSON.stringify(actualFailure.getStartPosition().toJson());
        const endPosition = JSON.stringify(actualFailure.getEndPosition().toJson());
        assert.isTrue(actualFailure.equals(expectedFailures[i]),
                      `actual failure at ${startPosition}, ${endPosition} did not match expected failure`);
    });
}

// assert whether a failure array contains the given failure
export function assertContainsFailure(haystack: Lint.RuleFailure[], needle: Lint.RuleFailure) {
    const haystackContainsNeedle = haystack.some((item) => item.equals(needle));

    if (!haystackContainsNeedle) {
        const stringifiedNeedle = JSON.stringify(needle.toJson(), null, 2);
        const stringifiedHaystack = JSON.stringify(haystack.map((hay) => hay.toJson()), null, 2);

        assert(false, "expected " + stringifiedNeedle + " within " + stringifiedHaystack);
    }
}

export function createTempFile(extension: string) {
    let tmpfile: string;
    for (let i = 0; i < 5; i++) {
        const attempt = path.join(os.tmpdir(), `tslint.test${Math.round(Date.now() * Math.random())}.${extension}`);
        if (!fs.existsSync(tmpfile)) {
            tmpfile = attempt;
            break;
        }
    }
    if (tmpfile === undefined) {
        throw new Error("Couldn't create temp file");
    }
    return tmpfile;
}

// converts Windows normalized paths (witn backwars slash `\`) to paths used by TypeScript (with forward slash `/`)
export function denormalizeWinPath(path: string): string {
    return path.replace(/\\/g, "/");
}
