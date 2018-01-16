/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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
    isBinaryExpression,
    isConstructorDeclaration,
    isExpressionStatement,
    isIdentifier,
    isParameterProperty,
    isPropertyAccessExpression,
    isPropertyDeclaration,
} from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

const OPTION_ALWAYS = "always";
const OPTION_NEVER = "never";

interface Options {
    never: boolean;
}

interface NamedNode {
    name: string;
    node: ts.ParameterDeclaration | ts.ExpressionStatement;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "parameter-properties",
        description: "Allows or disallows the use of parameter properties.",
        rationale: "Brings consistency to class definitions.",
        optionsDescription:
            'One of two string options is allowed: `"always"` or `"never"`. If no option is provided, `"always"` is used.',
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_ALWAYS, OPTION_NEVER],
            },
        },
        optionExamples: [true, [true, OPTION_ALWAYS], [true, OPTION_NEVER]],
        type: "functionality",
        typescriptOnly: true,
        hasFix: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_ILLEGAL_PARAM_PROP = "Usage of parameter properties has been disallowed.";
    public static FAILURE_MISSING_PARAM_PROP = "Use parameter properties instead of assigning to members in the constructor body.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            never: this.ruleArguments[0] === OPTION_NEVER,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const checkConstructors = (node: ts.Node): void => {
        if (isConstructorDeclaration(node) && node.parameters.length > 0) {
            const params: NamedNode[] = node.parameters.map((param: ts.ParameterDeclaration) => ({
                name: (param.name as ts.Identifier).text,
                node: param,
            }));

            if (ctx.options.never) {
                for (const param of params) {
                    if (isParameterProperty(param.node as ts.ParameterDeclaration)) {
                        ctx.addFailureAtNode(param.node, Rule.FAILURE_ILLEGAL_PARAM_PROP);
                    }
                }
                return;
            }

            const assignments: NamedNode[] = node.body!.statements
                .filter(
                    (stmt: ts.Statement) =>
                        isExpressionStatement(stmt) &&
                        isBinaryExpression(stmt.expression) &&
                        isIdentifier(stmt.expression.right) &&
                        isPropertyAccessExpression(stmt.expression.left) &&
                        stmt.expression.left.expression.kind === 99,
                )
                .map((stmt: ts.Statement) => ({
                    name: (((stmt as ts.ExpressionStatement).expression as ts.BinaryExpression)
                        .right as ts.Identifier).text,
                    node: stmt as ts.ExpressionStatement,
                }));

            for (const assignment of assignments) {
                const param = params.find((_param: NamedNode) => _param.name === assignment.name);
                if (param !== undefined) {
                    ctx.addFailureAtNode(
                        assignment.node,
                        Rule.FAILURE_MISSING_PARAM_PROP,
                        getFix(
                            param.node as ts.ParameterDeclaration,
                            assignment.node as ts.ExpressionStatement,
                            node.parent as ts.ClassLikeDeclaration,
                        ),
                    );
                }
            }
        }
        return ts.forEachChild(node, checkConstructors);
    };
    return ts.forEachChild(ctx.sourceFile, checkConstructors);
}

function getFix(
    param: ts.ParameterDeclaration,
    assignment: ts.ExpressionStatement,
    classNode: ts.ClassLikeDeclaration,
): Lint.Replacement[] {
    const fixes: Lint.Replacement[] = [];
    const memberName = ((assignment.expression as ts.BinaryExpression)
        .left as ts.PropertyAccessExpression).name.text;
    const member = classNode.members.find(
        (_member: ts.Node) =>
            isPropertyDeclaration(_member) && (_member.name as ts.Identifier).text === memberName,
    );
    if (member !== undefined) {
        fixes.push(
            /* Prepend modifiers to constructor param */
            Lint.Replacement.appendText(
                param.getStart(),
                member.modifiers !== undefined
                    ? `${parseModifiers(member.modifiers)} ` /* Trailing space! */
                    : "public ",
            ),
            /* Remove prop declaration */
            Lint.Replacement.replaceFromTo(member.getFullStart(), member.end, ""),
            /* Remove assignment in constructor body */
            Lint.Replacement.replaceFromTo(assignment.getFullStart(), assignment.end, ""),
        );
        /* Check for default value on member that is being transformed into param prop */
        if ((member as ts.PropertyDeclaration).initializer !== undefined) {
            fixes.push(
                Lint.Replacement.appendText(
                    param.end,
                    ` = ${(member as ts.PropertyDeclaration).initializer!.getText()}`,
                ),
            );
        }
    }
    return fixes;
}

function parseModifiers(modifiers: ts.NodeArray<ts.Modifier>): string {
    let replacement = "";
    for (const mod of modifiers) {
        switch (mod.kind) {
            case 112:
                replacement += "private";
                break;
            case 114:
                replacement += "public";
                break;
            case 131:
                replacement += replacement === "" ? "readonly" : " readonly";
                break;
            case 113:
                replacement += replacement === "" ? "protected" : " protected";
                break;
            default:
                continue;
        }
    }
    return replacement;
}
