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

import { isBinaryExpression, isTypeFlagSet, isUnionType } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "restrict-plus-operands",
        description:
            "When adding two variables, operands must both be of type number or of type string.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static INVALID_TYPES_ERROR =
        "Operands of '+' operation must either be both strings or both numbers";
    public static SUGGEST_TEMPLATE_LITERALS = ", consider using template literals";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(ctx: Lint.WalkContext<void>, tc: ts.TypeChecker) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
            const leftType = getBaseTypeOfLiteralType(tc.getTypeAtLocation(node.left));
            const rightType = getBaseTypeOfLiteralType(tc.getTypeAtLocation(node.right));
            if (leftType === "invalid" || rightType === "invalid" || leftType !== rightType) {
                if (leftType === "string" || rightType === "string") {
                    return ctx.addFailureAtNode(
                        node,
                        Rule.INVALID_TYPES_ERROR + Rule.SUGGEST_TEMPLATE_LITERALS,
                    );
                } else {
                    return ctx.addFailureAtNode(node, Rule.INVALID_TYPES_ERROR);
                }
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function getBaseTypeOfLiteralType(type: ts.Type): "string" | "number" | "invalid" {
    if (
        isTypeFlagSet(type, ts.TypeFlags.StringLiteral) ||
        isTypeFlagSet(type, ts.TypeFlags.String)
    ) {
        return "string";
    } else if (
        isTypeFlagSet(type, ts.TypeFlags.NumberLiteral) ||
        isTypeFlagSet(type, ts.TypeFlags.Number)
    ) {
        return "number";
    } else if (isUnionType(type) && !isTypeFlagSet(type, ts.TypeFlags.Enum)) {
        const types = type.types.map(getBaseTypeOfLiteralType);
        return allSame(types) ? types[0] : "invalid";
    } else if (isTypeFlagSet(type, ts.TypeFlags.EnumLiteral)) {
        // Compatibility for TypeScript pre-2.4, which used EnumLiteralType instead of LiteralType
        getBaseTypeOfLiteralType(((type as any) as { baseType: ts.LiteralType }).baseType);
    }
    return "invalid";
}

function allSame(array: string[]) {
    return array.every(value => value === array[0]);
}
