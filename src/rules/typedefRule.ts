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

import { codeExamples } from "./code-examples/typedef.examples";

interface Options {
    "call-signature"?: boolean;
    "arrow-call-signature"?: boolean;
    parameter?: boolean;
    "arrow-parameter"?: boolean;
    "property-declaration"?: boolean;
    "variable-declaration"?: boolean;
    "member-variable-declaration"?: boolean;
    "object-destructuring"?: boolean;
    "array-destructuring"?: boolean;
}
type Option = keyof Options;

const OPTION_CALL_SIGNATURE: Option = "call-signature";
const OPTION_ARROW_CALL_SIGNATURE: Option = "arrow-call-signature";
const OPTION_PARAMETER: Option = "parameter";
const OPTION_ARROW_PARAMETER: Option = "arrow-parameter";
const OPTION_PROPERTY_DECLARATION: Option = "property-declaration";
const OPTION_VARIABLE_DECLARATION: Option = "variable-declaration";
const OPTION_MEMBER_VARIABLE_DECLARATION: Option = "member-variable-declaration";
const OPTION_OBJECT_DESTRUCTURING: Option = "object-destructuring";
const OPTION_ARRAY_DESTRUCTURING: Option = "array-destructuring";

function parseOptions(ruleArguments: Option[]) {
    const options: Options = {};
    for (const arg of ruleArguments) {
        options[arg] = true;
    }
    return options;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "typedef",
        description: "Requires type definitions to exist.",
        optionsDescription: Lint.Utils.dedent`
            Several arguments may be optionally provided:

            * \`"${OPTION_CALL_SIGNATURE}"\` checks return type of functions.
            * \`"${OPTION_ARROW_CALL_SIGNATURE}"\` checks return type of arrow functions.
            * \`"${OPTION_PARAMETER}"\` checks type specifier of function parameters for non-arrow functions.
            * \`"${OPTION_ARROW_PARAMETER}"\` checks type specifier of function parameters for arrow functions.
            * \`"${OPTION_PROPERTY_DECLARATION}"\` checks return types of interface properties.
            * \`"${OPTION_VARIABLE_DECLARATION}"\` checks non-binding variable declarations.
            * \`"${OPTION_MEMBER_VARIABLE_DECLARATION}"\` checks member variable declarations.
            * \`"${OPTION_OBJECT_DESTRUCTURING}"\` checks object destructuring declarations.
            * \`"${OPTION_ARRAY_DESTRUCTURING}"\` checks array destructuring declarations.`,
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    OPTION_CALL_SIGNATURE,
                    OPTION_ARROW_CALL_SIGNATURE,
                    OPTION_PARAMETER,
                    OPTION_ARROW_PARAMETER,
                    OPTION_PROPERTY_DECLARATION,
                    OPTION_VARIABLE_DECLARATION,
                    OPTION_MEMBER_VARIABLE_DECLARATION,
                    OPTION_OBJECT_DESTRUCTURING,
                    OPTION_ARRAY_DESTRUCTURING,
                ],
            },
            minLength: 0,
            maxLength: 7,
        },
        optionExamples: [
            [true, OPTION_CALL_SIGNATURE, OPTION_PARAMETER, OPTION_MEMBER_VARIABLE_DECLARATION],
        ],
        type: "typescript",
        typescriptOnly: true,
        codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new TypedefWalker(sourceFile, this.ruleName, parseOptions(this.ruleArguments)),
        );
    }
}

