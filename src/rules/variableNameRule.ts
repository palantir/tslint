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

import * as ts from "typescript";

import * as Lint from "../index";

const BANNED_KEYWORDS = new Set(["any", "Number", "number", "String", "string", "Boolean", "boolean", "Undefined", "undefined"]);
const bannedKeywordsStr = Array.from(BANNED_KEYWORDS).map((kw) => `\`${kw}\``).join(", ");

const OPTION_LEADING_UNDERSCORE = "allow-leading-underscore";
const OPTION_TRAILING_UNDERSCORE = "allow-trailing-underscore";
const OPTION_BAN_KEYWORDS = "ban-keywords";
const OPTION_CHECK_FORMAT = "check-format";
const OPTION_ALLOW_PASCAL_CASE = "allow-pascal-case";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "variable-name",
        description: "Checks variable names for various errors.",
        optionsDescription: Lint.Utils.dedent`
            Five arguments may be optionally provided:

            * \`"${OPTION_CHECK_FORMAT}"\`: allows only camelCased or UPPER_CASED variable names
              * \`"${OPTION_LEADING_UNDERSCORE}"\` allows underscores at the beginning (only has an effect if "check-format" specified)
              * \`"${OPTION_TRAILING_UNDERSCORE}"\` allows underscores at the end. (only has an effect if "check-format" specified)
              * \`"${OPTION_ALLOW_PASCAL_CASE}"\` allows PascalCase in addition to camelCase.
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
                    OPTION_BAN_KEYWORDS,
                ],
            },
            minLength: 0,
            maxLength: 5,
        },
        optionExamples: ['[true, "ban-keywords", "check-format", "allow-leading-underscore"]'],
        type: "style",
        typescriptOnly: false,
    };

    public static FORMAT_FAILURE = "variable name must be in camelcase or uppercase";
    public static KEYWORD_FAILURE = "variable name clashes with keyword/type";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, (ctx) => walk(ctx, parseOptions(this.getOptions().ruleArguments)));
    }
}

interface Options {
    banKeywords: boolean;
    checkFormat: boolean;
    leadingUnderscore: boolean;
    trailingUnderscore: boolean;
    allowPascalCase: boolean;
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
    };

    function hasOption(name: string): boolean {
        return ruleArguments.indexOf(name) !== -1;
    }
}

function walk(ctx: Lint.WalkContext<void>, options: Options): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.BindingElement: {
                const { initializer, name, propertyName } = node as ts.BindingElement;
                if (name.kind === ts.SyntaxKind.Identifier) {
                    handleVariableNameKeyword(name);
                    // A destructuring pattern that does not rebind an expression is always an alias, e.g. `var {Foo} = ...;`.
                    // Only check if the name is rebound (`var {Foo: bar} = ...;`).
                    if (node.parent!.kind !== ts.SyntaxKind.ObjectBindingPattern || propertyName) {
                        handleVariableNameFormat(name, initializer);
                    }
                }
                break;
            }

            case ts.SyntaxKind.VariableStatement:
                // skip 'declare' keywords
                if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword)) {
                    return;
                }
                break;

            case ts.SyntaxKind.Parameter:
            case ts.SyntaxKind.PropertyDeclaration:
            case ts.SyntaxKind.VariableDeclaration: {
                const { name, initializer } = node as ts.ParameterDeclaration | ts.PropertyDeclaration | ts.VariableDeclaration;
                if (name.kind === ts.SyntaxKind.Identifier) {
                    handleVariableNameFormat(name, initializer);
                    // do not check property declarations for keywords, they are allowed to be keywords
                    if (node.kind !== ts.SyntaxKind.PropertyDeclaration) {
                        handleVariableNameKeyword(name);
                    }
                }
                break;
            }
        }

        return ts.forEachChild(node, cb);
    });

    function handleVariableNameFormat(name: ts.Identifier, initializer?: ts.Expression): void {
        if (!options.checkFormat) {
            return;
        }

        const { text } = name;
        if (initializer && isAlias(text, initializer)) {
            return;
        }

        if (!isCamelCase(text, options) && !isUpperCase(text)) {
            ctx.addFailureAtNode(name, Rule.FORMAT_FAILURE);
        }
    }

    function handleVariableNameKeyword(name: ts.Identifier): void {
        if (options.banKeywords && BANNED_KEYWORDS.has(name.text)) {
            ctx.addFailureAtNode(name, Rule.KEYWORD_FAILURE);
        }
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
    const firstCharacter = name.charAt(0);
    const lastCharacter = name.charAt(name.length - 1);
    const middle = name.substr(1, name.length - 2);

    if (name.length <= 0) {
        return true;
    }
    if (!options.leadingUnderscore && firstCharacter === "_") {
        return false;
    }
    if (!options.trailingUnderscore && lastCharacter === "_") {
        return false;
    }
    if (!options.allowPascalCase && !isLowerCase(firstCharacter)) {
        return false;
    }
    return middle.indexOf("_") === -1;
}

function isLowerCase(name: string): boolean {
    return name === name.toLowerCase();
}

function isUpperCase(name: string): boolean {
    return name === name.toUpperCase();
}
