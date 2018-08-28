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

import {
    getChildOfKind,
    hasModifier,
    isFunctionExpression,
    isIdentifier,
    isMethodDeclaration,
    isPropertyAssignment,
    isShorthandPropertyAssignment
} from "tsutils";
import * as ts from "typescript";
import * as Lint from "..";

const OPTION_VALUE_NEVER = "never";
const OPTION_KEY_PROPERTY = "property";
const OPTION_KEY_METHOD = "method";

interface RawOptions {
    [OPTION_KEY_PROPERTY]?: "never" | "always";
    [OPTION_KEY_METHOD]?: "never" | "always";
}

interface Options {
    enforceShorthandMethods: boolean;
    enforceShorthandProperties: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "object-literal-shorthand",
        description: "Enforces/disallows use of ES6 object literal shorthand.",
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`
        If the \'never\' option is provided, any shorthand object literal syntax will cause a failure.
        With \`{"property": "never"}\` provided, the rule fails on property shothands only,
        and respectively with \`{"method": "never"}\`, the rule fails only on method shorthands`,
        options: {
            oneOf: [
                {
                    type: "string",
                    enum: [OPTION_VALUE_NEVER]
                },
                {
                    type: "object",
                    properties: {
                        [OPTION_KEY_PROPERTY]: {
                            type: "string",
                            enum: [OPTION_VALUE_NEVER]
                        },
                        [OPTION_KEY_METHOD]: {
                            type: "string",
                            enum: [OPTION_VALUE_NEVER]
                        }
                    },
                    minProperties: 1,
                    maxProperties: 2
                }
            ]
        },
        optionExamples: [
            true,
            [true, OPTION_VALUE_NEVER],
            [true, { [OPTION_KEY_PROPERTY]: OPTION_VALUE_NEVER }]
        ],
        type: "style",
        typescriptOnly: false
    };
    /* tslint:enable:object-literal-sort-keys */

    public static getLonghandPropertyErrorMessage(nodeText: string) {
        return `Expected property shorthand in object literal ('${nodeText}').`;
    }
    public static getLonghandMethodErrorMessage(nodeText: string) {
        return `Expected method shorthand in object literal ('${nodeText}').`;
    }
    public static getDisallowedShorthandErrorMessage(options: Options) {
        if (options.enforceShorthandMethods && !options.enforceShorthandProperties) {
            return "Shorthand property assignments have been disallowed.";
        } else if (!options.enforceShorthandMethods && options.enforceShorthandProperties) {
            return "Shorthand method assignments have been disallowed.";
        }
        return "Shorthand property and method assignments have been disallowed.";
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.ruleArguments));
    }
    private parseOptions(options: Array<string | RawOptions>): Options {
        if (options.indexOf(OPTION_VALUE_NEVER) !== -1) {
            return {
                enforceShorthandMethods: false,
                enforceShorthandProperties: false
            };
        }
        const optionsObject: RawOptions | undefined = options.find(
            (el: string | RawOptions): el is RawOptions =>
                typeof el === "object" &&
                (el[OPTION_KEY_PROPERTY] === "never" || el[OPTION_KEY_METHOD] === "never")
        );
        if (optionsObject !== undefined) {
            return {
                enforceShorthandMethods: !(optionsObject[OPTION_KEY_METHOD] === "never"),
                enforceShorthandProperties: !(optionsObject[OPTION_KEY_PROPERTY] === "never")
            };
        } else {
            return {
                enforceShorthandMethods: true,
                enforceShorthandProperties: true
            };
        }
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { enforceShorthandMethods, enforceShorthandProperties } = ctx.options;
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (
            enforceShorthandProperties &&
            isPropertyAssignment(node) &&
            node.name.kind === ts.SyntaxKind.Identifier &&
            isIdentifier(node.initializer) &&
            node.name.text === node.initializer.text
        ) {
            ctx.addFailureAtNode(
                node,
                Rule.getLonghandPropertyErrorMessage(`{${node.name.text}}`),
                Lint.Replacement.deleteFromTo(node.name.end, node.end)
            );
        } else if (
            enforceShorthandMethods &&
            isPropertyAssignment(node) &&
            isFunctionExpression(node.initializer) &&
            // allow named function expressions
            node.initializer.name === undefined
        ) {
            const [name, fix] = handleLonghandMethod(node.name, node.initializer, ctx.sourceFile);
            ctx.addFailure(
                node.getStart(ctx.sourceFile),
                getChildOfKind(node.initializer, ts.SyntaxKind.OpenParenToken, ctx.sourceFile)!.pos,
                Rule.getLonghandMethodErrorMessage(`{${name}() {...}}`),
                fix
            );
        } else if (!enforceShorthandProperties && isShorthandPropertyAssignment(node)) {
            ctx.addFailureAtNode(
                node.name,
                Rule.getDisallowedShorthandErrorMessage(ctx.options),
                Lint.Replacement.appendText(node.getStart(ctx.sourceFile), `${node.name.text}: `)
            );
        } else if (
            !enforceShorthandMethods &&
            isMethodDeclaration(node) &&
            node.parent!.kind === ts.SyntaxKind.ObjectLiteralExpression
        ) {
            ctx.addFailureAtNode(
                node.name,
                Rule.getDisallowedShorthandErrorMessage(ctx.options),
                fixShorthandMethodDeclaration(node, ctx.sourceFile)
            );
        }
        return ts.forEachChild(node, cb);
    });
}

function fixShorthandMethodDeclaration(node: ts.MethodDeclaration, sourceFile: ts.SourceFile) {
    const isGenerator = node.asteriskToken !== undefined;
    const isAsync = hasModifier(node.modifiers, ts.SyntaxKind.AsyncKeyword);

    return Lint.Replacement.replaceFromTo(
        node.getStart(sourceFile),
        node.name.end,
        `${node.name.getText(sourceFile)}:${isAsync ? " async" : ""} function${
            isGenerator ? "*" : ""
        }`
    );
}

function handleLonghandMethod(
    name: ts.PropertyName,
    initializer: ts.FunctionExpression,
    sourceFile: ts.SourceFile
): [string, Lint.Fix] {
    const nameStart = name.getStart(sourceFile);
    let fix: Lint.Fix = Lint.Replacement.deleteFromTo(
        name.end,
        getChildOfKind(initializer, ts.SyntaxKind.OpenParenToken)!.pos
    );
    let prefix = "";
    if (initializer.asteriskToken !== undefined) {
        prefix = "*";
    }
    if (hasModifier(initializer.modifiers, ts.SyntaxKind.AsyncKeyword)) {
        prefix = `async ${prefix}`;
    }
    if (prefix !== "") {
        fix = [fix, Lint.Replacement.appendText(nameStart, prefix)];
    }
    return [prefix + sourceFile.text.substring(nameStart, name.end), fix];
}
