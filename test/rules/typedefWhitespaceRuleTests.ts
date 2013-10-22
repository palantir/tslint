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

describe("<typedefWhitespace, required>", () => {
    var actualFailures;
    var fileName = "rules/typedefWhitespace.test.ts";
    var TypedefWhitespaceRule = Lint.Test.getRule("typedefWhitespace");

    before(() => {
        var options = [true,
            {
                "callSignature": "space",
                "catchClause": "space",
                "getAccessorPropertyAssignment": "space",
                "getMemberAccessorDeclaration": "space",
                "indexSignature": "space",
                "parameter": "space",
                "propertySignature": "space",
                "variableDeclarator": "space"
            }
        ];
        actualFailures = Lint.Test.applyRuleOnFile(fileName, TypedefWhitespaceRule, options);

        for (var i: number = 0; i < actualFailures.length; i++) {
            console.log(actualFailures[i]);
        }
    });

    // TODO: add no options checking in typedefWhitespaceRule .hasOption and .getOption
    //it("enforces rules only when enabled", () => {
    //    var failures = Lint.Test.applyRuleOnFile(fileName, TypedefWhitespaceRule);
    //    assert.equal(failures.length, 0);
    //});

    it("enforces whitespace in call signatures", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [25, 59], [25, 60], "expected space in callSignature.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace in catch clauses", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [31, 9], [31, 10], "expected space in catchClause.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace in get accessor property assignment", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [3, 2], [3, 3], "expected space in getAccessorPropertyAssignment.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });
    
    it("enforces whitespace in get member accessor declaration", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [52, 1], [52, 2], "expected space in getMemberAccessorDeclaration.");

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
        var expectedFailure3 = Lint.Test.createFailure(fileName, [50, 9], [50, 10], "expected space in variableDeclarator.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
    });
});
