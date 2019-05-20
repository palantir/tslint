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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

type Side = "right" | "left";
type Overlap = "always" | "never";
type UnnecessaryTypeCheckKeyword = "undefined" | "null";

/**
 * An UnnecessaryTypeCheck is an instance in the source file of an unnecessary type check
 * against an UnnecessaryTypeCheckKeyword (i.e. the check is always true or always false)
 *
 * @example const x = 4;
 *          if (x === undefined) // bad comparison: x (left side) is never undefined
 *
 *          const failure: UnnecessaryTypeCheck = {
 *              atNode: x,
 *              failingSide: "left",
 *              overlapType: "never",
 *              comparingTo: "undefined",
 *          }
 */
interface UnnecessaryTypeCheck {
    atNode: ts.Expression;
    failingSide: Side;
    overlapType: Overlap;
    comparingTo: UnnecessaryTypeCheckKeyword;
}

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unnecessary-type-check",
        description:
            "Warns on comparison against `null` or `undefined` (`x !== undefined`) if the result is always true or always false",
        hasFix: false,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        rationale: Lint.Utils.dedent`
            Checking against null or undefined unnecessarily can be a symptom of incorrect typings.
            If it's possible that a value can be null or undefined, its type should reflect that.
        `,
        type: "typescript",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(failure: UnnecessaryTypeCheck) {
        const { failingSide, overlapType, comparingTo } = failure;
        return `This comparison is unnecessary because the ${failingSide} side is ${overlapType} ${comparingTo}`;
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(ctx: Lint.WalkContext, checker: ts.TypeChecker): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (utils.isBinaryExpression(node)) {
            const failure = getUnnecessaryTypeCheck(node, checker);
            if (failure !== undefined) {
                ctx.addFailureAtNode(failure.atNode, Rule.FAILURE_STRING(failure));
            }
        }
        return ts.forEachChild(node, cb);
    });
}

interface Identifier {
    kind: ts.SyntaxKind;
    typeFlag: ts.TypeFlags;
    label: UnnecessaryTypeCheckKeyword;
}

const comparisonsToCheck: Identifier[] = [
    {
        kind: ts.SyntaxKind.UndefinedKeyword,
        label: "undefined",
        typeFlag: ts.TypeFlags.Undefined,
    },
    {
        kind: ts.SyntaxKind.NullKeyword,
        label: "null",
        typeFlag: ts.TypeFlags.Null,
    },
];

interface SideOfBinaryExpression {
    side: Side;
    expression: ts.Expression;
}

function getUnnecessaryTypeCheck(
    node: ts.BinaryExpression,
    tc: ts.TypeChecker,
): UnnecessaryTypeCheck | undefined {
    const { left, operatorToken, right } = node;
    const eq = Lint.getEqualsKind(operatorToken);
    if (eq === undefined) {
        return undefined;
    }

    for (const identifier of comparisonsToCheck) {
        const failure = getUnnecessaryTypeCheckForIdentifier(
            tc,
            { expression: left, side: "left" },
            { expression: right, side: "right" },
            identifier,
        );
        if (failure !== undefined) {
            return failure;
        }
    }

    return undefined;
}

function getUnnecessaryTypeCheckForIdentifier(
    tc: ts.TypeChecker,
    left: SideOfBinaryExpression,
    right: SideOfBinaryExpression,
    identifier: Identifier,
): UnnecessaryTypeCheck | undefined {
    const failureDetails = (
        overlapType: Overlap,
        atNode: ts.Expression,
        failingSide: Side,
    ): UnnecessaryTypeCheck => ({
        atNode,
        comparingTo: identifier.label,
        failingSide,
        overlapType,
    });

    const alwaysOverlaps = (exp: ts.Expression) =>
        tc.getTypeAtLocation(exp).getFlags() === identifier.typeFlag;

    const neverOverlaps = (exp: ts.Expression) =>
        !containsType(tc.getTypeAtLocation(exp), identifier.typeFlag);

    const getFailure = (possibleIdentifer: ts.Expression, otherSide: SideOfBinaryExpression) => {
        if (expressionIsIdentifier(possibleIdentifer, identifier.kind)) {
            if (alwaysOverlaps(otherSide.expression)) {
                return failureDetails("always", otherSide.expression, otherSide.side);
            }
            if (neverOverlaps(otherSide.expression)) {
                return failureDetails("never", otherSide.expression, otherSide.side);
            }
        }
        return undefined;
    };

    // tslint:disable-next-line:strict-boolean-expressions
    return getFailure(left.expression, right) || getFailure(right.expression, left);
}

function expressionIsIdentifier(exp: ts.Expression, identifier: ts.SyntaxKind) {
    if (ts.isIdentifier(exp)) {
        return exp.originalKeywordKind === identifier;
    }
    return exp.kind === identifier;
}

function containsType(haystack: ts.Type, needle: ts.TypeFlags): boolean {
    if (utils.isUnionType(haystack)) {
        return haystack.types.some(subType => containsType(subType, needle));
    }
    return haystack.getFlags() === needle;
}
