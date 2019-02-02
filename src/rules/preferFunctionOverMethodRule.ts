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

import { getPropertyName, hasModifier, hasOwnThisReference, isMethodDeclaration } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

const OPTION_ALLOW_PUBLIC = "allow-public";
const OPTION_ALLOW_PROTECTED = "allow-protected";

interface Options {
    allowPublic: boolean;
    allowProtected: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-function-over-method",
        description: "Warns for class methods that do not use 'this'.",
        optionsDescription: Lint.Utils.dedent`
            "${OPTION_ALLOW_PUBLIC}" excludes checking of public methods.
            "${OPTION_ALLOW_PROTECTED}" excludes checking of protected methods.`,
        options: {
            type: "string",
            enum: [OPTION_ALLOW_PUBLIC, OPTION_ALLOW_PROTECTED],
        },
        optionExamples: [true, [true, OPTION_ALLOW_PUBLIC, OPTION_ALLOW_PROTECTED]],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Class method does not use 'this'. Use a function instead.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new PreferFunctionOverMethodWalker(sourceFile, this.ruleName, {
                allowProtected: this.ruleArguments.indexOf(OPTION_ALLOW_PROTECTED) !== -1,
                allowPublic: this.ruleArguments.indexOf(OPTION_ALLOW_PUBLIC) !== -1,
            }),
        );
    }
}

class PreferFunctionOverMethodWalker extends Lint.AbstractWalker<Options> {
    private currentScope?: ThisUsed;

    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (isMethodDeclaration(node) && !this.isExempt(node)) {
                // currentScope is always undefined here, so we don't need to save it and just set it to undefined afterwards
                this.currentScope = {
                    isThisUsed: false,
                    name: getPropertyName(node.name),
                };
                ts.forEachChild(node, cb);
                if (!this.currentScope.isThisUsed) {
                    this.addFailureAtNode(node.name, Rule.FAILURE_STRING);
                }
                this.currentScope = undefined;
            } else if (hasOwnThisReference(node)) {
                const scope = this.currentScope;
                this.currentScope = undefined;
                ts.forEachChild(node, cb);
                this.currentScope = scope;
            } else if (
                this.currentScope !== undefined &&
                ((node.kind === ts.SyntaxKind.ThisKeyword &&
                    !isRecursiveCall(node, this.currentScope.name)) ||
                    node.kind === ts.SyntaxKind.SuperKeyword)
            ) {
                this.currentScope.isThisUsed = true;
            } else {
                return ts.forEachChild(node, cb);
            }
        };
        return ts.forEachChild(sourceFile, cb);
    }

    private isExempt(node: ts.MethodDeclaration): boolean {
        // TODO: handle the override keyword once it lands in the language
        return (
            node.body === undefined || // exclude abstract methods and overload signatures
            // exclude object methods
            (node.parent.kind !== ts.SyntaxKind.ClassDeclaration &&
                node.parent.kind !== ts.SyntaxKind.ClassExpression) ||
            hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword) ||
            (this.options.allowProtected &&
                hasModifier(node.modifiers, ts.SyntaxKind.ProtectedKeyword)) ||
            (this.options.allowPublic &&
                (hasModifier(node.modifiers, ts.SyntaxKind.PublicKeyword) ||
                    !hasModifier(
                        node.modifiers,
                        ts.SyntaxKind.ProtectedKeyword,
                        ts.SyntaxKind.PrivateKeyword,
                    )))
        );
    }
}

interface ThisUsed {
    readonly name: string | undefined;
    isThisUsed: boolean;
}

function isRecursiveCall(node: ts.Node, name?: string) {
    return (
        name !== undefined &&
        node.parent.kind === ts.SyntaxKind.PropertyAccessExpression &&
        (node.parent as ts.PropertyAccessExpression).name.text === name
    );
}
