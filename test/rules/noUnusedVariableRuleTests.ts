/*
 * Copyright 2014 Palantir Technologies, Inc.
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

describe("<no-unused-variable>", () => {
    const Rule = Lint.Test.getRule("no-unused-variable");

    it("restricts unused imports", () => {
        const fileName = "rules/nounusedvariable-imports.test.ts";
        const failure1 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'xyz'")([3, 9], [3, 12]);
        const failure2 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'createReadStream'")([4, 9], [4, 25]);
        const failure3 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'template'")([14, 7], [14, 15]);
        const failure4 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'foo'")([17, 13], [17, 16]);
        const failure5 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'defaultExport'")([20, 8], [20, 21]);
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);

        assert.lengthOf(actualFailures, 5);
        Lint.Test.assertContainsFailure(actualFailures, failure1);
        Lint.Test.assertContainsFailure(actualFailures, failure2);
        Lint.Test.assertContainsFailure(actualFailures, failure3);
        Lint.Test.assertContainsFailure(actualFailures, failure4);
        Lint.Test.assertContainsFailure(actualFailures, failure5);
    });

    it("restricts unused variables", () => {
        const fileName = "rules/nounusedvariable-var.test.ts";
        const failure1 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'y'")([3, 5], [3, 6]);
        const failure2 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'a'")([23, 10], [23, 11]);
        const failure3 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'b'")([23, 13], [23, 14]);
        const failure4 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'d'")([26, 10], [26, 11]);
        const failure5 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'e'")([26, 13], [26, 14]);
        const failure6 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'a'")([35, 7], [35, 8]);
        const failure7 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'e'")([43, 9], [43, 10]);
        const failure8 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'b'")([49, 11], [49, 12]);

        const actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);

        assert.lengthOf(actualFailures, 8);
        Lint.Test.assertContainsFailure(actualFailures, failure1);
        Lint.Test.assertContainsFailure(actualFailures, failure2);
        Lint.Test.assertContainsFailure(actualFailures, failure3);
        Lint.Test.assertContainsFailure(actualFailures, failure4);
        Lint.Test.assertContainsFailure(actualFailures, failure5);
        Lint.Test.assertContainsFailure(actualFailures, failure6);
        Lint.Test.assertContainsFailure(actualFailures, failure7);
        Lint.Test.assertContainsFailure(actualFailures, failure8);
    });

    it("restricts unused functions", () => {
        const fileName = "rules/nounusedvariable-function.test.ts";
        const failure1 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'func2'")([5, 5], [5, 10]);
        const failure2 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'func3'")([9, 10], [9, 15]);

        const actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);

        assert.lengthOf(actualFailures, 2);
        Lint.Test.assertContainsFailure(actualFailures, failure1);
        Lint.Test.assertContainsFailure(actualFailures, failure2);
    });

    it("restricts unused class members", () => {
        const fileName = "rules/nounusedvariable-class.test.ts";
        const failure1 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'z2'")([2, 13], [2, 15]);
        const failure2 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'mfunc4'")([18, 13], [18, 19]);

        const actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);

        assert.lengthOf(actualFailures, 2);
        Lint.Test.assertContainsFailure(actualFailures, failure1);
        Lint.Test.assertContainsFailure(actualFailures, failure2);
    });

    it("restricts unused parameters", () => {
        const fileName = "rules/nounusedvariable-parameter.test.ts";
        const failure1 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'args'")([1, 48], [1, 52]);
        const failure2 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'y'")([5, 34], [5, 35]);
        const failure3 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'y'")([9, 35], [9, 36]);
        const failure4 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'x'")([18, 25], [18, 26]);
        const failure5 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'y'")([38, 27], [38, 28]);
        const failure6 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'b'")([46, 22], [46, 23]);
        const failure7 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'b'")([50, 23], [50, 24]);
        const failure8 = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'x'")([55, 20], [55, 21]);

        const actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule, [true, "check-parameters"]);

        assert.lengthOf(actualFailures, 8);
        Lint.Test.assertContainsFailure(actualFailures, failure1);
        Lint.Test.assertContainsFailure(actualFailures, failure2);
        Lint.Test.assertContainsFailure(actualFailures, failure3);
        Lint.Test.assertContainsFailure(actualFailures, failure4);
        Lint.Test.assertContainsFailure(actualFailures, failure5);
        Lint.Test.assertContainsFailure(actualFailures, failure6);
        Lint.Test.assertContainsFailure(actualFailures, failure7);
        Lint.Test.assertContainsFailure(actualFailures, failure8);
    });

    it("shouldn't find false positives", () => {
        const fileName = "rules/nounusedvariable-falsepositives.test.ts";
        const actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule);

        assert.lengthOf(actualFailures, 0);
    });

    describe("with react option", () => {
        describe("set", () => {
            function describeSuite(importModuleName: string) {
                const suffix = moduleNameToFilenameSuffix(importModuleName);
                describe(`importing \"${importModuleName}\"`, () => {
                    it("should not fail if only JSX present", () => {
                        assertNoFailures(`rules/nounusedvariable-react1-${suffix}.test.tsx`, true);
                    });

                    it("should not fail if React namespace is used", () => {
                        assertNoFailures(`rules/nounusedvariable-react2-${suffix}.test.tsx`, true);
                    });

                    it("should fail if neither JSX nor React namespace is seen", () => {
                        assertSingleFailure(`rules/nounusedvariable-react3-${suffix}.test.tsx`, true);
                    });
                });
            }

            describeSuite("react");
            describeSuite("react/addons");

            it("should not fail if JSX self-closing element is used", () => {
                assertNoFailures("rules/nounusedvariable-react4-react.test.tsx", true);
            });
        });

        describe("not set", () => {
            function describeSuite(importModuleName: string) {
                const suffix = moduleNameToFilenameSuffix(importModuleName);
                describe(`importing \"${importModuleName}\"`, () => {
                    it("should fail if only JSX present", () => {
                        assertSingleFailure(`rules/nounusedvariable-react1-${suffix}.test.tsx`, false);
                    });

                    it("should not fail if React namespace is used", () => {
                        assertNoFailures(`rules/nounusedvariable-react2-${suffix}.test.tsx`, false);
                    });

                    it("should fail if neither JSX nor React namespace is seen", () => {
                        assertSingleFailure(`rules/nounusedvariable-react3-${suffix}.test.tsx`, false);
                    });
                });
            }

            describeSuite("react");
            describeSuite("react/addons");
        });

        function assertNoFailures(fileName: string, isReactOptionSet: boolean) {
            const actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule, isReactOptionSet ? [true, "react"] : [true]);
            assert.lengthOf(actualFailures, 0);
        }

        function assertSingleFailure(fileName: string, isReactOptionSet: boolean) {
            const expectedFailure = Lint.Test.createFailuresOnFile(fileName, Rule.FAILURE_STRING + "'React'")([1, 13], [1, 18]);
            const actualFailures = Lint.Test.applyRuleOnFile(fileName, Rule, isReactOptionSet ? [true, "react"] : [true]);
            assert.lengthOf(actualFailures, 1);
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
        }

        function moduleNameToFilenameSuffix(moduleName: string): string {
            return moduleName.replace(/\//g, "_");
        }
    });
});
