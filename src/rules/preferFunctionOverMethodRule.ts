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
        ruleName: "prefer-function-over-method",
        description: "Warns for class methods that do not use 'this'.",
        optionsDescription: Lint.Utils.dedent`
            "${OPTION_ALLOW_PUBLIC}" excludes checking of public methods.
            "${OPTION_ALLOW_PROTECTED}" excludes checking of protected methods.`,
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

    public static FAILURE_STRING = "Class method does not use 'this'. Use a function instead.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new PreferFunctionOverMethodWalker(sourceFile, this.getOptions()));
    }
}

class PreferFunctionOverMethodWalker extends Lint.RuleWalker {
    private allowPublic = this.hasOption(OPTION_ALLOW_PUBLIC);
    private allowProtected = this.hasOption(OPTION_ALLOW_PROTECTED);
    private stack: ThisUsed[] = [];

    public visitNode(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.ThisKeyword:
            case ts.SyntaxKind.SuperKeyword:
                this.setThisUsed(node);
                break;

            case ts.SyntaxKind.MethodDeclaration:
                const { name } = node as ts.MethodDeclaration;
                const usesThis = this.withThisScope(
                    name.kind === ts.SyntaxKind.Identifier ? name.text : undefined,
                    () => super.visitNode(node),
                );
                if (!usesThis
                        && node.parent!.kind !== ts.SyntaxKind.ObjectLiteralExpression
                        && this.shouldWarnForModifiers(node as ts.MethodDeclaration)) {
                    this.addFailureAtNode((node as ts.MethodDeclaration).name, Rule.FAILURE_STRING);
                }
                break;

            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.FunctionExpression:
                this.withThisScope(undefined, () => super.visitNode(node));
                break;

            default:
                super.visitNode(node);
        }
    }

    private setThisUsed(node: ts.Node) {
        const cur = this.stack[this.stack.length - 1];
        if (cur && !isRecursiveCall(node, cur)) {
            cur.isThisUsed = true;
        }
    }

    private withThisScope(name: string | undefined, recur: () => void): boolean {
        this.stack.push({ name, isThisUsed: false });
        recur();
        return this.stack.pop()!.isThisUsed;
    }

    private shouldWarnForModifiers(node: ts.MethodDeclaration): boolean {
        if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword)) {
            return false;
        }
        // TODO: Also return false if it's marked "override" (https://github.com/palantir/tslint/pull/2037)

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

interface ThisUsed {
    readonly name: string | undefined;
    isThisUsed: boolean;
}

function isRecursiveCall(thisOrSuper: ts.Node, cur: ThisUsed) {
    const parent = thisOrSuper.parent!;
    return thisOrSuper.kind === ts.SyntaxKind.ThisKeyword
        && parent.kind === ts.SyntaxKind.PropertyAccessExpression
        && (parent as ts.PropertyAccessExpression).name.text === cur.name;
}

const enum Visibility { Public, Protected, Private }

function methodVisibility(node: ts.MethodDeclaration): Visibility {
    if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.PrivateKeyword)) {
        return Visibility.Private;
    } else if (Lint.hasModifier(node.modifiers, ts.SyntaxKind.ProtectedKeyword)) {
        return Visibility.Protected;
    } else {
        return Visibility.Public;
    }
}
