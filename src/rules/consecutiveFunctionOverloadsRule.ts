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
        ruleName: "consecutive-function-overloads",
        description: "Enforces function overloads to be consecutive.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "style",
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING_FACTORY = (name: string) => `All '${name}' signatures should be adjacent`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoNonConsecutiveFunctionOverload(sourceFile, this.getOptions()));
    }
}

function isStringOrNumericLiteral(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.StringLiteral || kind === ts.SyntaxKind.NumericLiteral;
}

function getTextOfPropertyName(name: ts.PropertyName): string {
    switch (name.kind) {
        case ts.SyntaxKind.Identifier:
            return (<ts.Identifier> name).text;
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.NumericLiteral:
            return (<ts.LiteralExpression> name).text;
        case ts.SyntaxKind.ComputedPropertyName:
            if (isStringOrNumericLiteral((<ts.ComputedPropertyName> name).expression.kind)) {
                return (<ts.LiteralExpression> (<ts.ComputedPropertyName> name).expression).text;
            }
        default:
            return undefined;
    }
}

class NoNonConsecutiveFunctionOverload extends Lint.BlockScopeAwareRuleWalker<{}, ScopeInfo> {

    public createScope(): any {
        return undefined;
    }

    public createBlockScope(): ScopeInfo {
        return new ScopeInfo();
    }

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void {
        const members = node.members;
        for (const member of members) {
            if (member.name !== undefined) {
                const methodName = getTextOfPropertyName(member.name);
                if (methodName !== undefined) {
                    this.handleMethodName(member, methodName);
                }
            }
        }
        super.visitInterfaceDeclaration(node);
    }

    private handleMethodName(node: ts.Node, methodName: string) {
        const currentBlockScope = this.getCurrentBlockScope();
        const lastPosition = currentBlockScope.methodNames.lastIndexOf(methodName);
        if (lastPosition >= 0 && lastPosition !== (currentBlockScope.methodNames.length - 1)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_FACTORY(methodName)));
        }
        currentBlockScope.methodNames.push(methodName);
    }
}

class ScopeInfo {
    public methodNames: string[] = [];
}
