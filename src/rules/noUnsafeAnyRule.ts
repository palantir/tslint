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

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-unsafe-any",
        description: Lint.Utils.dedent`
            Warns when using an expression of type 'any' in an unsafe way.
            Type casts and tests are allowed.
            Expressions that work on all values (such as '"" + x') are allowed.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Unsafe use of expression of type 'any'.";

    public applyWithProgram(srcFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(srcFile, this.getOptions(), langSvc.getProgram()));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {
    public visitNode(node: ts.Node) {
        if (ts.isExpression(node) && isAny(this.getType(node)) && !this.isAllowedLocation(node)) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING);
        } else {
            super.visitNode(node);
        }
    }

    private isAllowedLocation(node: ts.Expression): boolean {
        const parent = node.parent!;
        switch (parent.kind) {
            case ts.SyntaxKind.ExpressionStatement: // Allow unused expression
            case ts.SyntaxKind.Parameter: // Allow to declare a parameter of type 'any'
            case ts.SyntaxKind.TypeOfExpression: // Allow test
            case ts.SyntaxKind.TemplateSpan: // Allow stringification (works on all values)
            // Allow casts
            case ts.SyntaxKind.TypeAssertionExpression:
            case ts.SyntaxKind.AsExpression:
                return true;

            // OK to pass 'any' to a function that takes 'any' as its argument
            case ts.SyntaxKind.CallExpression:
            case ts.SyntaxKind.NewExpression:
                return isAny(this.getTypeChecker().getContextualType(node));

            case ts.SyntaxKind.BinaryExpression:
                const { left, right, operatorToken } = parent as ts.BinaryExpression;
                // Allow equality since all values support equality.
                if (Lint.getEqualsKind(operatorToken) !== undefined) {
                    return true;
                }
                switch (operatorToken.kind) {
                    case ts.SyntaxKind.InstanceOfKeyword: // Allow test
                        return true;
                    case ts.SyntaxKind.PlusToken: // Allow stringification
                        return node === left ? this.isStringLike(right) : this.isStringLike(left);
                    case ts.SyntaxKind.PlusEqualsToken: // Allow stringification in `str += x;`, but not `x += str;`.
                        return node === right && this.isStringLike(left);
                    default:
                        return false;
                }

            // Allow `const x = foo;`, but not `const x: Foo = foo;`.
            case ts.SyntaxKind.VariableDeclaration:
                return Lint.hasModifier(parent.parent!.parent!.modifiers, ts.SyntaxKind.DeclareKeyword) ||
                    (parent as ts.VariableDeclaration).type === undefined;

            case ts.SyntaxKind.PropertyAccessExpression:
                // Don't warn for right hand side; this is redundant if we warn for the left-hand side.
                return (parent as ts.PropertyAccessExpression).name === node;

            default:
                return false;
        }
    }

    private isStringLike(node: ts.Expression) {
        return Lint.isTypeFlagSet(this.getType(node), ts.TypeFlags.StringLike);
    }

    private getType(node: ts.Expression): ts.Type {
        return this.getTypeChecker().getTypeAtLocation(node);
    }
}

function isAny(type: ts.Type | undefined): boolean {
    return type !== undefined && Lint.isTypeFlagSet(type, ts.TypeFlags.Any);
}

// This is marked @internal, but we need it!
declare module "typescript" {
    export function isExpression(node: ts.Node): node is ts.Expression;
}
