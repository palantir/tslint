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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { isUpperCase } from "../utils";

const OPTION_ALWAYS = "always-prefix";
const OPTION_NEVER = "never-prefix";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "interface-name",
        description: "Requires interface names to begin with a capital 'I'",
        rationale: "Makes it easy to differentiate interfaces from regular classes at a glance.",
        optionsDescription: Lint.Utils.dedent`
            One of the following two options must be provided:

            * \`"${OPTION_ALWAYS}"\` requires interface names to start with an "I"
            * \`"${OPTION_NEVER}"\` requires interface names to not have an "I" prefix`,
        options: {
            type: "string",
            enum: [OPTION_ALWAYS, OPTION_NEVER]
        },
        optionExamples: [[true, OPTION_ALWAYS], [true, OPTION_NEVER]],
        type: "style",
        typescriptOnly: true
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "interface name must start with a capitalized I";
    public static FAILURE_STRING_NO_PREFIX = 'interface name must not have an "I" prefix';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            never: this.ruleArguments.indexOf(OPTION_NEVER) !== -1
        });
    }
}

function walk(ctx: Lint.WalkContext<{ never: boolean }>): void {
    const {
        options: { never }
    } = ctx;
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (utils.isInterfaceDeclaration(node)) {
            const { name } = node;
            if (never && hasPrefixI(name.text)) {
                ctx.addFailureAtNode(name, Rule.FAILURE_STRING_NO_PREFIX);
            } else if (!never && name.text[0] !== "I") {
                ctx.addFailureAtNode(name, Rule.FAILURE_STRING);
            }
        } else {
            return ts.forEachChild(node, cb);
        }
    });
}

function hasPrefixI(name: string): boolean {
    // Allow IndexedDB interfaces
    return name.length >= 2 && name[0] === "I" && isUpperCase(name[1]) && !name.startsWith("IDB");
}
