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

import * as ts from "typescript";

import * as Lint from "../index";
import { isTypeFlagSet } from "../language/utils";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "restrict-plus-operands",
        description: "When adding two variables, operands must both be of type number or of type string.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: false,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static INVALID_TYPES_ERROR = "Operands of '+' operation must either be both strings or both numbers";

    public applyWithProgram(sourceFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new RestrictPlusOperandsWalker(sourceFile, this.getOptions(), langSvc.getProgram()));
    }
}

class RestrictPlusOperandsWalker extends Lint.ProgramAwareRuleWalker {
    public visitBinaryExpression(node: ts.BinaryExpression) {
        if (node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
            const tc = this.getTypeChecker();

            const leftType = getBaseTypeOfLiteralType(tc.getTypeAtLocation(node.left));
            const rightType = getBaseTypeOfLiteralType(tc.getTypeAtLocation(node.right));

            const width = node.getWidth();
            const position = node.getStart();

            if (leftType === "invalid" || rightType === "invalid" || leftType !== rightType) {
                this.addFailureAt(position, width, Rule.INVALID_TYPES_ERROR);
            }
        }

        super.visitBinaryExpression(node);
    }
}

function getBaseTypeOfLiteralType(type: ts.Type): "string" | "number" | "invalid" {
    if (isTypeFlagSet(type, ts.TypeFlags.StringLiteral) || isTypeFlagSet(type, ts.TypeFlags.String)) {
        return "string";
    } else if (isTypeFlagSet(type, ts.TypeFlags.NumberLiteral) || isTypeFlagSet(type, ts.TypeFlags.Number)) {
        return "number";
    } else if (isUnionType(type) && !isTypeFlagSet(type, ts.TypeFlags.Enum)) {
        const types = type.types.map(getBaseTypeOfLiteralType);
        return allSame(types) ? types[0] : "invalid";
    } else if (isTypeFlagSet(type, ts.TypeFlags.EnumLiteral)) {
        return getBaseTypeOfLiteralType((type as ts.EnumLiteralType).baseType);
    }
    return "invalid";
}

function allSame(array: string[]) {
    return array.every((value) => value === array[0]);
}

function isUnionType(type: ts.Type): type is ts.UnionType {
    return Lint.isTypeFlagSet(type, ts.TypeFlags.Union);
}
