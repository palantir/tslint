/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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

import { assert } from "chai";
import * as fs from "fs";
import { createSourceFile, ScriptTarget } from "typescript";

import { DEFAULT_CONFIG } from "../src/configuration";
import { Replacement, RuleFailure } from "../src/language/rule/rule";
import { Linter } from "../src/linter";

import { createTempFile } from "./utils";

class TestLinter extends Linter {
    public applyFixesHelper(fileName: string, source: string, ruleFailures: RuleFailure[]) {
        return super.applyFixes(fileName, source, ruleFailures);
    }
}

const componentDeclaration = (templateUrl: string) =>
    `import { Component } from '@angular/component';

@Component({
  selector: 'foo-bar',
  templateUrl: '${templateUrl}'
})
class SampleComponent {}
`;

const templateDeclaration = `
<div>{{ foo }}</div>
`;

const templateDeclarationFixed = `
<div></div>
`;

const withWarningDeclaration = `
  console.log("This line will not pass linting with the default rule set");
`;

describe("Linter", () => {
    it("apply fixes to correct files", () => {
        const linter = new TestLinter({ fix: true });
        const componentFile = createTempFile("ts");
        const templateFile = createTempFile("ts");
        fs.writeFileSync(componentFile, componentDeclaration(templateFile));
        fs.writeFileSync(templateFile, templateDeclaration);
        const sourceFile = createSourceFile(
            templateFile,
            `${templateDeclaration}`,
            ScriptTarget.ES2015,
        );
        const replacement = new Replacement(6, 9, "");
        const failure = new RuleFailure(
            sourceFile,
            6,
            15,
            "Declaration doesn't exist",
            "foo-bar",
            replacement,
        );
        linter.applyFixesHelper(componentFile, componentDeclaration(templateFile), [failure]);
        assert.equal(fs.readFileSync(templateFile, "utf-8"), templateDeclarationFixed);
    });

    it("shows warnings", () => {
        const config = DEFAULT_CONFIG;
        config.rules.set("no-console", {
            ruleArguments: ["log"],
            ruleName: "no-console",
            ruleSeverity: "warning",
        });

        const linter = new TestLinter({ fix: false });
        const fileToLint = createTempFile("ts");
        fs.writeFileSync(fileToLint, withWarningDeclaration);
        linter.lint(fileToLint, withWarningDeclaration, config);
        const result = linter.getResult();

        assert.equal(result.warningCount, 1);
        assert.equal(result.errorCount, 0);
    });

    it("does not show warnings when `quiet` is `true`", () => {
        const config = DEFAULT_CONFIG;
        config.rules.set("no-console", {
            ruleArguments: ["log"],
            ruleName: "no-console",
            ruleSeverity: "warning",
        });

        const linter = new TestLinter({ fix: false, quiet: true });
        const fileToLint = createTempFile("ts");
        fs.writeFileSync(fileToLint, withWarningDeclaration);
        linter.lint(fileToLint, withWarningDeclaration, config);
        const result = linter.getResult();

        assert.equal(result.warningCount, 0);
        assert.equal(result.errorCount, 0);
    });
});
