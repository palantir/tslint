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

const OPTION_SUFFIX_NEEDS = "suffix-needs";
const OPTION_SUFFIX_NEVER = "suffix-never";
const OPTION_PREFIX_NEEDS = "prefix-needs";
const OPTION_PREFIX_NEVER = "prefix-never";

interface WalkOptions {
    prefixNeeds: string[];
    prefixNever: string[];
    suffixNeeds: string[];
    suffixNever: string[];
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "interface-name",
        description: "Interface names needs or not to contain a specific prefix or suffix",
        rationale: "Define a rule for how interfaces should be designed in the application.",
        optionsDescription: Lint.Utils.dedent`
            Possible options can be provided, together or separately:

            * \`"${OPTION_SUFFIX_NEEDS}"\` requires interface names finish with one or more specified content
            * \`"${OPTION_SUFFIX_NEVER}"\` requires interface names NOT finish with one or more specified content
            * \`"${OPTION_PREFIX_NEEDS}"\` requires interface names starts with one or more specified content
            * \`"${OPTION_PREFIX_NEVER}"\` requires interface names NOT starts with one or more specified content`,
        options: {
            type: "object",
            properties: {
                [OPTION_SUFFIX_NEEDS]: {
                    oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
                },
                [OPTION_SUFFIX_NEVER]: {
                    oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
                },
                [OPTION_PREFIX_NEEDS]: {
                    oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
                },
                [OPTION_PREFIX_NEVER]: {
                    oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
                },
            },
            additionalProperties: false,
        },
        optionExamples: [
            [true, { [OPTION_SUFFIX_NEEDS]: "Contract" }],
            [true, { [OPTION_SUFFIX_NEEDS]: ["Interface", "Contract"] }],
            [true, { [OPTION_SUFFIX_NEVER]: "Contract" }],
            [true, { [OPTION_SUFFIX_NEVER]: ["Interface", "Contract"] }],
            [true, { [OPTION_SUFFIX_NEEDS]: "Contract", [OPTION_SUFFIX_NEVER]: "Interface" }],
            [true, { [OPTION_PREFIX_NEEDS]: "I" }],
            [true, { [OPTION_PREFIX_NEEDS]: ["I", "Interface"] }],
            [true, { [OPTION_PREFIX_NEVER]: "I" }],
            [true, { [OPTION_PREFIX_NEVER]: ["I", "Interface"] }],
            [true, { [OPTION_PREFIX_NEEDS]: "I", [OPTION_PREFIX_NEVER]: "Interface" }],
        ],
        type: "style",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_SUFFIX_NEEDS = "interface name must finish with specified suffix";
    public static FAILURE_SUFFIX_NEVER = "interface name must not finish with specified suffix";
    public static FAILURE_PREFIX_NEEDS = "interface name must start with specified prefix";
    public static FAILURE_PREFIX_NEVER = "interface name must not start with specified prefix";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = parseWalkOptions(this.ruleArguments);

        return this.applyWithFunction(sourceFile, walk, options);
    }
}

