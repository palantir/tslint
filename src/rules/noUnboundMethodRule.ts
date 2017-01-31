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
        ruleName: "no-unbound-method",
        description: "Warns when a method is used as outside of a method call.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Avoid referencing unbound methods which may cause unintentional scoping of 'this'.";

    public applyWithProgram(srcFile: ts.SourceFile, langSvc: ts.LanguageService): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(srcFile, this.getOptions(), langSvc.getProgram()));
    }
}

class Walker extends Lint.ProgramAwareRuleWalker {
    public visitPropertyAccessExpression(node: ts.PropertyAccessExpression) {
        if (!isSafeUse(node)) {
            const symbol = this.getTypeChecker().getSymbolAtLocation(node);
            const declaration = symbol && symbol.valueDeclaration;
            if (declaration && isMethod(declaration)) {
                this.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        }
        super.visitPropertyAccessExpression(node);
    }
}

function isMethod(node: ts.Node): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.MethodSignature:
            return true;
        default:
            return false;
    }
}

function isSafeUse(node: ts.Node): boolean {
    const parent = node.parent!;
    switch (parent.kind) {
        case ts.SyntaxKind.CallExpression:
            return (parent as ts.CallExpression).expression === node;
        case ts.SyntaxKind.TaggedTemplateExpression:
            return (parent as ts.TaggedTemplateExpression).tag === node;
        // E.g. `obj.method.bind(obj)`.
        case ts.SyntaxKind.PropertyAccessExpression:
            return true;
        // Allow most binary operators, but don't allow e.g. `myArray.forEach(obj.method || otherObj.otherMethod)`.
        case ts.SyntaxKind.BinaryExpression:
            return (parent as ts.BinaryExpression).operatorToken.kind !== ts.SyntaxKind.BarBarToken;
        default:
            return false;
    }
}
