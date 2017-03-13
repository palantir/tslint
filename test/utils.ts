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

// this function doesn't work with rules that use the language service
export function applyRuleOnFile(fileName: string, Rule: any, ruleArguments: any[] = []): Lint.RuleFailure[] {
    const sourceFile = getSourceFile(fileName);
    const options = {
        disabledIntervals: [],
        ruleArguments,
        ruleName: Rule.metadata.ruleName,
        ruleSeverity: "error",
    };
    const rule = new Rule(options);
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

export function createTempFile(extension: string) {
    let tmpfile: string | null = null;
    for (let i = 0; i < 5; i++) {
        const attempt = path.join(os.tmpdir(), `tslint.test${Math.round(Date.now() * Math.random())}.${extension}`);
        if (tmpfile === null || !fs.existsSync(tmpfile)) {
            tmpfile = attempt;
            break;
        }
    }
    if (tmpfile == null) {
        throw new Error("Couldn't create temp file");
    }
    return tmpfile;
}

// converts Windows normalized paths (with backwards slash `\`) to paths used by TypeScript (with forward slash `/`)
export function denormalizeWinPath(path: string): string {
    return path.replace(/\\/g, "/");
}
