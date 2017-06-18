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

import * as utils from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "adjacent-overload-signatures",
        description: "Enforces function overloads to be consecutive.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        rationale: "Improves readability and organization by grouping naturally related items together.",
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING(name: string): string {
        return `All '${name}' signatures should be adjacent`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    const { sourceFile } = ctx;
    visitStatements(sourceFile.statements);
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.ModuleBlock:
                visitStatements((node as ts.ModuleBlock).statements);
                break;

            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.TypeLiteral: {
                const { members } = node as ts.InterfaceDeclaration | ts.ClassDeclaration | ts.TypeLiteralNode;
                addFailures(getMisplacedOverloads<ts.TypeElement | ts.ClassElement>(members, (member) =>
                    utils.isSignatureDeclaration(member) ? getOverloadKey(member) : undefined));
            }
        }

        return ts.forEachChild(node, cb);
    });

    function visitStatements(statements: ts.Statement[]): void {
        addFailures(getMisplacedOverloads(statements, (statement) =>
            utils.isFunctionDeclaration(statement) && statement.name !== undefined ? statement.name.text : undefined));
    }

    function addFailures(misplacedOverloads: ts.SignatureDeclaration[]): void {
        for (const node of misplacedOverloads) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING(printOverload(node)));
        }
    }
}

/** 'getOverloadName' may return undefined for nodes that cannot be overloads, e.g. a `const` declaration. */
function getMisplacedOverloads<T extends ts.Node>(overloads: T[], getKey: (node: T) => string | undefined): ts.SignatureDeclaration[] {
    const result: ts.SignatureDeclaration[] = [];
    let lastKey: string | undefined;
    const seen = new Set<string>();
    for (const node of overloads) {
        if (node.kind === ts.SyntaxKind.SemicolonClassElement) {
            continue;
        }

        const key = getKey(node);
        if (key !== undefined) {
            if (seen.has(key) && lastKey !== key) {
                result.push(node as any as ts.SignatureDeclaration);
            }
            seen.add(key);
            lastKey = key;
        } else {
            lastKey = undefined;
        }
    }
    return result;
}

function printOverload(node: ts.SignatureDeclaration): string {
    const info = getOverloadInfo(node);
    return typeof info === "string" ? info : info === undefined ? "<unknown>" : info.name;
}

export function getOverloadKey(node: ts.SignatureDeclaration): string | undefined {
    const info = getOverloadInfo(node);
    if (info === undefined) {
        return undefined;
    }

    const [computed, name] = typeof info === "string" ? [false, info] : [info.computed, info.name];
    const isStatic = Lint.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword);
    return (computed ? "0" : "1") + (isStatic ? "0" : "1") + name;
}

function getOverloadInfo(node: ts.SignatureDeclaration): string | { name: string, computed?: boolean } | undefined {
    switch (node.kind) {
        case ts.SyntaxKind.ConstructSignature:
        case ts.SyntaxKind.Constructor:
            return "constructor";
        case ts.SyntaxKind.CallSignature:
            return "()";
        default: {
            const { name } = node;
            if (name === undefined) {
                return undefined;
            }

            switch (name.kind) {
                case ts.SyntaxKind.Identifier:
                    return name.text;
                case ts.SyntaxKind.ComputedPropertyName:
                    const { expression } = name;
                    return utils.isLiteralExpression(expression) ? expression.text : { name: expression.getText(), computed: true };
                default:
                    return utils.isLiteralExpression(name) ? name.text : undefined;
            }
        }
    }
}
