/*
 * Copyright 2018 Palantir Technologies, Inc.
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

import * as parse from "../../src/verify/parse";
import * as testData from "./testData";

describe("Rule Test Parse", () => {
    describe("removeErrorMarkup", () => {
        it("should return the contents of a regular string unchanged", () => {
            assert.strictEqual(parse.removeErrorMarkup(testData.lintStr1), testData.codeStr1);
        });

        it("should remove a single-line error markup correctly", () => {
            assert.strictEqual(parse.removeErrorMarkup(testData.lintStr2), testData.codeStr2);
        });

        it("should remove a mix of error markup correctly", () => {
            assert.strictEqual(parse.removeErrorMarkup(testData.lintStr3), testData.codeStr3);
        });

        it("should handle message substitutions correctly", () => {
            assert.strictEqual(parse.removeErrorMarkup(testData.lintStr6), testData.codeStr6);
        });

        it("should handle nil-length errors correctly", () => {
            assert.strictEqual(parse.removeErrorMarkup(testData.lintStr7), testData.codeStr7);
        });
    });

    describe("parseErrors", () => {
        it("should return no errors from a regular string", () => {
            assert.deepEqual(parse.parseErrorsFromMarkup(testData.lintStr1), testData.resultErrs1);
        });

        it("should find a single-line error correctly", () => {
            assert.deepEqual(parse.parseErrorsFromMarkup(testData.lintStr2), testData.resultErrs2);
        });

        it("should find a mix of errors correctly", () => {
            assert.deepEqual(parse.parseErrorsFromMarkup(testData.lintStr3), testData.resultErrs3);
        });

        it("should handle message substitutions correctly", () => {
            assert.deepEqual(parse.parseErrorsFromMarkup(testData.lintStr6), testData.resultErrs6);
        });

        it("should handle nil-length errors correctly", () => {
            assert.deepEqual(parse.parseErrorsFromMarkup(testData.lintStr7), testData.resultErrs7);
        });
    });

    describe("createMarkupFromErrors", () => {
        it("should generate correct markup", () => {
            assert.strictEqual(
                parse.createMarkupFromErrors(
                    "fileName.ts",
                    testData.codeStr5,
                    testData.resultErrs5,
                ),
                testData.lintStr5,
            );
        });

        it("should generate correct markup with nil-length errors", () => {
            assert.strictEqual(
                parse.createMarkupFromErrors(
                    "fileName.ts",
                    testData.codeStr7,
                    testData.resultErrs7,
                ),
                testData.lintStr7,
            );
        });
    });
});
