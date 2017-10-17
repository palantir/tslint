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

import { showWarningOnce } from "../error";
import * as Lint from "../index";

const OPTION_NO_PUBLIC = "no-public";
const OPTION_CHECK_ACCESSOR = "check-accessor";
const OPTION_CHECK_CONSTRUCTOR = "check-constructor";
const OPTION_CHECK_PARAMETER_PROPERTY = "check-parameter-property";

interface Options {
    noPublic: boolean;
    checkAccessor: boolean;
    checkConstructor: boolean;
    checkParameterProperty: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "member-access",
        description: "Requires explicit visibility declarations for class members.",
        rationale: "Explicit visibility declarations can make code more readable and accessible for those new to TS.",
        optionsDescription: Lint.Utils.dedent`
            These arguments may be optionally provided:

            * \`"no-public"\` forbids public accessibility to be specified, because this is the default.
            * \`"check-accessor"\` enforces explicit visibility on get/set accessors
            * \`"check-constructor"\`  enforces explicit visibility on constructors
            * \`"check-parameter-property"\`  enforces explicit visibility on parameter properties`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_NO_PUBLIC, OPTION_CHECK_ACCESSOR, OPTION_CHECK_CONSTRUCTOR, OPTION_CHECK_PARAMETER_PROPERTY],
            },
            minLength: 0,
            maxLength: 4,
        },
        optionExamples: [true, [true, OPTION_NO_PUBLIC], [true, OPTION_CHECK_ACCESSOR]],
        type: "typescript",
        typescriptOnly: true,
        hasFix: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_NO_PUBLIC = "'public' is implicit.";

    public static FAILURE_STRING_FACTORY(memberType: string, memberName: string | undefined): string {
        memberName = memberName === undefined ? "" : ` '${memberName}'`;
        return `The ${memberType}${memberName} must be marked either 'private', 'public', or 'protected'`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = this.ruleArguments;
        const noPublic = options.indexOf(OPTION_NO_PUBLIC) !== -1;
        let checkAccessor = options.indexOf(OPTION_CHECK_ACCESSOR) !== -1;
        let checkConstructor = options.indexOf(OPTION_CHECK_CONSTRUCTOR) !== -1;
        let checkParameterProperty = options.indexOf(OPTION_CHECK_PARAMETER_PROPERTY) !== -1;
        if (noPublic) {
            if (checkAccessor || checkConstructor || checkParameterProperty) {
                showWarningOnce(`Warning: ${this.ruleName} - If 'no-public' is present, it should be the only option.`);
                return [];
            }
            checkAccessor = checkConstructor = checkParameterProperty = true;
        }
        return this.applyWithFunction(sourceFile, walk, {
            checkAccessor,
            checkConstructor,
            checkParameterProperty,
            noPublic,
        });
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { noPublic, checkAccessor, checkConstructor, checkParameterProperty } = ctx.options;
    return ts.forEachChild(ctx.sourceFile, function recur(node: ts.Node): void {
        if (utils.isClassLikeDeclaration(node)) {
            for (const child of node.members) {
                if (shouldCheck(child)) {
                    check(child);
                }
                if (checkParameterProperty && utils.isConstructorDeclaration(child) && child.body !== undefined) {
                    for (const param of child.parameters) {
                        if (utils.isParameterProperty(param)) {
                            check(param);
                        }
                    }
                }
            }
        }
        return ts.forEachChild(node, recur);
    });

    function shouldCheck(node: ts.ClassElement): boolean {
        switch (node.kind) {
            case ts.SyntaxKind.Constructor:
                return checkConstructor;
            case ts.SyntaxKind.GetAccessor:
            case ts.SyntaxKind.SetAccessor:
                return checkAccessor;
            case ts.SyntaxKind.MethodDeclaration:
            case ts.SyntaxKind.PropertyDeclaration:
                return true;
            default:
                return false;
        }
    }

    function check(node: ts.ClassElement | ts.ParameterDeclaration): void {
        if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.ProtectedKeyword, ts.SyntaxKind.PrivateKeyword)) {
            return;
        }
        const publicKeyword = utils.getModifier(node, ts.SyntaxKind.PublicKeyword);
        if (noPublic && publicKeyword !== undefined) {
            const readonlyKeyword = utils.getModifier(node, ts.SyntaxKind.ReadonlyKeyword);
            // public is not optional for parameter property without the readonly modifier
            const isPublicOptional = node.kind !== ts.SyntaxKind.Parameter || readonlyKeyword !== undefined;
            if (isPublicOptional) {
                const start = publicKeyword.end - "public".length;
                ctx.addFailure(
                    start,
                    publicKeyword.end,
                    Rule.FAILURE_STRING_NO_PUBLIC,
                    Lint.Replacement.deleteFromTo(start, utils.getNextToken(publicKeyword, ctx.sourceFile)!.getStart(ctx.sourceFile)),
                );
            }
        }
        if (!noPublic && publicKeyword === undefined) {
            const nameNode = node.kind === ts.SyntaxKind.Constructor
                ? utils.getChildOfKind(node, ts.SyntaxKind.ConstructorKeyword, ctx.sourceFile)!
                : node.name !== undefined ? node.name : node;
            const memberName = node.name !== undefined && node.name.kind === ts.SyntaxKind.Identifier ? node.name.text : undefined;
            ctx.addFailureAtNode(
                nameNode,
                Rule.FAILURE_STRING_FACTORY(typeToString(node), memberName),
                Lint.Replacement.appendText(getInsertionPosition(node, ctx.sourceFile), "public "),
            );
        }
    }
}

function getInsertionPosition(member: ts.ClassElement | ts.ParameterDeclaration, sourceFile: ts.SourceFile): number {
    const node = member.decorators === undefined ? member : utils.getTokenAtPosition(member, member.decorators.end, sourceFile)!;
    return node.getStart(sourceFile);
}

function typeToString(node: ts.ClassElement | ts.ParameterDeclaration): string {
    switch (node.kind) {
        case ts.SyntaxKind.MethodDeclaration:
            return "class method";
        case ts.SyntaxKind.PropertyDeclaration:
            return "class property";
        case ts.SyntaxKind.Constructor:
            return "class constructor";
        case ts.SyntaxKind.GetAccessor:
            return "get property accessor";
        case ts.SyntaxKind.SetAccessor:
            return "set property accessor";
        case ts.SyntaxKind.Parameter:
            return "parameter property";
        default:
            throw new Error(`unhandled node type ${ts.SyntaxKind[node.kind]}`);
    }
}
