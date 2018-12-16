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

import { isObjectFlagSet, isObjectType, isTypeReference } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-inferred-empty-object-type",
        description:
            "Disallow type inference of {} (empty object type) at function and constructor call sites",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        rationale: Lint.Utils.dedent`
            When function or constructor may be called with a type parameter but one isn't supplied or inferrable,
            TypeScript defaults to \`{}\`.
            This is often undesirable as the call is meant to be of a more specific type.
        `,
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static EMPTY_INTERFACE_INSTANCE =
        "Explicit type parameter needs to be provided to the constructor";
    public static EMPTY_INTERFACE_FUNCTION =
        "Explicit type parameter needs to be provided to the function call";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new NoInferredEmptyObjectTypeRule(sourceFile, this.ruleName, program.getTypeChecker()),
        );
    }
}

class NoInferredEmptyObjectTypeRule extends Lint.AbstractWalker<void> {
    constructor(
        sourceFile: ts.SourceFile,
        ruleName: string,
        private readonly checker: ts.TypeChecker,
    ) {
        super(sourceFile, ruleName, undefined);
    }

    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (node.kind === ts.SyntaxKind.CallExpression) {
                this.checkCallExpression(node as ts.CallExpression);
            } else if (node.kind === ts.SyntaxKind.NewExpression) {
                this.checkNewExpression(node as ts.NewExpression);
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private checkNewExpression(node: ts.NewExpression): void {
        if (node.typeArguments === undefined) {
            const type = this.checker.getTypeAtLocation(node);
            if (
                isTypeReference(type) &&
                type.typeArguments !== undefined &&
                type.typeArguments.some(a => isObjectType(a) && this.isEmptyObjectInterface(a))
            ) {
                this.addFailureAtNode(node, Rule.EMPTY_INTERFACE_INSTANCE);
            }
        }
    }

    private checkCallExpression(node: ts.CallExpression): void {
        if (node.typeArguments !== undefined) {
            return;
        }

        const callSig = this.checker.getResolvedSignature(node);
        if (callSig === undefined) {
            return;
        }

        const retType = this.checker.getReturnTypeOfSignature(callSig);
        if (isObjectType(retType) && this.isEmptyObjectInterface(retType)) {
            this.addFailureAtNode(node, Rule.EMPTY_INTERFACE_FUNCTION);
        }
    }

    private isEmptyObjectInterface(objType: ts.ObjectType): boolean {
        return (
            isObjectFlagSet(objType, ts.ObjectFlags.Anonymous) &&
            objType.getProperties().length === 0 &&
            objType.getNumberIndexType() === undefined &&
            objType.getStringIndexType() === undefined &&
            objType.getCallSignatures().every(signature => {
                const type = this.checker.getReturnTypeOfSignature(signature);
                return isObjectType(type) && this.isEmptyObjectInterface(type);
            })
        );
    }
}
