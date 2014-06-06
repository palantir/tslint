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

describe("<typedef, not enabled>", () => {
    var fileName = "rules/typedef.test.ts";
    var TypedefRule = Lint.Test.getRule("typedef");

    it("enforces rules only when enabled (unspecified)", () => {
        var failures = Lint.Test.applyRuleOnFile(fileName, TypedefRule);
        assert.equal(failures.length, 0);
    });

    it("enforces rules only when enabled (disabled)", () => {
        var options = [false];

        var failures = Lint.Test.applyRuleOnFile(fileName, TypedefRule, options);
        assert.equal(failures.length, 0);
    });
});

describe("<typedef, enabled>", () => {
    var actualFailures;
    var fileName = "rules/typedef.test.ts";
    var TypedefRule = Lint.Test.getRule("typedef");

    before(() => {
        var options = [true,
            "callSignature",
            "indexSignature",
            "parameter",
            "propertySignature",
            "variableDeclarator",
            "memberVariableDeclarator"
        ];
        actualFailures = Lint.Test.applyRuleOnFile(fileName, TypedefRule, options);
    });

    it("enforces typedef in call signatures", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [15, 8], [15, 9], "expected callSignature to have a typedef.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });


    it("enforces typedef in indexSignature", () => {
        var expectedFailure = Lint.Test.createFailure(fileName, [22, 1], [22, 2], "expected indexSignature to have a typedef.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces typedef in parameter", () => {
        var expectedFailure1 = Lint.Test.createFailure(fileName, [14, 6], [14, 7], "expected parameter: 'a' to have a typedef.");
        var expectedFailure2 = Lint.Test.createFailure(fileName, [15, 6], [15, 7], "expected parameter: 'b' to have a typedef.");
        var expectedFailure3 = Lint.Test.createFailure(fileName, [21, 11], [21, 12], "expected parameter: 'index' to have a typedef.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
    });

    it("enforces typedef in propertySignature", () => {
        var expectedFailure = Lint.Test.createFailure(fileName,
            [10, 9],
            [10, 10],
            "expected propertySignature: 'Prop' to have a typedef.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces typedef in variable declarator", () => {
        var expectedFailure1 = Lint.Test.createFailure(fileName,
            [7, 2],
            [7, 3],
            "expected variableDeclarator: 'NoTypeObjectLiteralWithPropertyGetter' to have a typedef.");
        var expectedFailure2 = Lint.Test.createFailure(fileName,
            [18, 2],
            [18, 3],
            "expected variableDeclarator: 'NoTypesFn' to have a typedef.");
        var expectedFailure3 = Lint.Test.createFailure(fileName,
            [17, 18],
            [17, 19],
            "expected variableDeclarator: 'c' to have a typedef.");
        var expectedFailure4 = Lint.Test.createFailure(fileName,
            [17, 18],
            [17, 19],
            "expected variableDeclarator: 'd' to have a typedef.");
        var expectedFailure5 = Lint.Test.createFailure(fileName,
            [23, 27],
            [23, 28],
            "expected memberVariableDeclarator: 'Prop' to have a typedef.");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure4);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure5);
    });
});