function walk(ctx: Lint.WalkContext<WalkOptions>): void {
    const {
        options: { prefixNeeds, prefixNever, suffixNeeds, suffixNever },
    } = ctx;

    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (!utils.isInterfaceDeclaration(node)) {
            return ts.forEachChild(node, cb);
        }

        const { name } = node;
        const prefixNeverI = prefixNever.indexOf("I") > -1;
        const prefixNeedsI = prefixNeeds.indexOf("I") > -1;

        if ((prefixNeverI || prefixNeedsI) && !cantDecide(name.text)) {
            if (prefixNeverI && hasPrefixI(name.text)) {
                ctx.addFailureAtNode(name, `${Rule.FAILURE_PREFIX_NEVER}: I`);
            } else if (prefixNeedsI && !hasPrefixI(name.text)) {
                ctx.addFailureAtNode(name, `${Rule.FAILURE_PREFIX_NEEDS}: I`);
            }
        }

        const prefixNeedsWithoutI = prefixNeeds.filter((prefix: string) => prefix !== "I");
        const prefixNeverWithoutI = prefixNever.filter((prefix: string) => prefix !== "I");

        if (prefixNeedsWithoutI.length > 0) {
            prefixNeedsWithoutI
                .filter((p: string) => !hasSpecificPrefix(name.text, p))
                .forEach((p: string) =>
                    ctx.addFailureAtNode(name, `${Rule.FAILURE_PREFIX_NEEDS}: ${p}`),
                );
        }

        if (prefixNeverWithoutI.length > 0) {
            prefixNeverWithoutI
                .filter((p: string) => hasSpecificPrefix(name.text, p))
                .forEach((p: string) =>
                    ctx.addFailureAtNode(name, `${Rule.FAILURE_PREFIX_NEVER}: ${p}`),
                );
        }

        suffixNeeds
            .filter((s: string) => !hasSpecificSuffix(name.text, s))
            .forEach((s: string) =>
                ctx.addFailureAtNode(name, `${Rule.FAILURE_SUFFIX_NEEDS}: ${s}`),
            );

        suffixNever
            .filter((s: string) => hasSpecificSuffix(name.text, s))
            .forEach((s: string) =>
                ctx.addFailureAtNode(name, `${Rule.FAILURE_SUFFIX_NEVER}: ${s}`),
            );
    });
}

function hasPrefixI(name: string): boolean {
    return name.length >= 3 && name[0] === "I" && /^[A-Z]*$/.test(name[1]);
}

function hasSpecificPrefix(name: string, prefix: string): boolean {
    return prefix.length > 0 && name.slice(0, prefix.length) === prefix;
}

function hasSpecificSuffix(name: string, suffix: string): boolean {
    return (
        suffix.length > 0 &&
        name
            .split("")
            .reverse()
            .join("")
            .slice(0, suffix.length)
            .split("")
            .reverse()
            .join("") === suffix
    );
}

function cantDecide(name: string): boolean {
    return (
        // Case ID
        (name.length === 2 && name[0] === "I" && /^[A-Z]*$/.test(name[1])) ||
        // Case IDB or ID42
        (name.length >= 2 &&
            name[0] === "I" &&
            /^[A-Z]*$/.test(name[1]) &&
            !/^[a-z]*$/.test(name[2]))
    );
}

function parseWalkOptions(options: any[]): WalkOptions {
    if (!options[0]) {
        return {
            prefixNeeds: [],
            prefixNever: [],
            suffixNeeds: [],
            suffixNever: [],
        };
    }

    // tslint:no-unsafe-any
    const allOptions = options.reduce(
        (acc: any, option: any) => ({
            ...acc,
            ...(typeof option === "object" ? option : {}),
        }),
        {},
    );

    // tslint:disable-next-line:strict-boolean-expressions no-unsafe-any
    const suffixNeeds: string | string[] = allOptions[OPTION_SUFFIX_NEEDS] || [];
    // tslint:disable-next-line:strict-boolean-expressions no-unsafe-any
    const suffixNever: string | string[] = allOptions[OPTION_SUFFIX_NEVER] || [];
    // tslint:disable-next-line:strict-boolean-expressions no-unsafe-any
    const prefixNeeds: string | string[] = allOptions[OPTION_PREFIX_NEEDS] || [];
    // tslint:disable-next-line:strict-boolean-expressions no-unsafe-any
    const prefixNever: string | string[] = allOptions[OPTION_PREFIX_NEVER] || [];

    return {
        prefixNeeds: Array.isArray(prefixNeeds) ? prefixNeeds : [prefixNeeds],
        prefixNever: Array.isArray(prefixNever) ? prefixNever : [prefixNever],
        suffixNeeds: Array.isArray(suffixNeeds) ? suffixNeeds : [suffixNeeds],
        suffixNever: Array.isArray(suffixNever) ? suffixNever : [suffixNever],
    };
}
