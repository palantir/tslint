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

describe("Linter applied to TSX syntax", () => {
    const fs = require("fs");
    const path = require("path");
    const fileName = "react.test.tsx";

    it("doesn't blow up", () => {
        const validConfiguration = {};
        const relativePath = path.join("test", "files", "tsx", fileName);
        const source = fs.readFileSync(relativePath, "utf8");

        const options: Lint.ILinterOptions = {
            configuration: validConfiguration,
            formatter: "json",
            formattersDirectory: null,
            rulesDirectory: null
        };

        const ll = new Lint.Linter(relativePath, source, options);
        const result = ll.lint();
        const parsedResult = JSON.parse(result.output);

        assert.lengthOf(parsedResult, 0);
    });
});
