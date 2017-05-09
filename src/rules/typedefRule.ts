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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "typedef",
        description: "Requires type definitions to exist.",
        optionsDescription: Lint.Utils.dedent`
            Several arguments may be optionally provided:

            * \`"call-signature"\` checks return type of functions.
            * \`"arrow-call-signature"\` checks return type of arrow functions.
            * \`"parameter"\` checks type specifier of function parameters for non-arrow functions.
            * \`"arrow-parameter"\` checks type specifier of function parameters for arrow functions.
            * \`"property-declaration"\` checks return types of interface properties.
            * \`"variable-declaration"\` checks non-binding variable declarations.
            * \`"member-variable-declaration"\` checks member variable declarations.
            * \`"object-destructuring"\` checks object destructuring declarations.
            * \`"array-destructuring"\` checks array destructuring declarations.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    "call-signature",
                    "arrow-call-signature",
                    "parameter",
                    "arrow-parameter",
                    "property-declaration",
                    "variable-declaration",
                    "member-variable-declaration",
                    "object-destructuring",
                    "array-destructuring",
                ],
            },
            minLength: 0,
            maxLength: 7,
        },
        optionExamples: [[true, "call-signature", "parameter", "member-variable-declaration"]],
        type: "typescript",
        typescriptOnly: true,
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

    public visitArrowFunction(node: ts.ArrowFunction) {
        const location = (node.parameters != null) ? node.parameters.end : null;

        if (location != null
            && node.parent !== undefined
            && node.parent.kind !== ts.SyntaxKind.CallExpression
            && !isTypedPropertyDeclaration(node.parent)) {

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
        for (const property of node.properties) {
            switch (property.kind) {
                case ts.SyntaxKind.PropertyAssignment:
                    this.visitPropertyAssignment(property as ts.PropertyAssignment);
                    break;
                case ts.SyntaxKind.MethodDeclaration:
                    this.visitMethodDeclaration(property as ts.MethodDeclaration);
                    break;
                case ts.SyntaxKind.GetAccessor:
                    this.visitGetAccessor(property as ts.AccessorDeclaration);
                    break;
                case ts.SyntaxKind.SetAccessor:
                    this.visitSetAccessor(property as ts.AccessorDeclaration);
                    break;
                default:
                    break;
            }
        }
    }

    public visitParameterDeclaration(node: ts.ParameterDeclaration) {
        // a parameter's "type" could be a specific string value, for example `fn(option: "someOption", anotherOption: number)`
        if ((node.type == null || node.type.kind !== ts.SyntaxKind.StringLiteral)
            && node.parent !== undefined
            && node.parent.parent !== undefined) {

            const isArrowFunction = node.parent.kind === ts.SyntaxKind.ArrowFunction;

            let optionName: string | null = null;
            if (isArrowFunction && isTypedPropertyDeclaration(node.parent.parent)) {
                // leave optionName as null and don't perform check
            } else if (isArrowFunction && utils.isPropertyDeclaration(node.parent.parent)) {
                optionName = "member-variable-declaration";
            } else if (isArrowFunction) {
                optionName = "arrow-parameter";
            } else {
                optionName = "parameter";
            }

            if (optionName !== null) {
                this.checkTypeAnnotation(optionName, node.getEnd(), node.type as ts.TypeNode, node.name);
            }
        }
        super.visitParameterDeclaration(node);
    }

    public visitPropertyAssignment(node: ts.PropertyAssignment) {
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
                && (node as ts.Node).parent!.kind !== ts.SyntaxKind.CatchClause
                && node.parent.parent.kind !== ts.SyntaxKind.ForInStatement
                && node.parent.parent.kind !== ts.SyntaxKind.ForOfStatement) {

            let rule: string;
            switch (node.name.kind) {
                case ts.SyntaxKind.ObjectBindingPattern:
                    rule = "object-destructuring";
                    break;
                case ts.SyntaxKind.ArrayBindingPattern:
                    rule = "array-destructuring";
                    break;
                default:
                    rule = "variable-declaration";
                    break;
            }

            this.checkTypeAnnotation(rule, node.name.getEnd(), node.type, node.name);
        }
        super.visitVariableDeclaration(node);
    }

    private handleCallSignature(node: ts.SignatureDeclaration) {
        const location = (node.parameters != null) ? node.parameters.end : null;
        // set accessors can't have a return type.
        if (location != null && node.kind !== ts.SyntaxKind.SetAccessor && node.kind !== ts.SyntaxKind.ArrowFunction) {
            this.checkTypeAnnotation("call-signature", location, node.type, node.name);
        }
    }

    private checkTypeAnnotation(option: string,
                                location: number,
                                typeAnnotation: ts.TypeNode | undefined,
                                name?: ts.Node) {
        if (this.hasOption(option) && typeAnnotation == null) {
            this.addFailureAt(location, 1, "expected " + option + getName(name, ": '", "'") + " to have a typedef");
        }
    }
}

function getName(name?: ts.Node, prefix = "", suffix = ""): string {
    let ns = "";

    if (name != null) {
        switch (name.kind) {
            case ts.SyntaxKind.Identifier:
                ns = (name as ts.Identifier).text;
                break;
            case ts.SyntaxKind.BindingElement:
                ns = getName((name as ts.BindingElement).name);
                break;
            case ts.SyntaxKind.ArrayBindingPattern:
                ns = `[ ${(name as ts.ArrayBindingPattern).elements.map( (n) => getName(n) ).join(", ")} ]`;
                break;
            case ts.SyntaxKind.ObjectBindingPattern:
                ns = `{ ${(name as ts.ObjectBindingPattern).elements.map( (n) => getName(n) ).join(", ")} }`;
                break;
            default:
                break;
        }
    }
    return ns === "" ? "" : `${prefix}${ns}${suffix}`;
}

function isTypedPropertyDeclaration(node: ts.Node): boolean {
    return utils.isPropertyDeclaration(node) && node.type != null;
}
