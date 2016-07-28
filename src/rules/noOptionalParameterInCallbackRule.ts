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
        ruleName: "no-optional-parameter-in-callback",
        description: "Disallows optional parameters in callback positions.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "typescript",
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING =
    `No optional parameters in callback positions - consider writing \`T | undefined\` or something similar instead`;

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoOptionalParameterInCallbackRule(sourceFile, this.getOptions(), program));
    }
}

class NoOptionalParameterInCallbackRule extends Lint.ProgramAwareRuleWalker {

    private checker = this.getTypeChecker();

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void {
        const members = node.members;
        for (const member of members) {
            if (member.kind === ts.SyntaxKind.MethodSignature) {
                this.validateSignature(<ts.MethodDeclaration> <ts.Node> member);
            }
        }
        super.visitInterfaceDeclaration(node);
    }

    public visitTypeLiteral(node: ts.TypeLiteralNode): void {
        const props = this.checker.getPropertiesOfType(this.checker.getTypeAtLocation(node));
        for (const prop of props) {
            for (const declaration of prop.declarations) {
                const propType = this.checker.getTypeAtLocation(declaration);
                if (this.isFunctionType(propType)) {
                    this.validateFunctionType(propType);
                }
            }
        }
        super.visitTypeLiteral(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.validateSignature(node);
        super.visitMethodDeclaration(node);
    }

    public visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
        this.validateSignature(node);
        super.visitConstructorDeclaration(node);
    }

    public visitArrowFunction(node: ts.FunctionLikeDeclaration): void {
        this.validateSignature(node);
        super.visitArrowFunction(node);
    }

    public visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        this.validateSignature(node);
        super.visitFunctionDeclaration(node);
    }

    public visitFunctionExpression(node: ts.FunctionExpression): void {
        this.validateSignature(node);
        super.visitFunctionExpression(node);
    }

    /* tslint:disable:no-bitwise */
    private isFunctionType(type: ts.Type): boolean {
        return type.flags & ts.TypeFlags.ObjectType && this.checker.getSignaturesOfType(type, ts.SignatureKind.Call).length > 0;
    }
    /* tslint:enable:no-bitwise */

    private validateFunctionType(node: ts.Type) {
        const signatures = this.checker.getSignaturesOfType(node, ts.SignatureKind.Call);
        for (const signature of signatures) {
            for (const param of signature.parameters) {
                const declarations = param.getDeclarations() as ts.ParameterDeclaration[];
                for (const declaration of declarations) {
                    if (this.checker.isOptionalParameter(declaration)) {
                        this.addFailure(this.createFailure(declaration.getStart(), declaration.getWidth(), Rule.FAILURE_STRING));
                    }
                }
            }
        }
    }

    private validateSignature(node: ts.SignatureDeclaration) {
        const that = this;
        const signatureParametersType: ts.Type[] = node.parameters.filter(p => !!p.type)
            .map(function (parameter: ts.ParameterDeclaration) { return that.checker.getTypeAtLocation(parameter); });
        for (const type of signatureParametersType) {
            if (this.isFunctionType(type)) {
                this.validateFunctionType(type);
            }
        }
    }
}
