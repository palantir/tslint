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
import { createSourceFile, ScriptTarget } from "typescript";
import { Replacement, RuleFailure } from "../src/language/rule/rule";
import { readFileAsync, writeFileAsync } from "../src/utils";
import { createTempFile } from "./utils";

import Linter = require("../src/linter");

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

const templateDeclaration =
`
<div>{{ foo }}</div>
`;

const templateDeclarationFixed =
`
<div></div>
`;

describe("Linter", () => {

    it("apply fixes to correct files", async () => {
        const linter = new TestLinter({ fix: true });
        const componentFile = createTempFile("ts");
        const templateFile = createTempFile("ts");

        await Promise.all([
            writeFileAsync(componentFile, componentDeclaration(templateFile)),
            writeFileAsync(templateFile, templateDeclaration),
        ]);

        const sourceFile = createSourceFile(templateFile, `${templateDeclaration}`, ScriptTarget.ES2015);
        const replacement = new Replacement(6, 9, "");
        const failure = new RuleFailure(sourceFile, 6, 15, "Declaration doesn't exist", "foo-bar", replacement);
        linter.applyFixesHelper(componentFile, componentDeclaration(templateFile), [failure]);

        const actualTemplateFileContents = await readFileAsync(templateFile, "utf-8");
        assert.equal(actualTemplateFileContents, templateDeclarationFixed);
    });

});
