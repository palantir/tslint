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
        ruleName: "adjacent-overload-signatures",
        description: "Enforces function overloads to be consecutive.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        rationale: "Improves readability and organization by grouping naturally related items together.",
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY = (name: string) => `All '${name}' signatures should be adjacent`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new AdjacentOverloadSignaturesWalker(sourceFile, this.getOptions()));
    }
}

class AdjacentOverloadSignaturesWalker extends Lint.RuleWalker {

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void {
        this.checkNode(node);
        super.visitInterfaceDeclaration(node);
    }

    public visitTypeLiteral(node: ts.TypeLiteralNode): void {
        this.checkNode(node);
        super.visitTypeLiteral(node);
    }

    public checkNode(node: ts.TypeLiteralNode | ts.InterfaceDeclaration) {
        let last: string = undefined;
        const seen: { [name: string]: boolean } = {};
        for (const member of node.members) {
            if (member.name !== undefined) {
                const methodName = getTextOfPropertyName(member.name);
                if (methodName !== undefined) {
                    if (seen.hasOwnProperty(methodName) && last !== methodName) {
                        this.addFailure(this.createFailure(member.getStart(), member.getWidth(),
                            Rule.FAILURE_STRING_FACTORY(methodName)));
                    }
                    last = methodName;
                    seen[methodName] = true;
                }
            } else {
                last = undefined;
            }
        }
    }
}

function isLiteralExpression(node: ts.Node): node is ts.LiteralExpression {
    return node.kind === ts.SyntaxKind.StringLiteral || node.kind === ts.SyntaxKind.NumericLiteral;
}

function getTextOfPropertyName(name: ts.PropertyName): string {
    switch (name.kind) {
        case ts.SyntaxKind.Identifier:
            return (name as ts.Identifier).text;
        case ts.SyntaxKind.ComputedPropertyName:
            const { expression } = (name as ts.ComputedPropertyName);
            if (isLiteralExpression(expression)) {
                return expression.text;
            }
            break;
        default:
            if (isLiteralExpression(name)) {
                return name.text;
            }
    }
}
