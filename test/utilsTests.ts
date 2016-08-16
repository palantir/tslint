/*
 * Copyright 2016 Palantir Technologies, Inc.
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

import {arrayify, dedent, objectify} from "../src/utils";

describe("Utils", () => {
    it("arrayify", () => {
        assert.deepEqual(arrayify(undefined), []);
        assert.deepEqual(arrayify(null), []);
        assert.deepEqual(arrayify([]), []);
        assert.deepEqual(arrayify("foo"), ["foo"]);
        assert.deepEqual(arrayify(1), [1]);
        assert.deepEqual(arrayify({foo: 2}), [{foo: 2}]);
        assert.deepEqual(arrayify([1, 2]), [1, 2]);
        assert.deepEqual(arrayify(["foo"]), ["foo"]);
    });

    it("objectify", () => {
        assert.deepEqual(objectify(undefined), {});
        assert.deepEqual(objectify(null), {});
        assert.deepEqual(objectify("foo"), {});
        assert.deepEqual(objectify(1), {});
        assert.deepEqual(objectify({foo: 1, mar: {baz: 2}}), {foo: 1, mar: {baz: 2}});
    });

    it("dedent", () => {
        assert.equal(dedent`
        foo
        bar`, "\nfoo\nbar");

        assert.equal(dedent`   one-line`, "one-line");

        assert.equal(dedent`  `, "  ");
        assert.equal(dedent``, "");
    });
});
