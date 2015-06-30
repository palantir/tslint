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

describe("NULL Formatter", () => {
    const TEST_FILE = "formatters/jsonFormatter.test.ts";
    let sourceFile: ts.SourceFile;
    let formatter: Lint.IFormatter;

    before(() => {
        const Formatter = Lint.Test.getFormatter("null");
        sourceFile = Lint.Test.getSourceFile(TEST_FILE);
        formatter = new Formatter();
    });

    it("formats failures", () => {
        const maxPosition = sourceFile.getFullWidth();

        const failures = [
            new Lint.RuleFailure(sourceFile, 0, 1, "first failure", "first-name"),
            new Lint.RuleFailure(sourceFile, maxPosition - 1, maxPosition, "last failure", "last-name"),
            new Lint.RuleFailure(sourceFile, 0, maxPosition, "full failure", "full-name")
        ];

        const actualResult = formatter.format(failures);
        assert.deepEqual(actualResult, null);
    });

    it("handles no failures", () => {
        const result = formatter.format([]);
        assert.deepEqual(result, null);
    });
});
