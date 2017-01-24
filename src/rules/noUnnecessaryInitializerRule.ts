/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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
        ruleName: "no-unnecessary-initializer",
        description: "Forbids a 'var'/'let' statement or destructuring initializer to be initialized to 'undefined'.",
        hasFix: true,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Unnecessary initialization to 'undefined'.";
    public static FAILURE_STRING_PARAMETER =
        "Use an optional parameter instead of initializing to 'undefined'. " +
        "Also, the type declaration does not need to include '| undefined'.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {
    public visitVariableDeclaration(node: ts.VariableDeclaration) {
        if (isBindingPattern(node.name)) {
            for (const elem of node.name.elements) {
                if (elem.kind === ts.SyntaxKind.BindingElement) {
                    this.checkInitializer(elem);
                }
            }
        } else if (!Lint.isNodeFlagSet(node.parent!, ts.NodeFlags.Const)) {
            this.checkInitializer(node);
        }

        super.visitVariableDeclaration(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        this.checkSignature(node);
        super.visitMethodDeclaration(node);
    }
    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this.checkSignature(node);
        super.visitFunctionDeclaration(node);
    }
    public visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
        this.checkSignature(node);
        super.visitConstructorDeclaration(node);
    }

    private checkSignature({ parameters }: ts.MethodDeclaration | ts.FunctionDeclaration | ts.ConstructorDeclaration) {
        parameters.forEach((parameter, i) => {
            if (isUndefined(parameter.initializer)) {
                if (parametersAllOptionalAfter(parameters, i)) {
                    // No fix since they may want to remove '| undefined' from the type.
                    this.addFailureAtNode(parameter, Rule.FAILURE_STRING_PARAMETER);
                } else {
                    this.failWithFix(parameter);
                }
            }
        });
    }

    private checkInitializer(node: ts.VariableDeclaration | ts.BindingElement) {
        if (isUndefined(node.initializer)) {
            this.failWithFix(node);
        }
    }

    private failWithFix(node: ts.VariableDeclaration | ts.BindingElement | ts.ParameterDeclaration) {
        const fix = this.createFix(this.deleteFromTo(
            Lint.childOfKind(node, ts.SyntaxKind.EqualsToken)!.pos,
            node.end));
        this.addFailureAtNode(node, Rule.FAILURE_STRING, fix);
    }
}

function parametersAllOptionalAfter(parameters: ts.ParameterDeclaration[], idx: number): boolean {
    for (let i = idx + 1; i < parameters.length; i++) {
        if (parameters[i].questionToken) {
            return true;
        }
        if (!parameters[i].initializer) {
            return false;
        }
    }
    return true;
}

function isUndefined(node: ts.Node | undefined): boolean {
    return node !== undefined &&
        node.kind === ts.SyntaxKind.Identifier &&
        (node as ts.Identifier).originalKeywordKind === ts.SyntaxKind.UndefinedKeyword;
}

function isBindingPattern(node: ts.Node): node is ts.ArrayBindingPattern | ts.ObjectBindingPattern {
    return node.kind === ts.SyntaxKind.ArrayBindingPattern || node.kind === ts.SyntaxKind.ObjectBindingPattern;
}
