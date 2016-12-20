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

import * as Lint from "../index";

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

    public static FAILURE_STRING_FACTORY = (name: string) => {
        return `All '${name}' signatures should be adjacent`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new AdjacentOverloadSignaturesWalker(sourceFile, this.getOptions()));
    }
}

class AdjacentOverloadSignaturesWalker extends Lint.RuleWalker {
    public visitSourceFile(node: ts.SourceFile) {
        this.visitStatements(node.statements);
        super.visitSourceFile(node);
    }

    public visitModuleDeclaration(node: ts.ModuleDeclaration) {
        const { body } = node;
        if (body && body.kind === ts.SyntaxKind.ModuleBlock) {
            this.visitStatements((body as ts.ModuleBlock).statements);
        }
        super.visitModuleDeclaration(node);
    }

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void {
        this.checkOverloadsAdjacent(node.members, getOverload);
        super.visitInterfaceDeclaration(node);
    }

    public visitClassDeclaration(node: ts.ClassDeclaration) {
        this.visitMembers(node.members);
        super.visitClassDeclaration(node);
    }

    public visitTypeLiteral(node: ts.TypeLiteralNode) {
        this.visitMembers(node.members);
        super.visitTypeLiteral(node);
    }

    private visitStatements(statements: ts.Statement[]) {
        this.checkOverloadsAdjacent(statements, (statement) => {
            if (statement.kind === ts.SyntaxKind.FunctionDeclaration) {
                const name = (statement as ts.FunctionDeclaration).name;
                return name && { name: name.text, key: name.text };
            } else {
                return undefined;
            }
        });
    }

    private visitMembers(members: Array<ts.TypeElement | ts.ClassElement>) {
        this.checkOverloadsAdjacent(members, getOverload);
    }

    /** 'getOverloadName' may return undefined for nodes that cannot be overloads, e.g. a `const` declaration. */
    private checkOverloadsAdjacent<T extends ts.Node>(overloads: T[], getOverload: (node: T) => Overload | undefined) {
        let lastKey: string | undefined = undefined;
        const seen: { [key: string]: true } = Object.create(null);
        for (const node of overloads) {
            const overload = getOverload(node);
            if (overload) {
                const { name, key } = overload;
                if (key in seen && lastKey !== key) {
                    this.addFailureAtNode(node, Rule.FAILURE_STRING_FACTORY(name));
                }
                seen[key] = true;
                lastKey = key;
            } else {
                lastKey = undefined;
            }
        }
    }
}

interface Overload {
    /** Unique key for this overload. */
    key: string;
    /** Display name for the overload. `foo` and `static foo` have the same name but different keys. */
    name: string;
}

function isLiteralExpression(node: ts.Node): node is ts.LiteralExpression {
    return node.kind === ts.SyntaxKind.StringLiteral || node.kind === ts.SyntaxKind.NumericLiteral;
}

export function getOverloadKey(node: ts.TypeElement | ts.ClassElement): string | undefined {
    const o = getOverload(node);
    return o && o.key;
}

function getOverload(node: ts.TypeElement | ts.ClassElement): Overload | undefined {
    // Check that it *is* an overload.
    switch (node.kind) {
        case ts.SyntaxKind.ConstructSignature:
        case ts.SyntaxKind.Constructor:
            return { name: "constructor", key: "constructor" };
        case ts.SyntaxKind.CallSignature:
            return { name: "()", key: "()" };
        case ts.SyntaxKind.CallSignature:
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.MethodDeclaration:
            break;
        default:
            return undefined;
    }

    if (node.name === undefined) {
        return undefined;
    }

    const propertyInfo = getPropertyInfo(node.name);
    if (!propertyInfo) {
        return undefined;
    }

    const { name, computed } = propertyInfo;
    const isStatic = Lint.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword);
    const key = (computed ? "0" : "1") + (isStatic ? "0" : "1") + name;
    return { name, key };
}

function getPropertyInfo(name: ts.PropertyName): { name: string, computed?: boolean } | undefined {
    switch (name.kind) {
        case ts.SyntaxKind.Identifier:
            return { name: (name as ts.Identifier).text };
        case ts.SyntaxKind.ComputedPropertyName:
            const { expression } = (name as ts.ComputedPropertyName);
            return isLiteralExpression(expression) ? { name: expression.text } : { name: expression.getText(), computed: true };
        default:
            return isLiteralExpression(name) ? { name: (name as ts.StringLiteral).text } : undefined;
    }
}
