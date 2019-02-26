/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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
    hasModifier,
    isCallExpression,
    isIdentifier,
    isPropertyAccessExpression,
    isTypeOfExpression,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_IGNORE_STATIC = "ignore-static";
const OPTION_WHITELIST = "whitelist";
const OPTION_ALLOW_TYPEOF = "allow-typeof";
const OPTION_ALLOW_DELETE = "allow-delete";

const OPTION_WHITELIST_EXAMPLE = [
    true,
    {
        [OPTION_IGNORE_STATIC]: true,
        [OPTION_WHITELIST]: ["expect"],
        [OPTION_ALLOW_TYPEOF]: true,
    },
];

interface Options {
    allowDelete: boolean;
    allowTypeof: boolean;
    ignoreStatic: boolean;
    whitelist: Set<string>;
}

interface OptionsInput {
    [OPTION_ALLOW_DELETE]?: boolean;
    [OPTION_ALLOW_TYPEOF]?: boolean;
    [OPTION_IGNORE_STATIC]?: boolean;
    [OPTION_WHITELIST]?: string[];
}

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unbound-method",
        description: "Warns when a method is used outside of a method call.",
        optionsDescription: Lint.Utils.dedent`
            You may additionally pass "${OPTION_IGNORE_STATIC}" to ignore static methods, or an options object.
            
            The object may have three properties:
            
            * "${OPTION_IGNORE_STATIC}" - to ignore static methods.
            * "${OPTION_ALLOW_TYPEOF}" - ignore methods referenced in a typeof expression.
            * "${OPTION_WHITELIST}" - ignore method references in parameters of specifed function calls.
            
            `,
        options: {
            anyOf: [
                {
                    type: "string",
                    enum: [OPTION_IGNORE_STATIC],
                },
                {
                    type: "object",
                    properties: {
                        [OPTION_ALLOW_TYPEOF]: { type: "boolean" },
                        [OPTION_IGNORE_STATIC]: { type: "boolean" },
                        [OPTION_WHITELIST]: {
                            type: "array",
                            items: { type: "string" },
                            minLength: 1,
                        },
                    },
                },
            ],
        },
        optionExamples: [true, [true, OPTION_IGNORE_STATIC], OPTION_WHITELIST_EXAMPLE],
        rationale: Lint.Utils.dedent`
            Class functions don't preserve the class scope when passed as standalone variables.
            For example, this code will log the global scope (\`window\`/\`global\`), not the class instance:

            \`\`\`
            class MyClass {
                public log(): void {
                    console.log(this);
                }
            }

            const instance = new MyClass();
            const log = instance.log;

            log();
            \`\`\`

            You need to either use an arrow lambda (\`() => {...}\`) or call the function with the correct scope.

            \`\`\`
            class MyClass {
                public logArrowBound = (): void => {
                    console.log(bound);
                };

                public logManualBind(): void {
                    console.log(this);
                }
            }

            const instance = new MyClass();
            const logArrowBound = instance.logArrowBound;
            const logManualBind = instance.logManualBind.bind(instance);

            logArrowBound();
            logManualBind();
            \`\`\`
        `,
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
        "Avoid referencing unbound methods which may cause unintentional scoping of 'this'.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(
            sourceFile,
            walk,
            parseArguments(this.ruleArguments),
            program.getTypeChecker(),
        );
    }
}

function parseArguments(args: Array<string | OptionsInput>): Options {
    const options: Options = {
        allowDelete: false,
        allowTypeof: false,
        ignoreStatic: false,
        whitelist: new Set(),
    };

    for (const arg of args) {
        if (typeof arg === "string") {
            if (arg === OPTION_IGNORE_STATIC) {
                options.ignoreStatic = true;
            }
        } else {
            options.allowDelete = arg[OPTION_ALLOW_DELETE] || false;
            options.allowTypeof = arg[OPTION_ALLOW_TYPEOF] || false;
            options.ignoreStatic = arg[OPTION_IGNORE_STATIC] || false;
            options.whitelist = new Set(arg[OPTION_WHITELIST]);
        }
    }

    return options;
}

function walk(ctx: Lint.WalkContext<Options>, tc: ts.TypeChecker) {
    return ts.forEachChild(ctx.sourceFile, function cb(node): void {
        if (isPropertyAccessExpression(node) && !isSafeUse(node)) {
            const symbol = tc.getSymbolAtLocation(node);
            const declaration = symbol === undefined ? undefined : symbol.valueDeclaration;

            const isMethodAccess =
                declaration !== undefined && isMethod(declaration, ctx.options.ignoreStatic);
            const shouldBeReported = isMethodAccess && !isWhitelisted(node, ctx.options);
            if (shouldBeReported) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function isMethod(node: ts.Node, ignoreStatic: boolean): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.MethodSignature:
            return !(ignoreStatic && hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword));
        default:
            return false;
    }
}

function isSafeUse(node: ts.Node): boolean {
    const parent = node.parent;
    switch (parent.kind) {
        case ts.SyntaxKind.CallExpression:
            return (parent as ts.CallExpression).expression === node;
        case ts.SyntaxKind.TaggedTemplateExpression:
            return (parent as ts.TaggedTemplateExpression).tag === node;
        // E.g. `obj.method.bind(obj) or obj.method["prop"]`.
        case ts.SyntaxKind.PropertyAccessExpression:
        case ts.SyntaxKind.ElementAccessExpression:
            return true;
        // Allow most binary operators, but don't allow e.g. `myArray.forEach(obj.method || otherObj.otherMethod)`.
        case ts.SyntaxKind.BinaryExpression:
            return (parent as ts.BinaryExpression).operatorToken.kind !== ts.SyntaxKind.BarBarToken;
        case ts.SyntaxKind.NonNullExpression:
        case ts.SyntaxKind.AsExpression:
        case ts.SyntaxKind.TypeAssertionExpression:
        case ts.SyntaxKind.ParenthesizedExpression:
            return isSafeUse(parent);
        // Allow use in conditions
        case ts.SyntaxKind.ConditionalExpression:
            return (parent as ts.ConditionalExpression).condition === node;
        case ts.SyntaxKind.IfStatement:
        case ts.SyntaxKind.WhileStatement:
        case ts.SyntaxKind.DoStatement:
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.PrefixUnaryExpression:
            return true;
        default:
            return false;
    }
}

function isWhitelisted(node: ts.Node, options: Options): boolean {
    const { whitelist, allowTypeof } = options;
    if (isTypeOfExpression(node.parent)) {
        return allowTypeof;
    }
    if (isCallExpression(node.parent) && isIdentifier(node.parent.expression)) {
        const expression = node.parent.expression;
        const callingMethodName = expression.text;
        return whitelist.has(callingMethodName);
    }
    return false;
}
