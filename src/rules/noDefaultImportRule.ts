/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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

import { isImportDeclaration, isNamedImports, isStringLiteral } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const fromModulesConfigOptionName = "fromModules";
interface RawConfigOptions {
    [fromModulesConfigOptionName]: string;
}
interface Options {
    [fromModulesConfigOptionName]: RegExp;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-default-import",
        description: "Disallows importing default members from certain ES6-style modules.",
        descriptionDetails: "Import named members instead.",
        rationale: Lint.Utils.dedent`
            Named imports/exports [promote clarity](https://github.com/palantir/tslint/issues/1182#issue-151780453).
            In addition, current tooling differs on the correct way to handle default imports/exports.
            Avoiding them all together can help avoid tooling bugs and conflicts.

            The rule supposed to narrow the scope of your changes in the case of monorepo.
            Say, you have packages \`A\`, \`B\`, \`C\` and \`utils\`, where \`A\`, \`B\`, \`C\` dependends on \`utils\`,
            which is full of default exports.
            \`"no-default-export"\` requires you to remove default _export_ from \`utils\`, which leads to changes
            in packages \`A\`, \`B\`, \`C\`. It's harder to get merged bigger changeset by various reasons (harder to get your code approved
            due to a number of required reviewers; longer build time due to a number of affected packages)
            and could result in ignored \`"no-default-export"\` rule in \`utils'\`.

            Unlike \`"no-default-export"\`, the rule requires you to replace default _import_ with named only in \`A\` you work on,
            and \`utils\` you import from.`,
        optionsDescription: "optionsDescription",
        options: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    [fromModulesConfigOptionName]: { type: "string" },
                },
                required: ["fromModules"],
            },
        },
        optionExamples: [
            [true, { [fromModulesConfigOptionName]: "^palantir-|^_internal-*|^\\./|^\\.\\./" }],
        ],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Import of default members from this module is forbidden. Import named member instead";

    public static getNamedDefaultImport(namedBindings: ts.NamedImports): ts.Identifier | null {
        for (const importSpecifier of namedBindings.elements) {
            if (
                importSpecifier.propertyName !== undefined &&
                importSpecifier.propertyName.text === "default"
            ) {
                return importSpecifier.propertyName;
            }
        }
        return null;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.getRuleOptions(this.ruleArguments));
    }
    private isFromModulesConfigOption(
        option: boolean | RawConfigOptions,
    ): option is RawConfigOptions {
        return typeof option === "object" && option[fromModulesConfigOptionName] !== undefined;
    }
    private getRuleOptions(options: ReadonlyArray<boolean | RawConfigOptions>): Options {
        const fromModuleConfigOption = options.find<RawConfigOptions>(
            this.isFromModulesConfigOption,
        );
        if (
            fromModuleConfigOption !== undefined &&
            typeof fromModuleConfigOption[fromModulesConfigOptionName] === "string"
        ) {
            return {
                [fromModulesConfigOptionName]: new RegExp(
                    fromModuleConfigOption[fromModulesConfigOptionName],
                ),
            };
        } else {
            return {
                [fromModulesConfigOptionName]: new RegExp("^\\./|^\\.\\./"),
            };
        }
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    if (ctx.sourceFile.isDeclarationFile || !ts.isExternalModule(ctx.sourceFile)) {
        return;
    }
    for (const statement of ctx.sourceFile.statements) {
        if (isImportDeclaration(statement)) {
            const { importClause, moduleSpecifier } = statement;
            if (
                importClause !== undefined &&
                isStringLiteral(moduleSpecifier) &&
                ctx.options[fromModulesConfigOptionName].test(moduleSpecifier.text)
            ) {
                // module name matches specified in rule config
                if (importClause.name !== undefined) {
                    // `import Foo...` syntax
                    const defaultImportedName = importClause.name;
                    ctx.addFailureAtNode(defaultImportedName, Rule.FAILURE_STRING);
                } else if (
                    importClause.namedBindings !== undefined &&
                    isNamedImports(importClause.namedBindings)
                ) {
                    // `import { default...` syntax
                    const defaultMember = Rule.getNamedDefaultImport(importClause.namedBindings);
                    if (defaultMember !== null) {
                        ctx.addFailureAtNode(defaultMember, Rule.FAILURE_STRING);
                    }
                }
            }
        }
    }
}
