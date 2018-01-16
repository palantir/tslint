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
            "One of two enum options is allowed: `always` or `never`. If no option is provided, `always` is used.",
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
        return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.ruleArguments[0]));
    }

    private parseOptions(args: any): Options {
        if (args && typeof args === "string" && (args === OPTION_ALWAYS || args === OPTION_NEVER)) {
            return { never: args === OPTION_NEVER };
        }
        return { never: false };
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const checkConstructors = (node: ts.Node): void => {
        if (isConstructorDeclaration(node) && node.parameters.length > 0) {
            const params: NamedNode[] = node.parameters.map((p: ts.ParameterDeclaration) => ({
                name: (p.name as ts.Identifier).text,
                node: p,
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
                if (params.some((p: NamedNode) => p.name === assignment.name)) {
                    ctx.addFailureAtNode(
                        assignment.node,
                        Rule.FAILURE_MISSING_PARAM_PROP,
                        getFix(
                            params.find((p: NamedNode) => p.name === assignment.name)!
                                .node as ts.ParameterDeclaration,
                            assignment.node as ts.ExpressionStatement,
                            node.parent,
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
    classNode: ts.ClassDeclaration | ts.ClassExpression | undefined,
): Lint.Replacement[] | undefined {
    const memberName = ((assignment.expression as ts.BinaryExpression)
        .left as ts.PropertyAccessExpression).name.text;
    const member = classNode!.members.filter(
        (_member: ts.Node) =>
            isPropertyDeclaration(_member) && (_member.name as ts.Identifier).text === memberName,
    )[0];
    if (member !== undefined) {
        const paramReplacement = Lint.Replacement.appendText(
            param.getFullStart(),
            member.modifiers !== undefined
                ? `${parseModifiers(member.modifiers)} ` /* Trailing space! */
                : "public ",
        );
        const propReplacement = Lint.Replacement.replaceFromTo(
            member.getFullStart(),
            member.end,
            "",
        );
        const assignmentReplacement = Lint.Replacement.replaceFromTo(
            assignment.getFullStart(),
            assignment.end,
            "",
        );
        return [paramReplacement, propReplacement, assignmentReplacement];
    } else {
        return [];
    }
}

function parseModifiers(modifiers: ts.NodeArray<ts.Modifier> | undefined): string {
    let replacement = "";
    for (const mod of modifiers!) {
        switch (mod.kind) {
            case 112:
                replacement += replacement === "" ? "private" : " private";
                break;
            case 114:
                replacement += replacement === "" ? "public" : " public";
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
