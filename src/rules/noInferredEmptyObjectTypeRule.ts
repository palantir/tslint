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
            if (node.kind === ts.SyntaxKind.CallExpression || node.kind === ts.SyntaxKind.NewExpression) {
                this.checkSignature(node as ts.CallExpression | ts.NewExpression);
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private checkSignature(node: ts.CallExpression | ts.NewExpression): void {
        if (node.typeArguments !== undefined) {
            return;
        }

        const callSig = this.checker.getResolvedSignature(node);
        if (callSig === undefined || callSig.declaration === undefined || callSig.declaration.typeParameters === undefined) {
            return;
        }

        if (hasInferredEmptyObject(callSig, this.checker)) {
            this.addFailureAtNode(
                node,
                node.kind === ts.SyntaxKind.NewExpression ? Rule.EMPTY_INTERFACE_INSTANCE : Rule.EMPTY_INTERFACE_FUNCTION,
            );
        }
    }
}

function hasInferredEmptyObject(signature: ts.Signature, checker: ts.TypeChecker) {
    let level = 0;
    let inTypeArguments = false;
    let couldBeEmptyObject = false;
    let hasEmptyObjectType = false;
    let lastText: string | undefined;
    checker.getSymbolDisplayBuilder().buildSignatureDisplay(
        signature,
        {
            writeKeyword(text: string) { lastText = text; },
            writeOperator(text: string) { lastText = text; },
            writePunctuation(text: string) {
                switch (text) {
                    case "<":
                        ++level;
                        if (lastText === undefined) {
                            inTypeArguments = true;
                        }
                        break;
                    case ">":
                        --level;
                        if (level === 0) {
                            inTypeArguments = false;
                        }
                        break;
                    case "{":
                        couldBeEmptyObject = level === 1 && inTypeArguments && (lastText === "<" || lastText === ",");
                        break;
                    case "}":
                        if (couldBeEmptyObject && lastText === "{") {
                            hasEmptyObjectType = true;
                        }
                }
                lastText = text;
            },
            writeSpace() { /* not relevant */},
            writeStringLiteral(text) { lastText = text; },
            writeParameter(text) {lastText = text; },
            writeProperty(text) { lastText = text; },
            writeSymbol(text) { lastText = text; },
            writeLine() { /* not relevant */},
            increaseIndent() { /* not relevant */},
            decreaseIndent() { /* not relevant */},
            clear() { /* not relevant */},
            trackSymbol() { /* not relevant */},
            reportInaccessibleThisError() { /* not relevant */},
            reportPrivateInBaseOfClassExpression() { /* not relevant */},
        },
        undefined,
        ts.TypeFormatFlags.WriteTypeArgumentsOfSignature);
    return hasEmptyObjectType;
}
