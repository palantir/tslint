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
import { arrayify, dedent, escapeRegExp } from "../src/utils";

describe("Utils", () => {
    it("arrayify", () => {
        assert.deepEqual(arrayify(undefined), []);
        assert.deepEqual(arrayify(null), []);
        assert.deepEqual(arrayify([]), []);
        assert.deepEqual(arrayify("foo"), ["foo"]);
        assert.deepEqual(arrayify(1), [1]);
        assert.deepEqual(arrayify({ foo: 2 }), [{ foo: 2 }]);
        assert.deepEqual(arrayify([1, 2]), [1, 2]);
        assert.deepEqual(arrayify(["foo"]), ["foo"]);
    });

    it("dedent", () => {
        assert.equal(
            dedent`
            foo
            bar`,
            "\nfoo\nbar",
        );

        assert.equal(dedent`   one-line`, "one-line");

        assert.equal(dedent`  `, "  ");
        assert.equal(dedent``, "");
    });

    it("escapeRegExp", () => {
        const plus = escapeRegExp("(a+|d)?b[ci]{2,}");
        const plusRe = new RegExp(plus);

        // contains substring that matches regular expression pattern
        assert.equal(plusRe.test("regexpaaaabcicmatch"), false);

        // properly matches exact string with special characters
        assert.equal(plusRe.test("string(a+|d)?b[ci]{2,}match"), true);
    });
});
