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

import { isTypeLiteralNode } from "tsutils";
import * as ts from "typescript";
import * as Lint from "../index";

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
        if (node.typeArguments !== undefined) {
            return;
        }

        const signature = this.checker.getResolvedSignature(node);
        if (signature === undefined) {
            return;
        }
        if (signature.declaration !== undefined) {
            if (signature.declaration.typeParameters === undefined) {
                // There is an explicitly declared construct signature, but it has no type parameters -> nothing to check here
                return;
            }
        } else {
            const symbol = this.checker.getSymbolAtLocation(node.expression);
            if (symbol !== undefined && symbol.declarations !== undefined &&
                (symbol.declarations[0] as ts.DeclarationWithTypeParameters).typeParameters === undefined) {
                return; // the class has no type parameters -> nothing to check here
            }
        }

        if (hasInferredEmptyObject(signature, this.checker)) {
            this.addFailureAtNode(node, Rule.EMPTY_INTERFACE_INSTANCE);
        }
    }

    private checkCallExpression(node: ts.CallExpression): void {
        if (node.typeArguments !== undefined) {
            return;
        }

        const signature = this.checker.getResolvedSignature(node);
        if (signature === undefined || signature.declaration === undefined || signature.declaration.typeParameters === undefined) {
            return;
        }

        if (hasInferredEmptyObject(signature, this.checker)) {
            this.addFailureAtNode(node, Rule.EMPTY_INTERFACE_FUNCTION);
        }
    }
}

function hasInferredEmptyObject(signature: ts.Signature, checker: ts.TypeChecker): boolean {
    const str = checker.signatureToString(signature, undefined, ts.TypeFormatFlags.WriteTypeArgumentsOfSignature);
    if (str[0] !== "<") {
        return false;
    }
    const source = ts.createSourceFile("temp.ts", `foo${str.substring(0, str.indexOf(">(") + 1)}()`, ts.ScriptTarget.Latest);
    return ((source.statements[0] as ts.ExpressionStatement).expression as ts.CallExpression).typeArguments!.some(isEmptyObject);
}

function isEmptyObject(node: ts.TypeNode): boolean {
    return isTypeLiteralNode(node) && node.members.length === 0;
}
