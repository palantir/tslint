/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "callable-types",
        description: "An interface or literal type with just a call signature can be written as a function type.",
        rationale: "style",
        optionsDescription: "Not configurable.",
        options: null,
        type: "style",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static failureStringForInterface(name: string, sigSuggestion: string): string {
        return `Interface has only a call signature — use \`type ${name} = ${sigSuggestion}\` instead.`;
    }

    public static failureStringForTypeLiteral(sigSuggestion: string): string {
        return `Type literal has only a call signature — use \`${sigSuggestion}\` instead.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {
    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        if (noSupertype(node.heritageClauses)) {
            this.check(node);
        }
        super.visitInterfaceDeclaration(node);
    }

    public visitTypeLiteral(node: ts.TypeLiteralNode) {
        this.check(node);
        super.visitTypeLiteral(node);
    }

    private check(node: ts.InterfaceDeclaration | ts.TypeLiteralNode) {
        if (node.members.length === 1 && node.members[0].kind === ts.SyntaxKind.CallSignature) {
            const call = node.members[0] as ts.CallSignatureDeclaration;
            if (!call.type) {
                // Bad parse
                return;
            }

            const suggestion = renderSuggestion(call);
            if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
                this.addFailureAtNode(node.name, Rule.failureStringForInterface(node.name.getText(), suggestion));
            } else {
                this.addFailureAtNode(call, Rule.failureStringForTypeLiteral(suggestion));
            }
        }
    }
}

/** True if there is no supertype or if the supertype is `Function`. */
function noSupertype(heritageClauses: ts.NodeArray<ts.HeritageClause> | undefined): boolean {
    if (!heritageClauses) {
        return true;
    }

    if (heritageClauses.length === 1) {
        const expr = heritageClauses[0].types![0].expression;
        if (expr.kind === ts.SyntaxKind.Identifier && (expr as ts.Identifier).text === "Function") {
            return true;
        }
    }

    return false;
}

function renderSuggestion(call: ts.CallSignatureDeclaration): string {
    const typeParameters = call.typeParameters && call.typeParameters.map((p) => p.getText()).join(", ");
    const parameters = call.parameters.map((p) => p.getText()).join(", ");
    const returnType = call.type === undefined ? "void" : call.type.getText();
    let res = `(${parameters}) => ${returnType}`;
    if (typeParameters) {
        res = `<${typeParameters}>${res}`;
    }
    return res;
}
