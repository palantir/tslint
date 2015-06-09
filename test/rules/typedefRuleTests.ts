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

describe("<typedef, not enabled>", () => {
    const fileName = "rules/typedef.test.ts";
    const TypedefRule = Lint.Test.getRule("typedef");

    it("enforces rules only when enabled (unspecified)", () => {
        const failures = Lint.Test.applyRuleOnFile(fileName, TypedefRule);
        assert.equal(failures.length, 0);
    });

    it("enforces rules only when enabled (disabled)", () => {
        const options = [false];
        const failures = Lint.Test.applyRuleOnFile(fileName, TypedefRule, options);
        assert.equal(failures.length, 0);
    });
});

describe.only("<typedef, enabled>", () => {
    const fileName = "rules/typedef.test.ts";
    const TypedefRule = Lint.Test.getRule("typedef");
    let actualFailures: Lint.RuleFailure[];

    function assertFailures(...failures: Lint.RuleFailure[]) {
        failures.forEach((failure) => {
            Lint.Test.assertContainsFailure(actualFailures, failure);
            actualFailures = actualFailures.filter((actualFailure) => !actualFailure.equals(failure));
        });
    }

    before(() => {
        const options = [true,
            "call-signature",
            "parameter",
            "variable-declaration",
            "property-declaration",
            "member-variable-declaration"
        ];
        actualFailures = Lint.Test.applyRuleOnFile(fileName, TypedefRule, options);
    });

    it("enforces typedef in call signatures", () => {
        const expectedFailure1 = Lint.Test.createFailure(fileName,
            [28, 6],
            [28, 7],
            "expected call-signature to have a typedef");
        const expectedFailure2 = Lint.Test.createFailure(fileName,
            [4, 17],
            [4, 18],
            "expected call-signature: 'PropDef' to have a typedef");
        const expectedFailure3 = Lint.Test.createFailure(fileName,
            [38, 21],
            [38, 22],
            "expected call-signature: 'name' to have a typedef");
        const expectedFailure4 = Lint.Test.createFailure(fileName,
            [53, 31],
            [53, 32],
            "expected call-signature: 'anotherNoTypesFn' to have a typedef");
        const expectedFailure5 = Lint.Test.createFailure(fileName,
            [8, 15],
            [8, 16],
            "expected call-signature: 'methodDef' to have a typedef");
        const expectedFailure6 = Lint.Test.createFailure(fileName,
            [12, 32],
            [12, 33],
            "expected call-signature to have a typedef");
        const expectedFailure7 = Lint.Test.createFailure(fileName,
            [16, 22],
            [16, 23],
            "expected call-signature to have a typedef");
        const expectedFailure8 = Lint.Test.createFailure(fileName,
            [42, 21],
            [42, 22],
            "expected call-signature: 'unTyped' to have a typedef");

        assertFailures(expectedFailure1, expectedFailure2, expectedFailure3, expectedFailure4,
                       expectedFailure5, expectedFailure6, expectedFailure7, expectedFailure8);
    });

    it("enforces typedef in parameter", () => {
        const expectedFailure1 = Lint.Test.createFailure(fileName,
            [27, 6],
            [27, 7],
            "expected parameter: 'a' to have a typedef");
        const expectedFailure2 = Lint.Test.createFailure(fileName,
            [28, 6],
            [28, 7],
            "expected parameter: 'b' to have a typedef");
        const expectedFailure3 = Lint.Test.createFailure(fileName,
            [48, 21],
            [48, 22],
            "expected parameter: 'type' to have a typedef");
        const expectedFailure4 = Lint.Test.createFailure(fileName,
            [53, 28],
            [53, 29],
            "expected parameter: 'a' to have a typedef");
        const expectedFailure5 = Lint.Test.createFailure(fileName,
            [53, 31],
            [53, 32],
            "expected parameter: 'b' to have a typedef");
        const expectedFailure6 = Lint.Test.createFailure(fileName,
              [61, 29],
              [61, 30],
              "expected parameter: 'n' to have a typedef");

        assertFailures(expectedFailure1, expectedFailure2, expectedFailure3, expectedFailure4, expectedFailure5, expectedFailure6);
    });

    it("enforces typedef in property declaration", () => {
        const expectedFailure = Lint.Test.createFailure(fileName,
            [22, 9],
            [22, 10],
            "expected property-declaration: 'Prop' to have a typedef");

        assertFailures(expectedFailure);
    });

    it("enforces typedef in variable declaration", () => {
        const expectedFailure1 = Lint.Test.createFailure(fileName,
            [1, 42],
            [1, 43],
            "expected variable-declaration: 'NoTypeObjectLiteralWithPropertyGetter' to have a typedef");
        const expectedFailure2 = Lint.Test.createFailure(fileName,
            [26, 14],
            [26, 15],
            "expected variable-declaration: 'NoTypesFn' to have a typedef");
        const expectedFailure3 = Lint.Test.createFailure(fileName,
            [29, 10],
            [29, 11],
            "expected variable-declaration: 'c' to have a typedef");
        const expectedFailure4 = Lint.Test.createFailure(fileName,
            [30, 10],
            [30, 11],
            "expected variable-declaration: 'd' to have a typedef");

        assertFailures(expectedFailure1, expectedFailure2, expectedFailure3, expectedFailure4);
    });

    it("enforces typedef in member variable declaration", () => {
        const expectedFailure = Lint.Test.createFailure(fileName,
            [36, 11],
            [36, 12],
            "expected member-variable-declaration: 'Member' to have a typedef");

        assertFailures(expectedFailure);
    });

    it("only has the expected failures", function() {
        if (actualFailures.length > 0) {
            assert(false, "got " + actualFailures.length + " extra errors");
        }
    });
});
