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

// tslint:disable object-literal-sort-keys

import { hasModifier } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { isLowerCase, isUpperCase } from "../utils";

const BANNED_KEYWORDS = [
    "any",
    "Number",
    "number",
    "String",
    "string",
    "Boolean",
    "boolean",
    "Undefined",
    "undefined",
];
const bannedKeywordsSet = new Set(BANNED_KEYWORDS);
const bannedKeywordsStr = BANNED_KEYWORDS.map(kw => `\`${kw}\``).join(", ");

const OPTION_LEADING_UNDERSCORE = "allow-leading-underscore";
const OPTION_TRAILING_UNDERSCORE = "allow-trailing-underscore";
const OPTION_BAN_KEYWORDS = "ban-keywords";
const OPTION_CHECK_FORMAT = "check-format";
const OPTION_ALLOW_PASCAL_CASE = "allow-pascal-case";
const OPTION_ALLOW_SNAKE_CASE = "allow-snake-case";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "variable-name",
        description: "Checks variable names for various errors.",
        optionsDescription: Lint.Utils.dedent`
            Five arguments may be optionally provided:

            * \`"${OPTION_CHECK_FORMAT}"\`: allows only lowerCamelCased or UPPER_CASED variable names
              * \`"${OPTION_LEADING_UNDERSCORE}"\` allows underscores at the beginning (only has an effect if "check-format" specified)
              * \`"${OPTION_TRAILING_UNDERSCORE}"\` allows underscores at the end. (only has an effect if "check-format" specified)
              * \`"${OPTION_ALLOW_PASCAL_CASE}"\` allows PascalCase in addition to lowerCamelCase.
              * \`"${OPTION_ALLOW_SNAKE_CASE}"\` allows snake_case in addition to lowerCamelCase.
            * \`"${OPTION_BAN_KEYWORDS}"\`: disallows the use of certain TypeScript keywords as variable or parameter names.
              * These are: ${bannedKeywordsStr}`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    OPTION_CHECK_FORMAT,
                    OPTION_LEADING_UNDERSCORE,
                    OPTION_TRAILING_UNDERSCORE,
                    OPTION_ALLOW_PASCAL_CASE,
                    OPTION_ALLOW_SNAKE_CASE,
                    OPTION_BAN_KEYWORDS,
                ],
            },
            minLength: 0,
            maxLength: 5,
        },
        optionExamples: [[true, "ban-keywords", "check-format", "allow-leading-underscore"]],
        type: "style",
        typescriptOnly: false,
    };

    public static KEYWORD_FAILURE = "variable name clashes with keyword/type";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments));
    }
}

interface Options {
    banKeywords: boolean;
    checkFormat: boolean;
    leadingUnderscore: boolean;
    trailingUnderscore: boolean;
    allowPascalCase: boolean;
    allowSnakeCase: boolean;
}
function parseOptions(ruleArguments: string[]): Options {
    const banKeywords = hasOption(OPTION_BAN_KEYWORDS);
    return {
        banKeywords,
        // check variable name formatting by default if no options are specified
        checkFormat: !banKeywords || hasOption(OPTION_CHECK_FORMAT),
        leadingUnderscore: hasOption(OPTION_LEADING_UNDERSCORE),
        trailingUnderscore: hasOption(OPTION_TRAILING_UNDERSCORE),
        allowPascalCase: hasOption(OPTION_ALLOW_PASCAL_CASE),
        allowSnakeCase: hasOption(OPTION_ALLOW_SNAKE_CASE),
    };

    function hasOption(name: string): boolean {
        return ruleArguments.indexOf(name) !== -1;
    }
}

function walk(ctx: Lint.WalkContext<Options>): void {
    const { options, sourceFile } = ctx;
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.BindingElement: {
                const { initializer, name, propertyName } = node as ts.BindingElement;
                if (name.kind === ts.SyntaxKind.Identifier) {
                    handleVariableNameKeyword(name);
                    // A destructuring pattern that does not rebind an expression is always an alias, e.g. `var {Foo} = ...;`.
                    // Only check if the name is rebound (`var {Foo: bar} = ...;`).
                    if (
                        node.parent.kind !== ts.SyntaxKind.ObjectBindingPattern ||
                        propertyName !== undefined
                    ) {
                        handleVariableNameFormat(name, initializer);
                    }
                }
                break;
            }

            case ts.SyntaxKind.VariableStatement:
                // skip 'declare' keywords
                if (hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword)) {
                    return;
                }
                break;

            case ts.SyntaxKind.Parameter:
            case ts.SyntaxKind.PropertyDeclaration:
            case ts.SyntaxKind.VariableDeclaration: {
                const { name, initializer } = node as
                    | ts.ParameterDeclaration
                    | ts.PropertyDeclaration
                    | ts.VariableDeclaration;
                if (name.kind === ts.SyntaxKind.Identifier) {
                    handleVariableNameFormat(name, initializer);
                    // do not check property declarations for keywords, they are allowed to be keywords
                    if (node.kind !== ts.SyntaxKind.PropertyDeclaration) {
                        handleVariableNameKeyword(name);
                    }
                }
            }
        }

        return ts.forEachChild(node, cb);
    });

    function handleVariableNameFormat(name: ts.Identifier, initializer?: ts.Expression): void {
        if (!options.checkFormat) {
            return;
        }

        const { text } = name;
        if (initializer !== undefined && isAlias(text, initializer)) {
            return;
        }

        if (text.length !== 0 && !isCamelCase(text, options) && !isUpperCase(text)) {
            ctx.addFailureAtNode(name, formatFailure());
        }
    }

    function handleVariableNameKeyword(name: ts.Identifier): void {
        if (options.banKeywords && bannedKeywordsSet.has(name.text)) {
            ctx.addFailureAtNode(name, Rule.KEYWORD_FAILURE);
        }
    }

    function formatFailure(): string {
        let failureMessage = "variable name must be in lowerCamelCase";
        if (options.allowPascalCase) {
            failureMessage += ", PascalCase";
        }
        if (options.allowSnakeCase) {
            failureMessage += ", snake_case";
        }
        return `${failureMessage} or UPPER_CASE`;
    }
}

function isAlias(name: string, initializer: ts.Expression): boolean {
    switch (initializer.kind) {
        case ts.SyntaxKind.PropertyAccessExpression:
            return (initializer as ts.PropertyAccessExpression).name.text === name;
        case ts.SyntaxKind.Identifier:
            return (initializer as ts.Identifier).text === name;
        default:
            return false;
    }
}

function isCamelCase(name: string, options: Options): boolean {
    const firstCharacter = name[0];
    const lastCharacter = name[name.length - 1];
    const middle = name.slice(1, -1);

    if (!options.leadingUnderscore && firstCharacter === "_") {
        return false;
    }
    if (!options.trailingUnderscore && lastCharacter === "_") {
        return false;
    }
    if (!options.allowPascalCase && !isLowerCase(firstCharacter)) {
        return false;
    }
    if (!options.allowSnakeCase && middle.indexOf("_") !== -1) {
        return false;
    }
    return true;
}
