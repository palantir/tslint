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
import * as Lint from "../lint";

describe("<typedefWhitespace, not enabled>", () => {
    const fileName = "rules/typedefWhitespace.test.ts";
    const TypedefWhitespaceRule = Lint.Test.getRule("typedefWhitespace");

    it("enforces rules only when enabled (unspecified)", () => {
        const failures = Lint.Test.applyRuleOnFile(fileName, TypedefWhitespaceRule);
        assert.equal(failures.length, 0);
    });

    it("enforces rules only when enabled (disabled)", () => {
        const options = [false];
        const failures = Lint.Test.applyRuleOnFile(fileName, TypedefWhitespaceRule, options);
        assert.equal(failures.length, 0);
    });
});

describe("<typedefWhitespace, required>", () => {
    const fileName = "rules/typedefWhitespace.test.ts";
    const TypedefWhitespaceRule = Lint.Test.getRule("typedefWhitespace");
    let actualFailures: Lint.RuleFailure[];

    before(() => {
        const options = [true, {
            "call-signature": "space",
            "index-signature": "space",
            "parameter": "space",
            "property-declaration": "space",
            "variable-declaration": "space"
        }];
        actualFailures = Lint.Test.applyRuleOnFile(fileName, TypedefWhitespaceRule, options);
    });

    it("enforces whitespace in call signatures", () => {
        const expectedFailure1 = Lint.Test.createFailure(fileName, [4, 15], [4, 16], "expected space in call-signature");
        const expectedFailure2 = Lint.Test.createFailure(fileName, [25, 59], [25, 60], "expected space in call-signature");
        const expectedFailure3 = Lint.Test.createFailure(fileName, [52, 22], [52, 23], "expected space in call-signature");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
    });

    it("enforces whitespace in index signature", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [48, 11], [48, 12], "expected space in index-signature");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace in parameter", () => {
        const expectedFailure1 = Lint.Test.createFailure(fileName, [25, 39], [25, 40], "expected space in parameter");
        const expectedFailure2 = Lint.Test.createFailure(fileName, [25, 50], [25, 51], "expected space in parameter");
        const expectedFailure3 = Lint.Test.createFailure(fileName, [48, 11], [48, 12], "expected space in parameter");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
    });

    it("enforces whitespace in property declaration", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [18, 9], [18, 10], "expected space in property-declaration");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces whitespace in variable declarator", () => {
        const expectedFailure1 = Lint.Test.createFailure(fileName, [26, 10], [26, 11], "expected space in variable-declaration");
        const expectedFailure2 = Lint.Test.createFailure(fileName, [27, 10], [27, 11], "expected space in variable-declaration");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
    });
});

describe("<typedefWhitespace, not allowed>", () => {
    const fileName = "rules/typedefWhitespace.test.ts";
    const TypedefWhitespaceRule = Lint.Test.getRule("typedefWhitespace");
    let actualFailures: Lint.RuleFailure[];

    before(() => {
        const options = [true, {
            "call-signature": "nospace",
            "index-signature": "nospace",
            "parameter": "nospace",
            "property-declaration": "nospace",
            "variable-declaration": "nospace"
        }];
        actualFailures = Lint.Test.applyRuleOnFile(fileName, TypedefWhitespaceRule, options);
    });

    it("enforces no whitespace in call signatures", () => {
        const expectedFailure1 = Lint.Test.createFailure(fileName, [12, 15], [12, 16], "expected nospace in call-signature");
        const expectedFailure2 = Lint.Test.createFailure(fileName, [36, 63], [36, 64], "expected nospace in call-signature");
        const expectedFailure3 = Lint.Test.createFailure(fileName, [62, 22], [62, 23], "expected nospace in call-signature");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
    });

    it("enforces no whitespace in indexSignature", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [58, 11], [58, 12], "expected nospace in index-signature");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces no whitespace in parameter", () => {
        const expectedFailure1 = Lint.Test.createFailure(fileName, [36, 41], [36, 42], "expected nospace in parameter");
        const expectedFailure2 = Lint.Test.createFailure(fileName, [36, 53], [36, 54], "expected nospace in parameter");
        const expectedFailure3 = Lint.Test.createFailure(fileName, [58, 11], [58, 12], "expected nospace in parameter");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure3);
    });

    it("enforces no whitespace in propertySignature", () => {
        const expectedFailure = Lint.Test.createFailure(fileName, [22, 9], [22, 10], "expected nospace in property-declaration");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
    });

    it("enforces no whitespace in variable declarator", () => {
        const expectedFailure1 = Lint.Test.createFailure(fileName, [37, 10], [37, 11], "expected nospace in variable-declaration");
        const expectedFailure2 = Lint.Test.createFailure(fileName, [38, 10], [38, 11], "expected nospace in variable-declaration");

        Lint.Test.assertContainsFailure(actualFailures, expectedFailure1);
        Lint.Test.assertContainsFailure(actualFailures, expectedFailure2);
    });
});
