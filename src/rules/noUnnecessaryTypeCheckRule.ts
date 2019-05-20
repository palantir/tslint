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
interface UnnecessaryTypeCheck {
    atNode: ts.Expression;
    failingSide: Side;
    overlapType: Overlap;
    comparingTo: string;
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
    label: string;
}

const comparisonsToCheck: Identifier[] = [
    {
        kind: ts.SyntaxKind.UndefinedKeyword,
        typeFlag: ts.TypeFlags.Undefined,
        label: "undefined",
    },
    {
        kind: ts.SyntaxKind.NullKeyword,
        typeFlag: ts.TypeFlags.Null,
        label: "null",
    },
];

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
        const failure = getUnnecessaryTypeCheckForIdentifier(tc, left, right, identifier);
        if (failure) {
            return failure;
        }
    }

    return undefined;
}

function getUnnecessaryTypeCheckForIdentifier(
    tc: ts.TypeChecker,
    left: ts.Expression,
    right: ts.Expression,
    identifier: Identifier,
): UnnecessaryTypeCheck | undefined {
    const failureDetails = (
        overlapType: Overlap,
        atNode: ts.Expression,
        failingSide: Side,
    ): UnnecessaryTypeCheck => ({
        atNode,
        failingSide,
        overlapType,
        comparingTo: identifier.label,
    });

    const alwaysOverlaps = (exp: ts.Expression) =>
        tc.getTypeAtLocation(exp).getFlags() === identifier.typeFlag;

    const neverOverlaps = (exp: ts.Expression) =>
        !containsType(tc.getTypeAtLocation(exp), identifier.typeFlag);

    const getFailure = (possibleIdentifer: ts.Expression, exp: ts.Expression, expSide: Side) => {
        if (expressionIsIdentifier(possibleIdentifer, identifier.kind)) {
            if (alwaysOverlaps(exp)) {
                return failureDetails("always", exp, expSide);
            }
            if (neverOverlaps(exp)) {
                return failureDetails("never", exp, expSide);
            }
        }
        return undefined;
    };

    return getFailure(left, right, "right") || getFailure(right, left, "left");
}

function expressionIsIdentifier(exp: ts.Expression, identifier: ts.SyntaxKind) {
    if (ts.isIdentifier(exp)) {
        return exp.originalKeywordKind === identifier;
    }
    return exp.kind === identifier;
}

function containsType(haystack: ts.Type | undefined, needle: ts.TypeFlags): boolean {
    if (haystack === undefined) {
        return false;
    }

    if (utils.isUnionType(haystack)) {
        return haystack.types.some(subType => containsType(subType, needle));
    }

    return haystack.getFlags() === needle;
}
