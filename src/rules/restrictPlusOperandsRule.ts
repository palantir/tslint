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

import * as Lint from "../lint";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "restrict-plus-operands",
        description: "When adding two variables, operands must both be of type number or of type string.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static MISMATCHED_TYPES_FAILURE = "Types of values used in '+' operation must match";
    public static UNSUPPORTED_TYPE_FAILURE_FACTORY = (type: string) => `cannot add type ${type}`;

    public applyWithProgram(sourceFile: ts.SourceFile, langSvc: Lint.TslintLanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new RestrictPlusOperandsWalker(sourceFile, this.getOptions(), langSvc.getProgram()));
    }
}

class RestrictPlusOperandsWalker extends Lint.ProgramAwareRuleWalker {
    public visitBinaryExpression(node: ts.BinaryExpression) {
        if (node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
            const tc = this.getTypeChecker();
            const leftType = tc.typeToString(tc.getTypeAtLocation(node.left));
            const rightType = tc.typeToString(tc.getTypeAtLocation(node.right));

            const width = node.getWidth();
            const position = node.getStart();

            if (leftType !== rightType) {
                // mismatched types
                this.addFailure(this.createFailure(position, width, Rule.MISMATCHED_TYPES_FAILURE));
            } else if (leftType !== "number" && leftType !== "string") {
                // adding unsupported types
                const failureString = Rule.UNSUPPORTED_TYPE_FAILURE_FACTORY(leftType);
                this.addFailure(this.createFailure(position, width, failureString));
            }
        }

        super.visitBinaryExpression(node);
    }
}
