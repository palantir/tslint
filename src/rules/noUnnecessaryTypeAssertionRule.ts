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

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unnecessary-type-assertion",
        description: `Warns if a type assertion does not change the type of an expression.`,
        options: null,
        optionsDescription: "Not configurable",
        type: "typescript",
        hasFix: true,
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "This assertion is unnecessary since it does not change the type of the expression.";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.ruleName, program));
    }
}

class Walker extends Lint.AbstractWalker<void> {
    private readonly typeChecker: ts.TypeChecker;
    constructor(sourceFile: ts.SourceFile, ruleName: string, program: ts.Program) {
        super(sourceFile, ruleName, undefined);
        this.typeChecker = program.getTypeChecker();
    }

    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (node.kind === ts.SyntaxKind.TypeAssertionExpression ||
                node.kind === ts.SyntaxKind.NonNullExpression ||
                node.kind === ts.SyntaxKind.AsExpression) {
                this.verifyCast(
                    node as ts.TypeAssertion|ts.NonNullExpression|ts.AsExpression);
            }

            return ts.forEachChild(node, cb);
        };

        return ts.forEachChild(sourceFile, cb);
    }

    private verifyCast(node: ts.TypeAssertion|ts.NonNullExpression|
                       ts.AsExpression) {
        const castType = this.typeChecker.getTypeAtLocation(node);
        const uncastType = this.typeChecker.getTypeAtLocation(node.expression);

        if (uncastType != null && castType != null && uncastType === castType) {
            const replacements: Lint.Replacement[] = [];
            if (node.pos !== node.expression.pos) {
                replacements.push(
                    Lint.Replacement.deleteFromTo(node.getStart(), node.expression.getStart()));
            }
            if (node.end !== node.expression.end) {
                replacements.push(
                    Lint.Replacement.deleteFromTo(node.expression.getEnd(), node.getEnd()));
            }
            this.addFailureAtNode(node, Rule.FAILURE_STRING, replacements);
        }
    }
}
