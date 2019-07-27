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
    isCallExpression,
    isConstructorDeclaration,
    isExpressionStatement,
    isParameterProperty,
} from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";
import { Replacement } from "../language/rule/rule";

interface Options {
    unnecessarySuperCall: boolean;
}

const OPTION_UNNECESSARY_SUPER_CALL = "unnecessary-super-call";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        description: "Prevents blank constructors, as they are redundant.",
        optionExamples: [true, [true, { [OPTION_UNNECESSARY_SUPER_CALL]: true }]],
        options: {
            properties: {
                [OPTION_UNNECESSARY_SUPER_CALL]: { type: "boolean" },
            },
            type: "object",
        },
        optionsDescription: Lint.Utils.dedent`
            An optional object with the property '${OPTION_UNNECESSARY_SUPER_CALL}'.
            This is to check for unnecessary constructor parameters for super call`,
        rationale: Lint.Utils.dedent`
            JavaScript implicitly adds a blank constructor when there isn't one.
            It's not necessary to manually add one in.
        `,
        ruleName: "unnecessary-constructor",
        type: "functionality",
        typescriptOnly: false,
    };

    public static FAILURE_STRING = "Remove unnecessary empty constructor.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options: Options = {
            unnecessarySuperCall:
                this.ruleArguments.length !== 0 &&
                (this.ruleArguments[0] as { "unnecessary-super-call"?: boolean })[
                    "unnecessary-super-call"
                ] === true,
        };

        return this.applyWithFunction(sourceFile, walk, options);
    }
}

const containsStatements = (statements: ts.NodeArray<ts.Statement>) => statements.length > 0;

const containsSuper = (statements: ts.NodeArray<ts.Statement>): boolean => {
    for (const statement of statements) {
        if (
            isExpressionStatement(statement) &&
            isCallExpression(statement.expression) &&
            ts.SyntaxKind.SuperKeyword === statement.expression.expression.kind
        ) {
            return true;
        }
    }

    return false;
};

const isEmptyOrContainsOnlySuper = (node: ts.ConstructorDeclaration, options: Options): boolean => {
    if (node.body) {
        const { unnecessarySuperCall } = options;

        if (!containsStatements(node.body.statements)) {
            return true;
        }

        if (unnecessarySuperCall) {
            return node.body.statements.length === 1 && containsSuper(node.body.statements);
        }
    }

    return false;
};

const containsConstructorParameter = (node: ts.ConstructorDeclaration): boolean =>
    // If this has any parameter properties
    node.parameters.some(isParameterProperty);

const isAccessRestrictingConstructor = (node: ts.ConstructorDeclaration): boolean =>
    // No modifiers implies public
    node.modifiers != undefined &&
    // If this has any modifier that isn't public, it's doing something
    node.modifiers.some(modifier => modifier.kind !== ts.SyntaxKind.PublicKeyword);

const containsDecorator = (node: ts.ConstructorDeclaration): boolean =>
    node.parameters.some(p => p.decorators !== undefined);

function walk(context: Lint.WalkContext<Options>) {
    const callback = (node: ts.Node): void => {
        if (
            isConstructorDeclaration(node) &&
            isEmptyOrContainsOnlySuper(node, context.options) &&
            !containsConstructorParameter(node) &&
            !containsDecorator(node) &&
            !isAccessRestrictingConstructor(node)
        ) {
            const replacements = [];
            // Since only one constructor implementation is allowed and the one found above is empty, all other overloads can be safely removed.
            for (const maybeConstructor of node.parent.members) {
                if (isConstructorDeclaration(maybeConstructor)) {
                    replacements.push(
                        Replacement.deleteFromTo(maybeConstructor.pos, maybeConstructor.end),
                    );
                }
            }
            context.addFailureAtNode(node, Rule.FAILURE_STRING, replacements);
        } else {
            ts.forEachChild(node, callback);
        }
    };

    return ts.forEachChild(context.sourceFile, callback);
}
