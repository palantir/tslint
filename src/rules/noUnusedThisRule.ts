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

const OPTION_ALLOW_PUBLIC = "allow-public";
const OPTION_ALLOW_PROTECTED = "allow-protected";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unused-this",
        description: "Warns for methods that do not use 'this'.",
        optionsDescription: Lint.Utils.dedent`
            "${OPTION_ALLOW_PUBLIC}" excludes public methods.
            "${OPTION_ALLOW_PROTECTED}" excludes protected methods.`,
        options: {
            type: "string",
            enum: [OPTION_ALLOW_PUBLIC, OPTION_ALLOW_PROTECTED],
        },
        optionExamples: [
            "true",
            `[true, "${OPTION_ALLOW_PUBLIC}", "${OPTION_ALLOW_PROTECTED}"]`,
        ],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Method does not use 'this'. Use a function instead.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}

class Walker extends Lint.RuleWalker {
    private allowPublic = this.hasOption(OPTION_ALLOW_PUBLIC);
    private allowProtected = this.hasOption(OPTION_ALLOW_PROTECTED);
    private isThisUsedStack: boolean[] = [];

    public visitNode(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.ThisKeyword:
                this.setThisUsed();
                break;

            case ts.SyntaxKind.MethodDeclaration:
                const usesThis = this.withThisScope(() => super.visitNode(node));
                if (!usesThis &&
                    node.parent!.kind !== ts.SyntaxKind.ObjectLiteralExpression &&
                    this.shouldWarnForModifiers(node as ts.MethodDeclaration)) {
                    this.addFailureAtNode((node as ts.MethodDeclaration).name, Rule.FAILURE_STRING);
                }
                break;

            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.FunctionExpression:
                this.withThisScope(() => super.visitNode(node));
                break;

            default:
                super.visitNode(node);
        }
    }

    private setThisUsed() {
        if (this.isThisUsedStack.length) {
            this.isThisUsedStack[this.isThisUsedStack.length - 1] = true;
        }
    }

    private withThisScope(recur: () => void): boolean {
        this.isThisUsedStack.push(false);
        recur();
        return this.isThisUsedStack.pop()!;
    }

    private shouldWarnForModifiers(node: ts.MethodDeclaration): boolean {
        switch (methodVisibility(node)) {
            case Visibility.Public:
                return !this.allowPublic;
            case Visibility.Protected:
                return !this.allowProtected;
            default:
                return true;
        }
    }
}

const enum Visibility { Public, Protected, Private }

function methodVisibility(node: ts.MethodDeclaration): Visibility {
    return Lint.hasModifier(node.modifiers, ts.SyntaxKind.PrivateKeyword) ? Visibility.Private :
        Lint.hasModifier(node.modifiers, ts.SyntaxKind.ProtectedKeyword) ? Visibility.Protected :
        Visibility.Public;
}
