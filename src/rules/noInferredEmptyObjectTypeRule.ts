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

    public static EMPTY_INTERFACE_INSTANCE = "Explicit type parameter needs to be provided to the constructor";
    public static EMPTY_INTERFACE_FUNCTION = "Explicit type parameter needs to be provided to the function call";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoInferredEmptyObjectTypeRule(sourceFile, this.ruleName, program.getTypeChecker()));
    }
}

class NoInferredEmptyObjectTypeRule extends Lint.AbstractWalker<void> {
    private scanner: ts.Scanner | undefined = undefined;

    constructor(sourceFile: ts.SourceFile, ruleName: string, private readonly checker: ts.TypeChecker) {
        super(sourceFile, ruleName, undefined);
    }

    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (node.kind === ts.SyntaxKind.CallExpression) {
                this.checkExpression(node as ts.CallExpression, shouldCheckCall, Rule.EMPTY_INTERFACE_FUNCTION);
            } else if (node.kind === ts.SyntaxKind.NewExpression) {
                this.checkExpression(node as ts.NewExpression, shouldCheckNew, Rule.EMPTY_INTERFACE_INSTANCE);
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private checkExpression<T extends ts.CallExpression | ts.NewExpression>(
        node: T,
        shouldCheck: (signature: ts.Signature, checker: ts.TypeChecker, node: T) => boolean,
        failure: string,
    ) {
        if (node.typeArguments !== undefined) {
            return;
        }

        const signature = this.checker.getResolvedSignature(node);
        if (signature !== undefined && shouldCheck(signature, this.checker, node) && this.hasInferredEmptyObject(signature)) {
            this.addFailureAtNode(node, failure);
        }
    }

    private hasInferredEmptyObject(signature: ts.Signature): boolean {
        const str = this.signatureToString(signature);
        if (str[0] !== "<") {
            return false;
        }
        const scanner = this.scanner !== undefined
            ? this.scanner
            : this.scanner = ts.createScanner(ts.ScriptTarget.Latest, true, ts.LanguageVariant.Standard);
        scanner.setText(str, 1); // start at 1 because we know 0 is '<'
        let token = scanner.scan();
        if (token === ts.SyntaxKind.OpenBraceToken && scanner.scan() === ts.SyntaxKind.CloseBraceToken) {
            return true;
        }
        let level = 0;
        /* Scan every token until we get to the closing '>'.
           We need to keep track of nested type arguments, because we are only interested in the top level. */
        while (true) {
            switch (token) {
                case ts.SyntaxKind.CommaToken:
                    if (level === 0) {
                        token = scanner.scan();
                        if (token === ts.SyntaxKind.OpenBraceToken && scanner.scan() === ts.SyntaxKind.CloseBraceToken) {
                            return true;
                        }
                        continue;
                    }
                    break;
                case ts.SyntaxKind.LessThanToken:
                    ++level;
                    break;
                case ts.SyntaxKind.GreaterThanToken:
                    if (level === 0) {
                        return false;
                    }
                    --level;
            }
            token = scanner.scan();
        }
    }

    /** Compatibility wrapper for typescript@2.1 */
    private signatureToString(signature: ts.Signature): string {
        if (this.checker.signatureToString !== undefined) {
            return this.checker.signatureToString(signature, undefined, ts.TypeFormatFlags.WriteTypeArgumentsOfSignature);
        }
        let result = "";
        function addText(text: string) {
            result += text;
        }
        function noop() { /* intentionally empty */ }
        // tslint:disable-next-line:deprecation
        this.checker.getSymbolDisplayBuilder().buildSignatureDisplay(
            signature,
            {
                clear: noop,
                decreaseIndent: noop,
                increaseIndent: noop,
                reportInaccessibleThisError: noop,
                reportPrivateInBaseOfClassExpression: noop,
                trackSymbol: noop,
                writeKeyword: addText,
                writeLine: noop,
                writeOperator: addText,
                writeParameter: addText,
                writeProperty: addText,
                writePunctuation: addText,
                writeSpace: noop,
                writeStringLiteral: addText,
                writeSymbol: addText,
            },
            undefined,
            ts.TypeFormatFlags.WriteTypeArgumentsOfSignature,
        );
        return result;
    }
}

function shouldCheckCall(signature: ts.Signature): boolean {
    return signature.declaration !== undefined && signature.declaration.typeParameters !== undefined;
}

function shouldCheckNew(signature: ts.Signature, checker: ts.TypeChecker, node: ts.NewExpression): boolean {
    if (signature.declaration !== undefined) {
        // There is an explicitly declared construct signature, only check if it has type parameters
        return signature.declaration.typeParameters !== undefined;
    } else {
        // only check if the class has type parameters
        const symbol = checker.getSymbolAtLocation(node.expression);
        return symbol !== undefined && symbol.declarations !== undefined &&
            (symbol.declarations[0] as ts.DeclarationWithTypeParameters).typeParameters !== undefined;
    }
}
