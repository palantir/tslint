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
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static EMPTY_INTERFACE_INSTANCE = "Explicit type parameter needs to be provided to the constructor";
    public static EMPTY_INTERFACE_FUNCTION = "Explicit type parameter needs to be provided to the function call";

    public applyWithProgram(srcFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoInferredEmptyObjectTypeRule(srcFile, this.getOptions(), langSvc.getProgram()));
    }
}

class NoInferredEmptyObjectTypeRule extends Lint.ProgramAwareRuleWalker {
    private checker: ts.TypeChecker;

    constructor(srcFile: ts.SourceFile, lintOptions: Lint.IOptions, program: ts.Program) {
        super(srcFile, lintOptions, program);
        this.checker = this.getTypeChecker();
    }

    public visitNewExpression(node: ts.NewExpression): void {
        const nodeTypeArgs = node.typeArguments;
        let isObjectReference: (o: ts.TypeReference) => boolean;
        if ((ts as any).TypeFlags.Reference != null) {
            // typescript 2.0.x specific code
            isObjectReference = (o: ts.TypeReference) => isTypeFlagSet(o, (ts as any).TypeFlags.Reference);
        } else {
            isObjectReference = (o: ts.TypeReference) => isTypeFlagSet(o, ts.TypeFlags.Object);
        }
        if (nodeTypeArgs === undefined) {
            const objType = this.checker.getTypeAtLocation(node) as ts.TypeReference;
            if (isObjectReference(objType) && objType.typeArguments !== undefined) {
                const typeArgs = objType.typeArguments as ts.ObjectType[];
                typeArgs.forEach((a) => {
                    if (this.isEmptyObjectInterface(a)) {
                        this.addFailureAtNode(node, Rule.EMPTY_INTERFACE_INSTANCE);
                    }
                });
            }
        }
        super.visitNewExpression(node);
    }

    public visitCallExpression(node: ts.CallExpression): void {
        if (node.typeArguments === undefined) {
            const callSig = this.checker.getResolvedSignature(node);
            const retType = this.checker.getReturnTypeOfSignature(callSig) as ts.TypeReference;
            if (this.isEmptyObjectInterface(retType)) {
                this.addFailureAtNode(node, Rule.EMPTY_INTERFACE_FUNCTION);
            }
        }
        super.visitCallExpression(node);
    }

    private isEmptyObjectInterface(objType: ts.ObjectType): boolean {
        let isAnonymous: boolean;
        if (ts.ObjectFlags == null) {
            // typescript 2.0.x specific code
            isAnonymous = isTypeFlagSet(objType, (ts as any).TypeFlags.Anonymous);
        } else {
            isAnonymous = isObjectFlagSet(objType, ts.ObjectFlags.Anonymous);
        }
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
