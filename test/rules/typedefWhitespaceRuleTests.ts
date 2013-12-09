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

/// <reference path='../references.ts' />

describe("<typedefWhitespace, not enabled>", () => {
    var fileName = "rules/typedefWhitespace.test.ts";
    var TypedefWhitespaceRule = Lint.Test.getRule("typedefWhitespace");

    it("enforces rules only when enabled (unspecified)", () => {
        var failures = Lint.Test.applyRuleOnFile(fileName, TypedefWhitespaceRule);
        assert.equal(failures.length, 0);
    });

    it("enforces rules only when enabled (disabled)", () => {
        var options = [false];

        var failures = Lint.Test.applyRuleOnFile(fileName, TypedefWhitespaceRule, options);
        assert.equal(failures.length, 0);
    });
});

describe("<typedefWhitespace, required>", () => {
    var actualFailures;
    var fileName = "rules/typedefWhitespace.test.ts";
    var TypedefWhitespaceRule = Lint.Test.getRule("typedefWhitespace");

    before(() => {
        var options = [true,
            {
                "callSignature": "space",
                "catchClause": "space",
                "indexSignature": "space",
                "parameter": "space",
                "propertySignature": "space",
                "variableDeclarator": "space"
            }
        ];
        actualFailures = Lint.Test.applyRuleOnFile(fileName, TypedefWhitespaceRule, options);
    });

    it("enforces whitespace in call signatures", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [25, 59], [25, 60], "expected space in callSignature.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace in catch clauses", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [31, 9], [31, 10], "expected space in catchClause.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace in indexSignature", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [48, 2], [48, 3], "expected space in indexSignature.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace in parameter", () => {
        var expectedFailure1 = Lint.Test.createFailure(fileName, [25, 39], [25, 40], "expected space in parameter.");
        var expectedFailure2 = Lint.Test.createFailure(fileName, [25, 50], [25, 51], "expected space in parameter.");
        var expectedFailure3 = Lint.Test.createFailure(fileName, [48, 11], [48, 12], "expected space in parameter.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
    });

    it("enforces whitespace in propertySignature", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [18, 9], [18, 10], "expected space in propertySignature.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace in variable declarator", () => {
        var expectedFailure1 = Lint.Test.createFailure(fileName, [26, 10], [26, 11], "expected space in variableDeclarator.");
        var expectedFailure2 = Lint.Test.createFailure(fileName, [27, 10], [27, 11], "expected space in variableDeclarator.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
    });
});

describe("<typedefWhitespace, not allowed>", () => {
    var actualFailures;
    var fileName = "rules/typedefWhitespace.test.ts";
    var TypedefWhitespaceRule = Lint.Test.getRule("typedefWhitespace");

    before(() => {
        var options = [true,
            {
                "callSignature": "nospace",
                "catchClause": "nospace",
                "indexSignature": "nospace",
                "parameter": "nospace",
                "propertySignature": "nospace",
                "variableDeclarator": "nospace"
            }
        ];
        actualFailures = Lint.Test.applyRuleOnFile(fileName, TypedefWhitespaceRule, options);
    });

    it("enforces no whitespace in call signatures", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [36, 64], [36, 65], "expected nospace in callSignature.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces no whitespace in catch clauses", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [42, 10], [42, 11], "expected nospace in catchClause.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces no whitespace in indexSignature", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [58, 3], [58, 4], "expected nospace in indexSignature.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces no whitespace in parameter", () => {
        var expectedFailure1 = Lint.Test.createFailure(fileName, [36, 42], [36, 43], "expected nospace in parameter.");
        var expectedFailure2 = Lint.Test.createFailure(fileName, [36, 54], [36, 55], "expected nospace in parameter.");
        var expectedFailure3 = Lint.Test.createFailure(fileName, [58, 12], [58, 13], "expected nospace in parameter.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
    });

    it("enforces no whitespace in propertySignature", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [22, 10], [22, 11], "expected nospace in propertySignature.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces no whitespace in variable declarator", () => {
        var expectedFailure1 = Lint.Test.createFailure(fileName, [37, 11], [37, 12], "expected nospace in variableDeclarator.");
        var expectedFailure2 = Lint.Test.createFailure(fileName, [38, 11], [38, 12], "expected nospace in variableDeclarator.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
    });
});