class TypedefWalker extends Lint.AbstractWalker<Options> {
    public walk(sourceFile: ts.SourceFile): void {
        const cb = (node: ts.Node): void => {
            switch (node.kind) {
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.FunctionExpression:
                case ts.SyntaxKind.GetAccessor:
                case ts.SyntaxKind.MethodDeclaration:
                case ts.SyntaxKind.MethodSignature: {
                    const { name, parameters, type } = node as ts.CallSignatureDeclaration;
                    this.checkTypeAnnotation(
                        "call-signature",
                        name !== undefined ? name : parameters,
                        type,
                        name,
                    );
                    break;
                }
                case ts.SyntaxKind.ArrowFunction:
                    this.checkArrowFunction(node as ts.ArrowFunction);
                    break;
                case ts.SyntaxKind.Parameter:
                    this.checkParameter(node as ts.ParameterDeclaration);
                    break;
                case ts.SyntaxKind.PropertyDeclaration:
                    this.checkPropertyDeclaration(node as ts.PropertyDeclaration);
                    break;
                case ts.SyntaxKind.PropertySignature: {
                    const { name, type } = node as ts.PropertySignature;
                    this.checkTypeAnnotation("property-declaration", name, type, name);
                    break;
                }
                case ts.SyntaxKind.VariableDeclaration:
                    this.checkVariableDeclaration(node as ts.VariableDeclaration);
            }

            return ts.forEachChild(node, cb);
        };

        return ts.forEachChild(sourceFile, cb);
    }

    private checkArrowFunction({ parent, parameters, type }: ts.ArrowFunction): void {
        if (parent.kind !== ts.SyntaxKind.CallExpression && !isTypedPropertyDeclaration(parent)) {
            this.checkTypeAnnotation("arrow-call-signature", parameters, type);
        }
    }

    private checkParameter({ parent, name, type }: ts.ParameterDeclaration): void {
        const isArrowFunction = parent.kind === ts.SyntaxKind.ArrowFunction;

        const option = (() => {
            if (!isArrowFunction) {
                return "parameter";
            } else if (isTypedPropertyDeclaration(parent.parent)) {
                return undefined;
            } else if (utils.isPropertyDeclaration(parent.parent)) {
                return "member-variable-declaration";
            } else {
                return "arrow-parameter";
            }
        })();

        if (option !== undefined) {
            this.checkTypeAnnotation(option, name, type, name);
        }
    }

    private checkPropertyDeclaration({ initializer, name, type }: ts.PropertyDeclaration): void {
        // If this is an arrow function, it doesn't need to have a typedef on the property declaration
        // as the typedefs can be on the function's parameters instead
        if (initializer === undefined || initializer.kind !== ts.SyntaxKind.ArrowFunction) {
            this.checkTypeAnnotation("member-variable-declaration", name, type, name);
        }
    }

    private checkVariableDeclaration({ parent, name, type }: ts.VariableDeclaration): void {
        // variable declarations should always have a grandparent, but check that to be on the safe side.
        // catch statements will be the parent of the variable declaration
        // for-in/for-of loops will be the gradparent of the variable declaration
        if (
            parent.kind === ts.SyntaxKind.CatchClause ||
            parent.parent.kind === ts.SyntaxKind.ForInStatement ||
            parent.parent.kind === ts.SyntaxKind.ForOfStatement
        ) {
            return;
        }

        const option = (() => {
            switch (name.kind) {
                case ts.SyntaxKind.ObjectBindingPattern:
                    return "object-destructuring";
                case ts.SyntaxKind.ArrayBindingPattern:
                    return "array-destructuring";
                default:
                    return "variable-declaration";
            }
        })();

        this.checkTypeAnnotation(option, name, type, name);
    }

    private checkTypeAnnotation(
        option: Option,
        location: ts.Node | ts.NodeArray<ts.Node>,
        typeAnnotation: ts.TypeNode | undefined,
        name?: ts.Node,
    ): void {
        if (this.options[option] === true && typeAnnotation === undefined) {
            const failure = `expected ${option}${
                name === undefined ? "" : `: '${name.getText()}'`
            } to have a typedef`;
            if (isNodeArray(location)) {
                this.addFailure(location.pos - 1, location.end + 1, failure);
            } else {
                this.addFailureAtNode(location, failure);
            }
        }
    }
}

function isTypedPropertyDeclaration(node: ts.Node): boolean {
    return utils.isPropertyDeclaration(node) && node.type !== undefined;
}

export function isNodeArray(
    nodeOrArray: ts.Node | ts.NodeArray<ts.Node>,
): nodeOrArray is ts.NodeArray<ts.Node> {
    return Array.isArray(nodeOrArray);
}
