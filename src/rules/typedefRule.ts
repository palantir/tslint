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

import * as Lint from "../lint";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "typedef",
        description: "Requires type definitions to exist.",
        optionsDescription: Lint.Utils.dedent`
            Six arguments may be optionally provided:

            * \`"call-signature"\` checks return type of functions.
            * \`"parameter"\` checks type specifier of function parameters for non-arrow functions.
            * \`"arrow-parameter"\` checks type specifier of function parameters for arrow functions.
            * \`"property-declaration"\` checks return types of interface properties.
            * \`"variable-declaration"\` checks variable declarations.
            * \`"member-variable-declaration"\` checks member variable declarations.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    "call-signature",
                    "parameter",
                    "arrow-parameter",
                    "property-declaration",
                    "variable-declaration",
                    "member-variable-declaration",
                ],
            },
            minLength: 0,
            maxLength: 6,
        },
        optionExamples: ['[true, "call-signature", "parameter", "member-variable-declaration"]'],
        type: "typescript",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "missing type declaration";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new TypedefWalker(sourceFile, this.getOptions()));
    }
}

class TypedefWalker extends Lint.RuleWalker {
    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this.handleCallSignature(node);
        super.visitFunctionDeclaration(node);
    }

    public visitFunctionExpression(node: ts.FunctionExpression) {
        this.handleCallSignature(node);
        super.visitFunctionExpression(node);
    }

    public visitArrowFunction(node: ts.FunctionLikeDeclaration) {
        const location = (node.parameters != null) ? node.parameters.end : null;

        if (node.parent.kind !== ts.SyntaxKind.CallExpression && !isTypedPropertyDeclaration(node.parent)) {
            this.checkTypeAnnotation("arrow-call-signature", location, node.type, node.name);
        }
        super.visitArrowFunction(node);
    }

    public visitGetAccessor(node: ts.AccessorDeclaration) {
        this.handleCallSignature(node);
        super.visitGetAccessor(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.handleCallSignature(node);
        super.visitMethodDeclaration(node);
    }

    public visitMethodSignature(node: ts.SignatureDeclaration) {
        this.handleCallSignature(node);
        super.visitMethodSignature(node);
    }

    public visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
        for (let property of node.properties) {
            switch (property.kind) {
                case ts.SyntaxKind.PropertyAssignment:
                    this.visitPropertyAssignment(<ts.PropertyAssignment> property);
                    break;
                case ts.SyntaxKind.MethodDeclaration:
                    this.visitMethodDeclaration(<ts.MethodDeclaration> property);
                    break;
                case ts.SyntaxKind.GetAccessor:
                    this.visitGetAccessor(<ts.AccessorDeclaration> property);
                    break;
                case ts.SyntaxKind.SetAccessor:
                    this.visitSetAccessor(<ts.AccessorDeclaration> property);
                    break;
                default:
                    break;
            }
        }
    }

    public visitParameterDeclaration(node: ts.ParameterDeclaration) {
        // a parameter's "type" could be a specific string value, for example `fn(option: "someOption", anotherOption: number)`
        if (node.type == null || node.type.kind !== ts.SyntaxKind.StringLiteral) {
            const isArrowFunction = node.parent.kind === ts.SyntaxKind.ArrowFunction;
            let performCheck = true;

            let optionName: string;
            if (isArrowFunction && isTypedPropertyDeclaration(node.parent.parent)) {
                performCheck = false;
            } else if (isArrowFunction && isPropertyDeclaration(node.parent.parent)) {
                optionName = "member-variable-declaration";
            } else if (isArrowFunction) {
                optionName = "arrow-parameter";
            } else {
                optionName = "parameter";
            }

            if (performCheck) {
                this.checkTypeAnnotation(optionName, node.getEnd(), <ts.TypeNode> node.type, node.name);
            }
        }
        super.visitParameterDeclaration(node);
    }

    public visitPropertyAssignment(node: ts.PropertyAssignment) {
        switch (node.initializer.kind) {
            case ts.SyntaxKind.ArrowFunction:
            case ts.SyntaxKind.FunctionExpression:
                this.handleCallSignature(node.initializer as ts.FunctionExpression);
                break;
            default:
                break;
        }
        super.visitPropertyAssignment(node);
    }

    public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        const optionName = "member-variable-declaration";

        // If this is an arrow function, it doesn't need to have a typedef on the property declaration
        // as the typedefs can be on the function's parameters instead
        const performCheck = !(node.initializer != null && node.initializer.kind === ts.SyntaxKind.ArrowFunction && node.type == null);

        if (performCheck) {
            this.checkTypeAnnotation(optionName, node.name.getEnd(), node.type, node.name);
        }
        super.visitPropertyDeclaration(node);
    }

    public visitPropertySignature(node: ts.PropertyDeclaration) {
        const optionName = "property-declaration";
        this.checkTypeAnnotation(optionName, node.name.getEnd(), node.type, node.name);
        super.visitPropertySignature(node);
    }

    public visitSetAccessor(node: ts.AccessorDeclaration) {
        this.handleCallSignature(node);
        super.visitSetAccessor(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        // variable declarations should always have a grandparent, but check that to be on the safe side.
        // catch statements will be the parent of the variable declaration
        // for-in/for-of loops will be the gradparent of the variable declaration
        if (node.parent != null && node.parent.parent != null
                && node.parent.kind !== ts.SyntaxKind.CatchClause
                && node.parent.parent.kind !== ts.SyntaxKind.ForInStatement
                && node.parent.parent.kind !== ts.SyntaxKind.ForOfStatement) {
            this.checkTypeAnnotation("variable-declaration", node.name.getEnd(), node.type, node.name);
        }
        super.visitVariableDeclaration(node);
    }

    private handleCallSignature(node: ts.SignatureDeclaration) {
        const location = (node.parameters != null) ? node.parameters.end : null;
        // set accessors can't have a return type.
        if (node.kind !== ts.SyntaxKind.SetAccessor && node.kind !== ts.SyntaxKind.ArrowFunction) {
            this.checkTypeAnnotation("call-signature", location, node.type, node.name);
        }
    }

    private checkTypeAnnotation(option: string,
                                location: number,
                                typeAnnotation: ts.TypeNode,
                                name?: ts.Node) {
        if (this.hasOption(option) && typeAnnotation == null) {
            let ns = "";
            if (name != null && name.kind === ts.SyntaxKind.Identifier) {
                ns = `: '${(<ts.Identifier> name).text}'`;
            }
            let failure = this.createFailure(location, 1, "expected " + option + ns + " to have a typedef");
            this.addFailure(failure);
        }
    }
}

function isPropertyDeclaration(node: ts.Node): node is ts.PropertyDeclaration {
    return node.kind === ts.SyntaxKind.PropertyDeclaration;
}

function isTypedPropertyDeclaration(node: ts.Node): boolean {
    return isPropertyDeclaration(node) && node.type != null;
}
