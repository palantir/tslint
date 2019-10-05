/**
 * @license
 * Copyright 2019 Palantir Technologies, Inc.
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

import * as Lint from "../../index";

// tslint:disable: object-literal-sort-keys
export const codeExamples = [
    {
        description: "Disallows usages of a non-awaited Promise as boolean.",
        config: Lint.Utils.dedent`
            "rules": { "no-promise-as-boolean": true }
        `,
        pass: Lint.Utils.dedent`
            async function waiter(custumerDecisionPromise: Promise<any>) {
                if (await custumerDecisionPromise) {
                    console.log("Customer ready to take an order.")
                }
            }
        `,
        fail: Lint.Utils.dedent`
            async function waiter(custumerDecisionPromise: Promise<any>) {
                if (custumerDecisionPromise) {
                    console.log("Customer ready to take an order.")
                }
            }
        `,
    },
    {
        description: "Disallows usages of a non-awaited third-party promise as boolean.",
        config: Lint.Utils.dedent`
            "rules": { "no-promise-as-boolean": [true, { "promise-classes": ["CustomPromise"] }] }
        `,
        pass: Lint.Utils.dedent`
            function printOrdersPerLine(orderId: number, orderedFoodPromise: CustomPromise<string[]>) {
                orderedFoodPromise.then(orderedFood => {
                    console.log(\`\${orderId} contains the following items:\`);

                    for (let index = 0; orderedFood; index++) {
                        console.log("orderedFood[index]");
                    }

                    console.log("Done.");
                })
            }
        `,
        fail: Lint.Utils.dedent`
            function printOrdersPerLine(orderId: number, orderedFoodPromise: CustomPromise<string[]>) {
                console.log(\`\${orderId} contains the following items:\`);

                for (let index = 0; orderedFoodPromise; index++) {
                    console.log("orderedFoodPromise[index]");
                }

                console.log("Done.");
            }
        `,
    },
];
