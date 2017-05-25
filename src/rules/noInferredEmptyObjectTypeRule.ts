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
import { isObjectFlagSet, isTypeFlagSet } from "../language/utils";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-inferred-empty-object-type",
        description: "Disallow type inference of {} (empty object type) at function and constructor call sites",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static EMPTY_INTERFACE_INSTANCE = "Explicit type parameter needs to be provided to the constructor";
    public static EMPTY_INTERFACE_FUNCTION = "Explicit type parameter needs to be provided to the function call";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoInferredEmptyObjectTypeRule(sourceFile, this.ruleName, program.getTypeChecker()));
    }
}

class NoInferredEmptyObjectTypeRule extends Lint.AbstractWalker<void> {
    constructor(sourceFile: ts.SourceFile, ruleName: string, private checker: ts.TypeChecker) {
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
            const objType = this.checker.getTypeAtLocation(node) as ts.TypeReference;
            if (isTypeFlagSet(objType, ts.TypeFlags.Object) && objType.typeArguments !== undefined) {
                const typeArgs = objType.typeArguments as ts.ObjectType[];
                if (typeArgs.some((a) => this.isEmptyObjectInterface(a))) {
                    this.addFailureAtNode(node, Rule.EMPTY_INTERFACE_INSTANCE);
                }
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

        const retType = this.checker.getReturnTypeOfSignature(callSig) as ts.TypeReference;
        if (this.isEmptyObjectInterface(retType)) {
            this.addFailureAtNode(node, Rule.EMPTY_INTERFACE_FUNCTION);
        }
    }

    private isEmptyObjectInterface(objType: ts.ObjectType): boolean {
        const isAnonymous = isObjectFlagSet(objType, ts.ObjectFlags.Anonymous);
        let hasProblematicCallSignatures = false;
        const hasProperties = (objType.getProperties() !== undefined && objType.getProperties().length > 0);
        const hasNumberIndexType = objType.getNumberIndexType() !== undefined;
        const hasStringIndexType = objType.getStringIndexType() !== undefined;
        const callSig = objType.getCallSignatures();
        if (callSig !== undefined && callSig.length > 0) {
            const isClean = callSig.every((sig) => {
                const csigRetType = this.checker.getReturnTypeOfSignature(sig) as ts.TypeReference;
                return this.isEmptyObjectInterface(csigRetType);
            });
            if (!isClean) {
                hasProblematicCallSignatures = true;
            }
        }
        return (isAnonymous && !hasProblematicCallSignatures && !hasProperties && !hasNumberIndexType && !hasStringIndexType);
    }
}
