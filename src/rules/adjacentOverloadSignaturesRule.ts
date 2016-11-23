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
        this.checkOverloadsAdjacent(node.members, (member) => {
            return getTextOfPropertyName(member);
        });
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
                return name && name.text;
            } else {
                return undefined;
            }
        });
    }

    private visitMembers(members: Array<ts.TypeElement | ts.ClassElement>) {
        this.checkOverloadsAdjacent(members, (member) => {
            return getTextOfPropertyName(member);
        });
    }

    /** 'getOverloadName' may return undefined for nodes that cannot be overloads, e.g. a `const` declaration. */
    private checkOverloadsAdjacent<T extends ts.Node>(overloads: T[], getOverloadName: (node: T) => string | undefined) {
        let last: string | undefined = undefined;
        const seen: { [name: string]: true } = Object.create(null);
        for (const node of overloads) {
            const name = getOverloadName(node);
            if (name !== undefined) {
                if (name in seen && last !== name) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(),
                        Rule.FAILURE_STRING_FACTORY(name)));
                }
                seen[name] = true;
            }
            last = name;
        }
    }
}

function isLiteralExpression(node: ts.Node): node is ts.LiteralExpression {
    return node.kind === ts.SyntaxKind.StringLiteral || node.kind === ts.SyntaxKind.NumericLiteral;
}

function getTextOfPropertyName(node: ts.InterfaceDeclaration | ts.TypeElement | ts.ClassElement): string {
    let nameText: string;
    if (node.name == null) {
        return null;
    }
    switch (node.name.kind) {
        case ts.SyntaxKind.Identifier:
            nameText = (node.name as ts.Identifier).text;
            break;
        case ts.SyntaxKind.ComputedPropertyName:
            const { expression } = (node.name as ts.ComputedPropertyName);
            if (isLiteralExpression(expression)) {
                nameText = expression.text;
            }
            break;
        default:
            if (isLiteralExpression(node.name)) {
                nameText = (<ts.StringLiteral> node.name).text;
            }
    }

    const suffix = Lint.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword) ? " __static__" : "";
    return nameText + suffix;
}
