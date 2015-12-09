/**
 * @license
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

import * as ts from "typescript";
import * as Lint from "../lint";
import * as BanRule from "./banRule";

export class Rule extends BanRule.Rule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-console",
        description: "Bans the use of specified `console` methods.",
        rationale: "In general, \`console\` methods aren't appropriate for production code.",
        optionsDescription: "A list of method names to ban.",
        options: {
            type: "list",
            listType: {
                type: "string",
            },
        },
        optionExamples: [`[true, ["log", "error"]]`],
        type: "functionality",
    };
    /* tslint:enable:object-literal-sort-keys */

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = this.getOptions();
        const consoleBanWalker = new BanRule.BanFunctionWalker(sourceFile, this.getOptions());
        for (const option of options.ruleArguments) {
            consoleBanWalker.addBannedFunction(["console", option]);
        }
        return this.applyWithWalker(consoleBanWalker);
    }
}
