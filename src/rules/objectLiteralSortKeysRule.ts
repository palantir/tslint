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

import { isInterfaceDeclaration, isObjectLiteralExpression, isSameLine, isTypeAliasDeclaration, isTypeLiteralNode } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_IGNORE_CASE = "ignore-case";
const OPTION_MATCH_DECLARATION_ORDER = "match-declaration-order";

interface Options {
    ignoreCase: boolean;
    matchDeclarationOrder: boolean;
}

export class Rule extends Lint.Rules.OptionallyTypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "object-literal-sort-keys",
        description: Lint.Utils.dedent`
            Checks ordering of keys in object literals.

            When using the default alphabetical ordering, additional blank lines may be used to group
            object properties together while keeping the elements within each group in alphabetical order.
        `,
        rationale: "Useful in preventing merge conflicts",
        optionsDescription: Lint.Utils.dedent`
            By default, this rule checks that keys are in alphabetical order.
            The following may optionally be passed:

            * "${OPTION_IGNORE_CASE}" will to compare keys in a case insensitive way.
            * "${OPTION_MATCH_DECLARATION_ORDER}" will prefer to use the key ordering of the contextual type of the object literal, as in:

                interface I { foo: number; bar: number; }
                const obj: I = { foo: 1, bar: 2 };

            If a contextual type is not found, alphabetical ordering will be used instead.
            `,
        options: {
            type: "string",
            enum: [OPTION_IGNORE_CASE, OPTION_MATCH_DECLARATION_ORDER],
        },
        optionExamples: [
            true,
            [true, OPTION_IGNORE_CASE, OPTION_MATCH_DECLARATION_ORDER],
        ],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_ALPHABETICAL(name: string): string {
        return `The key '${name}' is not sorted alphabetically`;
    }

    public static FAILURE_STRING_USE_DECLARATION_ORDER(propName: string, typeName: string | undefined): string {
        const type = typeName === undefined ? "its type declaration" : `'${typeName}'`;
        return `The key '${propName}' is not in the same order as it is in ${type}.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const options = parseOptions(this.ruleArguments);
        if (options.matchDeclarationOrder) {
            throw new Error(`${this.ruleName} needs type info to use "${OPTION_MATCH_DECLARATION_ORDER}".`);
        }
        return this.applyWithFunction(sourceFile, walk, options);
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(
            sourceFile,
            walk,
            parseOptions(this.ruleArguments),
            program.getTypeChecker(),
        );
    }
}

function parseOptions(ruleArguments: any[]): Options {
    return {
        ignoreCase: has(OPTION_IGNORE_CASE),
        matchDeclarationOrder: has(OPTION_MATCH_DECLARATION_ORDER),
    };

    function has(name: string) {
        return ruleArguments.indexOf(name) !== -1;
    }
}

function walk(ctx: Lint.WalkContext<Options>, checker?: ts.TypeChecker): void {
    const {
        sourceFile,
        options: { ignoreCase, matchDeclarationOrder },
    } = ctx;

    ts.forEachChild(sourceFile, function cb(node): void {
        if (isObjectLiteralExpression(node) && node.properties.length > 1) {
            check(node);
        }
        ts.forEachChild(node, cb);
    });

    function check(node: ts.ObjectLiteralExpression): void {
        if (matchDeclarationOrder) {
            const type = getContextualType(node, checker!);
            // If type has an index signature, we can't check ordering.
            // If type has call/construct signatures, it can't be satisfied by an object literal anyway.
            if (type !== undefined
                && type.members.every((m) => m.kind === ts.SyntaxKind.PropertySignature || m.kind === ts.SyntaxKind.MethodSignature)) {
                checkMatchesDeclarationOrder(node, type, type.members as ReadonlyArray<ts.PropertySignature | ts.MethodSignature>);
                return;
            }
        }
        checkAlphabetical(node);
    }

    function checkAlphabetical(node: ts.ObjectLiteralExpression): void {
        if (isSameLine(ctx.sourceFile, node.properties.pos, node.end)) {
            return;
        }

        let lastKey: string | undefined;
        for (const property of node.properties) {
            switch (property.kind) {
                case ts.SyntaxKind.SpreadAssignment:
                    lastKey = undefined; // reset at spread
                    break;
                case ts.SyntaxKind.ShorthandPropertyAssignment:
                case ts.SyntaxKind.PropertyAssignment:
                    if (property.name.kind === ts.SyntaxKind.Identifier ||
                        property.name.kind === ts.SyntaxKind.StringLiteral) {
                        const key = ignoreCase ? property.name.text.toLowerCase() : property.name.text;
                        // comparison with undefined is expected
                        if (lastKey! > key && !hasBlankLineBefore(ctx.sourceFile, property)) {
                            ctx.addFailureAtNode(property.name, Rule.FAILURE_STRING_ALPHABETICAL(property.name.text));
                            return; // only show warning on first out-of-order property
                        }
                        lastKey = key;
                    }
            }
        }
    }

    function checkMatchesDeclarationOrder(
        { properties }: ts.ObjectLiteralExpression,
        type: TypeLike,
        members: ReadonlyArray<{ name: ts.PropertyName }>,
    ): void {

        let memberIndex = 0;
        outer: for (const prop of properties) {
            if (prop.kind === ts.SyntaxKind.SpreadAssignment) {
                memberIndex = 0;
                continue;
            }

            if (prop.name.kind === ts.SyntaxKind.ComputedPropertyName) { continue; }

            const propName = prop.name.text;

            for (; memberIndex !== members.length; memberIndex += 1) {
                const { name: memberName } = members[memberIndex];
                if (memberName.kind !== ts.SyntaxKind.ComputedPropertyName && propName === memberName.text) {
                    continue outer;
                }
            }

            // This We didn't find the member we were looking for past the previous member,
            // so it must have come before it and is therefore out of order.
            ctx.addFailureAtNode(prop.name, Rule.FAILURE_STRING_USE_DECLARATION_ORDER(propName, getTypeName(type)));
            // Don't bother with multiple errors.
            break;
        }
    }
}

function hasBlankLineBefore(sourceFile: ts.SourceFile, element: ts.ObjectLiteralElement) {
    let comments = ts.getLeadingCommentRanges(sourceFile.text, element.pos);

    if (comments === undefined) {
        comments = [];  // it will be easier to work with an empty array down below...
    }

    const elementStart = comments.length > 0 ? comments[comments.length - 1].end : element.getFullStart();

    // either the element itself, or one of its leading comments must have an extra new line before them
    return hasDoubleNewLine(sourceFile, elementStart) || comments.some((comment) => {
        const commentLine = ts.getLineAndCharacterOfPosition(sourceFile, comment.pos).line;
        const commentLineStartPosition = ts.getPositionOfLineAndCharacter(sourceFile, commentLine, 0);

        return hasDoubleNewLine(sourceFile, commentLineStartPosition - 4);
    });
}

function hasDoubleNewLine(sourceFile: ts.SourceFile, position: number) {
    return /(\r?\n){2}/.test(sourceFile.text.slice(position, position + 4));
}

function getTypeName(t: TypeLike): string | undefined {
    const parent = t.parent!;
    return t.kind === ts.SyntaxKind.InterfaceDeclaration
        ? t.name.text
        : isTypeAliasDeclaration(parent)
            ? parent.name.text
            : undefined;
}

type TypeLike = ts.InterfaceDeclaration | ts.TypeLiteralNode;

function getContextualType(node: ts.Expression, checker: ts.TypeChecker): TypeLike | undefined {
    const c = checker.getContextualType(node);
    if (c === undefined || c.symbol === undefined) {
        return undefined;
    }

    const { declarations } = c.symbol;
    if (declarations === undefined || declarations.length !== 1) {
        return undefined;
    }

    const decl = declarations[0];
    return isInterfaceDeclaration(decl) || isTypeLiteralNode(decl) ? decl : undefined;
}
